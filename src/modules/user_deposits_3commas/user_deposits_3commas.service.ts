import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { schedule } from 'node-cron';
import { UserDeposits3Commas } from '@/modules/user_deposits_3commas/entities/user_deposits_3commas.entity';
import { CreateUserDeposits3CommasDto } from '@/modules/user_deposits_3commas/dto/create-user_deposits_3commas.dto';
import { API } from '3commas-typescript';
import { ConfigService } from '@nestjs/config';
import { PLATFORMS_TYPE } from '@/types/deposits';
import { addMonths, startOfQuarter } from 'date-fns';
import { formatErrorDate, formatUiDate } from '@/utils/dateFormats';
import { NotificationsForUser } from '@/const/notifications';
import { UserNotification } from '@/modules/user_notifications/entities/user_notification.entity';
import { Account, SmartTrades } from '@/types/3commas';

@Injectable()
export class UserDeposits3CommasService {
  private readonly api3C: API;

  private accounts: Account[] = [];

  constructor(
    @InjectRepository(UserDeposits3Commas)
    private readonly userDeposit3CommasRepository: Repository<UserDeposits3Commas>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    @InjectRepository(UserNotification)
    private readonly userNotificationRepository: Repository<UserNotification>,
  ) {
    schedule('*/3 * * * *', async () => {
      await this.getAccounts3Commas();
    });

    this.api3C = new API({
      key: this.configService.get('THREE_COMMAS_ACCESS_KEY'),
      secrets: this.configService.get('THREE_COMMAS_ACCESS_SECRET'),
      timeout: 60000,
      forcedMode: 'real',
      errorHandler: (response, reject) => {
        const { error, error_description } = response;
      },
    });

    this.getAccounts3Commas();
  }

  async getAccounts3Commas() {
    try {
      this.accounts = await this.api3C.getExchange();
    } catch (error) {
      console.log(`${formatErrorDate(new Date())} | Error get accounts 3commas:`, error);
    }
  }

  async getAccountsForOneDeposit(deposit_id: number) {
    const customName = `${deposit_id}_crypto`;

    return this.accounts.filter((account) => {
      const indexName = account.name.indexOf(customName);

      return account.name.slice(indexName) === customName;
    });
  }

  async getBalanceAndProfitDeposit(deposit: any) {
    const balanceAfter =
      deposit.accounts.reduce((accumulator, account) => {
        return accumulator + +account.usd_amount;
      }, 0) - deposit.amount_start;

    const balance = balanceAfter <= 0 ? 0 : balanceAfter;

    delete deposit['accounts'];

    return {
      balance: +balance.toFixed(2),
      allTimeProfits: +balance.toFixed(2),
      allTimeProfitPercents: +((balance * 100) / deposit.amount_start - 100).toFixed(3),
    };
  }

  async getUser(id: number) {
    return await this.userRepository.findOne({
      relations: ['deposits_3commas'],
      where: {
        id: id,
      },
    });
  }

  async getTypesPlatform(platform: PLATFORMS_TYPE) {
    switch (platform) {
      case 'BINANCE':
        return ['BIN', 'BIN_FUTH'];
      case 'BYBIT':
        return ['BYB', 'BYB_PER', 'BYB_SPOT'];
      default:
        return [];
    }
  }

  async getCharts(accounts: Account[], dateFrom: Date) {
    const accountWithCharts = await Promise.all(
      accounts.map(async (account) => {
        return await this.api3C.getBalanceChartData(account.id, {
          date_from: formatUiDate(dateFrom),
        });
      }),
    );

    if (!accountWithCharts.length) return [];

    const generalChart = accountWithCharts[0].map((item) => {
      return {
        date: formatUiDate(new Date(item.date * 1000)),
        usd: item.usd,
        usd_deposit_amount: item.usd_deposit_amount,
      };
    });

    accountWithCharts.forEach((chart, index) => {
      if (index !== 0) {
        return chart.forEach((point, subIndex) => {
          generalChart[subIndex].usd += point.usd;
          generalChart[subIndex].usd_deposit_amount += point.usd_deposit_amount;
        });
      }
    });

    generalChart.pop();

    return generalChart;
  }

