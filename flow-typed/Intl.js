// TODO: Remove this file when Flow adds support
// TODO: Add types for all string enums

declare var Intl: {
  Collator: Class<Collator>,
  DateTimeFormat: Class<DateTimeFormat>,
  NumberFormat: Class<NumberFormat>,
};

declare type LocaleMatcher = 'best fit' | 'lookup';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
// TODO: document formatToParts, resolvedOptions
declare class NumberFormat {
  constructor(locales: string | Array<string>, options?: NumberFormatOptions): NumberFormat;
  format(value: number): string;
}

declare type NumberFormatStyle = 'decimal' | 'currency' | 'percent';
declare type NumberFormatCurrencyDisplay = 'symbol' | 'code' | 'name';

declare type NumberFormatOptions = {
  localeMatcher?: LocaleMatcher,
  style?: NumberFormatStyle,
  currency?: string, // required when style === 'currency'
  currencyDisplay?: NumberFormatCurrencyDisplay,
  useGrouping?: boolean, // default = true
  minimumIntegerDigits?: number, // 1-21, default = 1
  minimumFractionDigits?: number, // 0-20, default based on currency or 0 for other styles
  maximumFractionDigits?: number, // 0-20, default varies
  minimumSignificantDigits?: number, // 1-21, default = 1
  maximumSignificantDigits?: number, // minimumSignificantDigits-21, default = minimumSignificantDigits
};

declare class Collator {
  constructor(locales?: string | Array<string>, options?: CollatorOptions): Collator;
  compare(a: string, b: string): number;
}

type CollatorOptions = {
  localeMatcher?: LocaleMatcher,
  usage?: 'sort' | 'search',
  sensitivity?: 'base' | 'accent' | 'case' | 'variant',
  ignorePunctuation?: boolean,
  numeric?: boolean,
  caseFirst?: 'upper' | 'lower' | 'false',
};

declare class DateTimeFormat {
  constructor(locales?: string | Array<string>, options?: DateTimeFormatOptions): DateTimeFormat;
  static (locales?: string | Array<string>, options?: DateTimeFormatOptions): DateTimeFormat;
  format(a: Date | number): string;
}

type DateTimeFormatOptions = {
  localeMatcher?: LocaleMatcher,
  timeZone?: string,
  hour12?: boolean,
  formatMatcher?: 'basic' | 'best fit',
  weekday?: 'narrow' | 'short' | 'long',
  era?: 'narrow' | 'short' | 'long',
  year?: 'numeric' | '2-digit',
  month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long',
  day?: 'numeric' | '2-digit',
  hour?: 'numeric' | '2-digit',
  minute?: 'numeric' | '2-digit',
  second?: 'numeric' | '2-digit',
  timeZoneName?: 'short' | 'long',
};
