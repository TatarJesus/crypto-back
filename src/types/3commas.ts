export interface SmartTrades {
  id: number;
  version: number;
  account: SmartTradesAccount;
  pair: string;
  instant: boolean;
  status: SmartTradesStatus;
  leverage: SmartTradesLeverage;
  position: SmartTradesPosition;
  take_profit: SmartTradesTakeProfit;
  stop_loss: {
    enabled: boolean;
  };
  reduce_funds: SmartTradesReduceFunds;
  market_close: SmartTradesMarketClose;
  note: string;
  note_raw: string;
  skip_enter_step: boolean;
  data: SmartTradesData;
  profit: SmartTradesProfit;
  margin: SmartTradesMargin;
  is_position_not_filled: boolean;
}

interface SmartTradesAccount {
  id: number;
  type: string;
  name: string;
  market: string;
  link: string;
}

interface SmartTradesStatus {
  type: string;
  title: string;
}

interface SmartTradesLeverage {
  enabled: boolean;
  type: string;
  value: number;
}

interface SmartTradesPosition {
  type: string;
  editable: boolean;
  units: {
    value: string;
    editable: boolean;
  };
  price: {
    value: number;
    value_without_commission: number;
    editable: boolean;
  };
  total: {
    value: number;
  };
  order_type: string;
  status: SmartTradesStatus;
}

interface SmartTradesTakeProfit {
  enabled: boolean;
  steps: TakeProfitStep[];
}

interface TakeProfitStep {
  order_type: string;
  volume: number;
  price: {
    type: string;
    value: number;
    percent: string;
  };
  trailing: {
    enabled: true;
    percent: string;
  };
}

interface SmartTradesReduceFunds {
  steps: ReduceFundStep[];
}

interface ReduceFundStep {
  id: number;
  type: string;
  status: {
    type: string;
    title: string;
    basic_type: string;
  };
  units: {
    value: string;
  };
  price: {
    value: string;
    value_without_commission: string;
  };
  total: {
    value: string;
  };
  filled: {
    units: string;
    total: string;
    price: string;
    value: string;
  };
  data: {
    cancelable: boolean;
    panic_sell_available: boolean;
  };
}

interface SmartTradesMarketClose extends Omit<ReduceFundStep, 'data'> {}

interface SmartTradesData {
  editable: boolean;
  current_price: {
    quote_volume: string;
    last: string;
  };
  target_price_type: string;
  base_order_finished: boolean;
  missing_funds_to_close: number;
  liquidation_price: number;
  average_enter_price: number;
  average_close_price: number;
  average_enter_price_without_commission: number;
  average_close_price_without_commission: number;
  panic_sell_available: boolean;
  add_funds_available: boolean;
  force_start_available: boolean;
  force_process_available: boolean;
  cancel_available: boolean;
  finished: boolean;
  base_position_step_finished: boolean;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  type: string;
}

interface SmartTradesProfit {
  volume: number;
  usd: number;
  percent: number;
  roe: number;
}

interface SmartTradesMargin {
  amount: number;
  total: number;
}

export interface Account {
  id: number;
  auto_balance_period: number;
  auto_balance_portfolio_id: any | null; //
  auto_balance_currency_change_limit: any | null; //
  autobalance_enabled: boolean;
  hedge_mode_available: boolean;
  hedge_mode_enabled: boolean;
  is_locked: boolean;
  smart_trading_supported: boolean;
  smart_selling_supported: boolean;
  available_for_trading: any | object; //
  stats_supported: boolean;
  trading_supported: boolean;
  market_buy_supported: boolean;
  market_sell_supported: boolean;
  conditional_buy_supported: boolean;
  bots_allowed: boolean;
  bots_ttp_allowed: boolean;
  bots_tsl_allowed: boolean;
  gordon_bots_available: boolean;
  multi_bots_allowed: boolean;
  created_at: string;
  updated_at: string;
  last_auto_balance: any | null; //
  fast_convert_available: boolean;
  grid_bots_allowed: boolean;
  api_key_invalid: boolean;
  market_icon: string;
  deposit_enabled: boolean;
  include_in_summary: boolean;
  supported_market_types: any[]; //
  primary_display_currency_profit_percentage: [Object];
  primary_display_currency_profit: [Object];
  day_profit_primary_display_currency_percentage: [Object];
  day_profit_primary_display_currency: [Object];
  primary_display_currency_amount: [Object];
  total_primary_display_currency_profit: [Object];
  available_include_in_summary: true;
  api_key: string;
  name: string;
  auto_balance_method: any | null; //
  auto_balance_error: any | null; //
  customer_id: any | null; //
  subaccount_name: any | null; //
  lock_reason: string;
  btc_amount: string;
  usd_amount: string;
  day_profit_btc: string;
  day_profit_usd: string;
  day_profit_btc_percentage: string;
  day_profit_usd_percentage: string;
  btc_profit: string;
  usd_profit: string;
  usd_profit_percentage: string;
  btc_profit_percentage: string;
  total_btc_profit: string;
  total_usd_profit: string;
  pretty_display_type: string;
  exchange_name: string;
  market_code: string;
  api_keys_state: string;
}
