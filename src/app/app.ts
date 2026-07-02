import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>FLAMES Calculator</h1>
      
      <div class="input-group">
        <input
          type="text"
          [(ngModel)]="name1"
          placeholder="Enter first name"
          class="name-input"
        />
        <input
          type="text"
          [(ngModel)]="name2"
          placeholder="Enter second name"
          class="name-input"
        />
      </div>
      
      <button (click)="calculateFlames()" class="calculate-btn">
        Calculate FLAMES
      </button>
      
      <div *ngIf="result" class="result">
        <h2>Result: {{ result }}</h2>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 500px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
      font-family: Arial, sans-serif;
    }
    
    h1 {
      color: #e91e63;
      margin-bottom: 30px;
    }
    
    .input-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .name-input {
      padding: 12px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      text-align: center;
    }
    
    .name-input:focus {
      border-color: #e91e63;
      outline: none;
    }
    
    .calculate-btn {
      background: #e91e63;
      color: white;
      padding: 12px 24px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .calculate-btn:hover {
      background: #c2185b;
    }
    
    .result {
      margin: 20px 0;
      padding: 20px;
      background: #fce4ec;
      border-radius: 8px;
    }
    
    .result h2 {
      margin: 0;
      color: #c2185b;
    }
  `]
})
export class AppComponent {
  name1: string = '';
  name2: string = '';
  result: string = '';

  constructor(private googleSheetsService: GoogleSheetsService) {}

  calculateFlames() {
    let n1 = this.name1.toLowerCase().replace(/\s/g, '');
    let n2 = this.name2.toLowerCase().replace(/\s/g, '');

    for (let char of n1) {
      if (n2.includes(char)) {
        n1 = n1.replace(char, '');
        n2 = n2.replace(char, '');
      }
    }

    const count = n1.length + n2.length;
    const flames = ['Friends', 'Love', 'Affection', 'Marriage', 'Enemies', 'Siblings'];

    let index = (count - 1) % flames.length;
    this.result = flames[index];
    
    // Automatically save result to Google Sheets (hidden)
    this.googleSheetsService.saveResult(this.name1, this.name2, this.result);
  }
}
