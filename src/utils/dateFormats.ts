import { format } from 'date-fns';

export const UI_DATE = 'dd.MM.yyyy';
export const UI_DATE_TIME_WITHOUT_Minute_FORMAT_DATE = 'dd.MM.yyyy HH:mm';

export const UI_DATE_TIME_WITHOUT_SECONDS_FORMAT_DATE = 'dd.MM.yyyy HH:mm:ss';

export const formatUiNotificationDate = (date: Date | number | string) =>
  format(new Date(date), UI_DATE_TIME_WITHOUT_Minute_FORMAT_DATE);

export const formatUiDate = (date: Date | number | string) => format(new Date(date), UI_DATE);

export const formatErrorDate = (date: Date | number | string) =>
  format(new Date(date), UI_DATE_TIME_WITHOUT_SECONDS_FORMAT_DATE);
