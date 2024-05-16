import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCapitalize',
  standalone: true
})
export class CustomCapitalizePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()  // Convert the entire string to lowercase
      .split('-')     // Split the string into an array on underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize the first letter of each word
      .join(' ');     // Join the array back into a single string with spaces
  }

}
