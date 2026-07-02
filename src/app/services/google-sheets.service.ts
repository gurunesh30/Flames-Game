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
  private readonly sheetUrl = 'https://script.google.com/macros/s/AKfycbywo8hbN4E1qXdun43DBQG0oEcuhGP4457luXeKwKafYaPhWofzgok1t3xZYdaz7oRI/exec';

  constructor() {}

  /**
   * Save a FLAMES result to the Google Sheet
   * @param name1 - First name
   * @param name2 - Second name
   * @param result - The FLAMES relationship result
   */
  async saveResult(name1: string, name2: string, result: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const payload: FlamesResult = { name1, name2, result, timestamp };

    try {
      // Using Google Apps Script Web App endpoint
      // Replace the URL above with your actual deployed Apps Script URL
      const response = await fetch(this.sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }

      console.log('Result saved successfully');
    } catch (error) {
      console.error('Failed to save result:', error);
      // Silently fail - don't show errors to users
    }
  }
}