  async getAccountsForUserByDeposit(deposit_id: number) {
    const deposit = await this.userDeposit3CommasRepository.findOne({
      where: {
        id: deposit_id,
      },
    });

    const accounts = await this.getAccountsForOneDeposit(deposit_id);

    const allSmartTrades = await Promise.all(
      accounts.map(async (account) => {
        return await this.api3C.customRequest('GET', 2, '/smart_trades', {
          account_id: account.id,
          per_page: 100,
        });
      }),
    );

    const positions: SmartTrades[] = [].concat(...allSmartTrades);

    const filteredHistoryPosition = positions
      .filter(
        (item) =>
          item.status.type !== 'failed' &&
          item.status.type !== 'cancelled' &&
          item.status.type !== 'waiting_position' &&
          item.data.closed_at,
      )
      .map((item) => {
        return {
          token: item.pair,
          volume: +(+item.profit.volume).toFixed(2),
          percent: +item.profit.percent,
          openPrice: +item.data.average_enter_price,
          closePrice: +item.data.average_close_price,
          startDate: formatUiDate(item.data.created_at),
          endDate: formatUiDate(item.data.closed_at),
        };
      });

    const currentPosition = positions
      .filter((item) => item.status.type === 'waiting_targets' && !item.data.closed_at)
      .map((item) => {
        return {
          token: item.pair,
          priceInUSDT: +item.data.current_price.last,
          quantity: +item.position.units.value,
          totalInUSDT: +(+item.position.total.value + +item.profit.volume).toFixed(2),
          pnl: +(+item.profit.volume).toFixed(2),
        };
      })
      .sort((item1, item2) => item2.totalInUSDT - item1.totalInUSDT)
      .slice(0, 5);

    const charts = await this.getCharts(accounts, new Date(deposit.created_at));

    const balanceAndProfit = await this.getBalanceAndProfitDeposit({
      ...deposit,
      accounts: accounts,
    });

    const currentDate = new Date();

    const startOfCurrentQuarter = startOfQuarter(currentDate);

    const startOfNextQuarter = addMonths(startOfCurrentQuarter, 3);

    return {
      ...deposit,
      balance: +balanceAndProfit.balance.toFixed(3),
      allTimeProfits: +balanceAndProfit.allTimeProfits.toFixed(3),
      allTimeProfitPercents:
        balanceAndProfit.allTimeProfitPercents === -100
          ? 0
          : balanceAndProfit.allTimeProfitPercents,
      created_at: formatUiDate(deposit.created_at),
      updated_at: formatUiDate(deposit.updated_at),
      pay_date: formatUiDate(startOfNextQuarter),
      filteredHistoryPosition: filteredHistoryPosition,
      currentPosition: currentPosition,
      charts: charts,
    };
  }

  async createDeposit(createUserDeposits3CommasDto: CreateUserDeposits3CommasDto, user_id: number) {
    const user = await this.getUser(user_id);

    const types = await this.getTypesPlatform(createUserDeposits3CommasDto.platform);

    const deposit: UserDeposits3Commas = await this.userDeposit3CommasRepository.save({
      platform: createUserDeposits3CommasDto.platform,
      status: 'Created',
      user: user,
    });

    for (const type of types) {
      try {
        await this.api3C.addExchangeAccount({
          type: type,
          name: `${type}_${deposit.id}_crypto`,
          api_key: createUserDeposits3CommasDto.api_key,
          secret: createUserDeposits3CommasDto.secret_key,
        });
      } catch (e) {
        console.log('e', e);
        await this.userDeposit3CommasRepository.remove(deposit);
        throw new HttpException(e, 400);
      }
    }

    await this.userNotificationRepository.save({
      user: user,
      type: NotificationsForUser.SUCCESSFUL,
      description: `Создан депозит 3Commas`,
    });

    return 'Successful';
  }
}
