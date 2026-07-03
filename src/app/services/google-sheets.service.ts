import { Injectable } from '@angular/core';

export interface FlamesResult {
  name1: string;
  name2: string;
  result: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  // Your live Apps Script deployment URL
  private readonly sheetUrl = 'https://script.google.com/macros/s/AKfycbxG04Un1kpGtL2wWKL3AgCmPdU8WkQu-4eyizReDpC2xylJXfpbhP0s4qaK2Zh4i5iu/exec';

  constructor() {}

  /**
   * Save a FLAMES result to the Google Sheet
   * @param name1 - First name
   * @param name2 - Second name
   * @param result - The FLAMES relationship result
   */
  async saveResult(name1: string, name2: string, result: string): Promise<void> {
    const timestamp = new Date().toISOString();
    
    // URLSearchParams automatically handles all spaces and special characters.
    const params = new URLSearchParams({
      name1: name1,
      name2: name2,
      result: result,
      timestamp: timestamp
    });

    try {
      // 1. Removed mode: 'no-cors' so fetch can natively handle Google's redirect.
      // 2. Kept as GET request because Apps Script redirects GETs perfectly without preflight CORS blocks.
      const response = await fetch(`${this.sheetUrl}?${params.toString()}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }

      // Read the backend success message from Google Apps Script
      const data = await response.json();
      console.log('Successfully saved to Google Sheet!', data);
    } catch (error) {
      console.error('Failed to save result to Google Sheet:', error);
    }
  }
}