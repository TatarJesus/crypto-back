export type Status =
  | 'Re-creation'
  | 'Not payment'
  | 'Created'
  | 'Updated'
  | 'Document preparation'
  | 'Document signing'
  | 'Document preparation re-open'
  | 'Document signing re-open'
  | 'Document preparation updated'
  | 'Document signing updated'
  | 'Processing'
  | 'Active'
  | 'Completed'
  | 'Paid';

export type PLATFORMS_TYPE = 'BINANCE' | 'BYBIT';
