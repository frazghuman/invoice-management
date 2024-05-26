// src/app/currency.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currencySymbols: { [key: string]: string } = {
    'USD': '$',
    'EUR': '€',
    'JPY': '¥',
    'GBP': '£',
    'AUD': 'A$',
    'CAD': 'C$',
    'CHF': 'CHF',
    'CNY': '¥',
    'SEK': 'kr',
    'NZD': 'NZ$',
    'INR': '₹',
    // Add more currencies as needed
  };

  getCurrenciesList() {
    return Object.keys(this.currencySymbols);
  }

  getCurrencySymbol(code: string): string {
    return this.currencySymbols[code] || '';
  }
}
