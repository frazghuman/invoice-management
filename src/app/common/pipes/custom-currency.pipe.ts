import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'customCurrency',
  standalone: true
})
export class CustomCurrencyPipe extends CurrencyPipe implements PipeTransform {
  // Handle the first overload
  override transform(
    value: string | number | undefined,
    currencyCode?: string,
    display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
    digitsInfo?: string,
    locale?: string
  ): string | null;

  // Handle the second overload
  override transform(
    value: null | undefined,
    currencyCode?: string,
    display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
    digitsInfo?: string,
    locale?: string
  ): null;

  // Implement the method
  override transform(
    value: string | number | null | undefined,
    currencyCode: string = 'EUR',  // Set your default currency symbol here
    display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol',
    digitsInfo?: string,
    locale?: string
  ): string | null {
    return super.transform(value, currencyCode, display, digitsInfo, locale);
  }
}
