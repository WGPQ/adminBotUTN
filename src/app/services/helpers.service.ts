import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelpersService {
  constructor() {}

  initialLettersName(name: string) {
    const fullName = name?.split(' ');
    if (fullName.length > 1) {
      const firstLetter = fullName[0]?.charAt(0) || '';
      const lastLetter = fullName[1]?.charAt(0) || '';
      return `${firstLetter}${lastLetter}`;
    }
    return name.charAt(0);
  }
}
