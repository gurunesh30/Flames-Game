import 'vitest';
import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { AppComponent } from './app';

describe('App Logic', () => {
  it('should define FLAMES meanings correctly', () => {
    // Create class instance without dependencies for unit test
    const app = new AppComponent(null as any, null as any);
    expect(app.meanings['F']).toBe('Friends');
    expect(app.meanings['L']).toBe('Love');
    expect(app.meanings['A']).toBe('Affection');
    expect(app.meanings['M']).toBe('Marriage');
    expect(app.meanings['E']).toBe('Enemies');
    expect(app.meanings['S']).toBe('Siblings');
  });
});
