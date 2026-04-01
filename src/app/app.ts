export class AppComponent {
  name1: string = '';
  name2: string = '';
  result: string = '';

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
  }
}
