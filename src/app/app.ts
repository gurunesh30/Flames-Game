import { Component, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleSheetsService } from './services/google-sheets.service';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

interface Letter { char: string; strikeout: boolean; }
interface FLetter { char: string; active: boolean; eliminated: boolean; winner: boolean; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('landingEl') landingEl!: ElementRef<HTMLElement>;
  @ViewChild('calcEl')    calcEl!: ElementRef<HTMLElement>;
  @ViewChild('resultCard') resultCard!: ElementRef<HTMLElement>;
  @ViewChild('ball') ballEl!: ElementRef<HTMLElement>;

  name1 = '';
  name2 = '';
  result = '';
  finalResult = '';
  countLabel = '';
  isCalculating = false;
  ballPosition = 0;

  name1Letters: Letter[] = [];
  name2Letters: Letter[] = [];
  flamesLetters: FLetter[] = [];

  readonly meanings: Record<string,string> = {
    F:'Friends', L:'Love', A:'Affection', M:'Marriage', E:'Enemies', S:'Siblings'
  };
  private readonly FLAMES = ['F','L','A','M','E','S'];

  constructor(private zone: NgZone, private sheets: GoogleSheetsService) {}

  ngAfterViewInit() {
    gsap.set(this.calcEl.nativeElement, { x: '100%', autoAlpha: 0 });
    gsap.set(this.resultCard.nativeElement, { autoAlpha: 0, scale: 0.5, rotation: -15 });
    gsap.set(this.ballEl.nativeElement, { x: 0, y: 0, scale: 1, autoAlpha: 0 });
    this.animateLanding();
  }

  animateLanding() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.hero-tag',   { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 })
      .fromTo('.hero-title', { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, '-=0.3')
      .fromTo('.name-field', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15 }, '-=0.5')
      .fromTo('.cta-btn',    { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.2');
  }

  goCalculate() {
    if (!this.name1.trim() || !this.name2.trim()) return;

    const landing = this.landingEl.nativeElement;
    const calc    = this.calcEl.nativeElement;

    this.result = '';
    this.finalResult = '';
    this.countLabel = '';
    this.name1Letters = this.name1.toLowerCase().replace(/\s/g,'').split('').map(c=>({ char:c, strikeout:false }));
    this.name2Letters = this.name2.toLowerCase().replace(/\s/g,'').split('').map(c=>({ char:c, strikeout:false }));
    this.flamesLetters = this.FLAMES.map((c,i)=>({ char:c, active:true, eliminated:false, winner:false }));
    gsap.set(this.resultCard.nativeElement, { autoAlpha: 0, scale: 0.5, rotation: -15, y: 30 });
    gsap.set(this.ballEl.nativeElement, { x: 0, y: 0, scale: 1, autoAlpha: 0 });

    const tl = gsap.timeline({
      onComplete: () => this.zone.run(() => setTimeout(() => this.runCalculation(), 100))
    });
    tl.to(landing, { x: '-100%', autoAlpha: 0, duration: 0.5, ease: 'power3.inOut' })
      .fromTo(calc, { x: '100%', autoAlpha: 0 }, { x: '0%', autoAlpha: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25');
  }

  runCalculation() {
    this.isCalculating = true;
    this.name1Letters = [...this.name1Letters];
    this.name2Letters = [...this.name2Letters];
    this.flamesLetters = [...this.flamesLetters];

    // Animate tiles entrance
    gsap.fromTo('.ftile', { y: -60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1, ease: 'bounce.out' });

    // Show ball at start position
    const ball = this.ballEl.nativeElement;
    gsap.set(ball, { x: 0, y: 0, scale: 1, autoAlpha: 1 });
    this.countLabel = 'Eliminating letters...';

    setTimeout(() => this.animateElimination(), 800);
  }

  async animateElimination() {
    const n1 = this.name1Letters;
    const n2 = this.name2Letters;
    let eliminated: string[] = [];

    for (let i = 0; i < n1.length; i++) {
      if (n1[i].strikeout) continue;
      for (let j = 0; j < n2.length; j++) {
        if (!n2[j].strikeout && n1[i].char === n2[j].char) {
          n1[i].strikeout = true;
          n2[j].strikeout = true;
          eliminated.push(n1[i].char);
          this.name1Letters = [...n1];
          this.name2Letters = [...n2];
          await this.delay(200);
          break;
        }
      }
    }

    const count = n1.filter(l=>!l.strikeout).length + n2.filter(l=>!l.strikeout).length;
    const c = count === 0 ? 1 : count;

    this.countLabel = `Ball will bounce ${c} time${c>1?'s':''} through FLAMES...`;
    await this.delay(600);

    // Ball bouncing animation through FLAMES
    await this.runBouncingBall(c);
  }

  async runBouncingBall(count: number) {
    const ball = this.ballEl.nativeElement;
    let activeTiles = [...this.FLAMES];
    let currentIdx = 0;
    const totalBounces = count;

    for (let bounce = 0; bounce < totalBounces + activeTiles.length - 1; bounce++) {
      // Move ball to next tile
      currentIdx = currentIdx % activeTiles.length;
      const origIdx = this.FLAMES.indexOf(activeTiles[currentIdx]);
      const tile = this.calcEl.nativeElement.querySelector<HTMLElement>(`[data-idx="${origIdx}"]`);

      if (tile) {
        const rect = tile.getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();
        const dx = rect.left + rect.width/2 - ballRect.left - ballRect.width/2;
        const dy = rect.top + rect.height/2 - ballRect.top - ballRect.height/2;

        // Bounce up to the tile
        await new Promise<void>(resolve => {
          gsap.to(ball, {
            x: dx, y: dy - 50,
            duration: 0.25, ease: 'power2.out',
            onComplete: () => resolve()
          });
        });

        // Drop down (bounce)
        await new Promise<void>(resolve => {
          gsap.to(ball, {
            y: dy + 20,
            duration: 0.2, ease: 'bounce.out',
            onComplete: () => resolve()
          });
        });
      }

      // Eliminate current letter
      const elim = activeTiles[currentIdx];
      this.zone.run(() => {
        const fl = this.flamesLetters.find(f => f.char === elim);
        if (fl) { fl.active = false; fl.eliminated = true; }
      });

      // Remove from active
      activeTiles.splice(currentIdx, 1);
      if (currentIdx >= activeTiles.length) currentIdx = 0;

      this.countLabel = `Eliminating ${elim}...`;
      await this.delay(300);
    }

    // Result!
    const finalChar = activeTiles[0];
    this.zone.run(() => {
      this.result = finalChar;
      this.finalResult = this.meanings[finalChar];
      this.isCalculating = false;
      this.countLabel = '';
      const fl = this.flamesLetters.find(f => f.char === finalChar);
      if (fl) { fl.winner = true; fl.active = true; fl.eliminated = false; }
    });

    // Hide ball
    gsap.to(ball, { autoAlpha: 0, scale: 0, duration: 0.3 });

    await this.delay(200);

    // Trigger confetti!
    this.triggerConfetti();

    // Reveal result card
    gsap.to(this.resultCard.nativeElement, {
      autoAlpha: 1, scale: 1, rotation: 0, y: 0,
      duration: 0.8, ease: 'elastic.out(1, 0.5)'
    });

    this.sheets.saveResult(this.name1, this.name2, this.finalResult);
  }

  triggerConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff2d6b', '#ff7b3a', '#8b5cf6', '#06b6d4', '#f59e0b']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff2d6b', '#ff7b3a', '#8b5cf6', '#06b6d4', '#f59e0b']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    // Big burst from center
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#ff2d6b', '#ff7b3a', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981']
      });
    }, 300);
  }

  reset() {
    const landing = this.landingEl.nativeElement;
    const calc    = this.calcEl.nativeElement;

    const tl = gsap.timeline({
      onComplete: () => this.zone.run(() => {
        this.name1 = ''; this.name2 = '';
        this.result = ''; this.finalResult = '';
        this.isCalculating = false;
        this.countLabel = '';
        this.animateLanding();
      })
    });
    tl.to(calc,      { x: '100%', autoAlpha: 0, duration: 0.5, ease: 'power3.inOut' })
      .fromTo(landing, { x: '-100%', autoAlpha: 0 }, { x: '0%', autoAlpha: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25');
  }

  delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}

