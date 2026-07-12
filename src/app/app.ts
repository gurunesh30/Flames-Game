import { Component, ElementRef, ViewChild, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe, LowerCasePipe } from '@angular/common';
import { GoogleSheetsService } from './services/google-sheets.service';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

interface Letter { char: string; strikeout: boolean; }
interface FLetter { char: string; active: boolean; eliminated: boolean; winner: boolean; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, LowerCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('landingEl') landingEl!: ElementRef<HTMLElement>;
  @ViewChild('calcEl')    calcEl!: ElementRef<HTMLElement>;
  @ViewChild('calcMainEl') calcMainEl!: ElementRef<HTMLElement>;
  @ViewChild('resultCard') resultCard!: ElementRef<HTMLElement>;
  @ViewChild('ball') ballEl!: ElementRef<HTMLElement>;
  @ViewChild('gunAnimation') gunAnimationEl!: ElementRef<HTMLElement>;

  name1 = '';
  name2 = '';
  result = '';
  finalResult = '';
  countLabel = '';
  isCalculating = false;
  ballPosition = 0;
  showGunAnimation = false;
  specialResult = '';

  name1Letters: Letter[] = [];
  name2Letters: Letter[] = [];
  flamesLetters: FLetter[] = [];

  readonly meanings: Record<string,string> = {
    F:'Friends', L:'Love', A:'Affection', M:'Marriage', E:'Enemies', S:'Siblings'
  };
  private readonly FLAMES = ['F','L','A','M','E','S'];

  constructor(private zone: NgZone, private sheets: GoogleSheetsService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    gsap.set(this.calcEl.nativeElement, { x: '100%', autoAlpha: 0 });
    gsap.set(this.resultCard.nativeElement, { autoAlpha: 0, scale: 0.5, rotation: -15 });
    gsap.set(this.ballEl.nativeElement, { x: 0, y: 0, scale: 1, autoAlpha: 0 });
    gsap.set(this.gunAnimationEl.nativeElement, { autoAlpha: 0, scale: 0 });
    this.animateLanding();
  }

  animateLanding() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.hero-tag',   { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 })
      .fromTo('.hero-title', { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, '-=0.3')
      .fromTo('.name-field', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15 }, '-=0.5')
      .fromTo('.cta-btn',    { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.2');
  }

  // Check for special names before starting calculation
  checkSpecialNames(): boolean {
    const name1Lower = this.name1.toLowerCase().trim();
    const name2Lower = this.name2.toLowerCase().trim();

    // Check if either name is "vignesh"
    if (name1Lower === 'vignesh' || name2Lower === 'vignesh' || name1Lower === 'shalini' || name2Lower === 'shalini') {
      this.showSpecialResult('taken');
      return true;
    }

    // Check if either name is "gurunesh"
    if (name1Lower === 'gurunesh' || name2Lower === 'gurunesh') {
      this.showSpecialResult('sorry he has a wife');
      return true;
    }

    // Check if either name is "santhoshkumar"
    if (name1Lower === 'santhoshkumar' || name2Lower === 'santhoshkumar') {
      this.showGunAnimation = true;
      this.showSpecialResult('');
      this.triggerGunAnimation();
      return true;
    }

    return false;
  }

  showSpecialResult(message: string) {
    this.specialResult = message;
    this.finalResult = message;
    this.isCalculating = false;
    this.countLabel = '';
    
    // Show result card with special message
    const card = this.resultCard.nativeElement;
    card.style.pointerEvents = 'auto';
    gsap.to(card, {
      autoAlpha: 1,
      scale: 1,
      rotation: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    });
  }

  triggerGunAnimation() {
    const gunEl = this.gunAnimationEl.nativeElement;
    
    // Show gun with dramatic entrance
    gsap.to(gunEl, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(2)'
    });

    // Create shooting animation sequence
    const tl = gsap.timeline();
    
    // Gun recoil animation
    tl.to(gunEl, {
      x: -10,
      rotation: -5,
      duration: 0.1,
      ease: 'power2.out'
    })
    .to(gunEl, {
      x: 0,
      rotation: 0,
      duration: 0.2,
      ease: 'back.out(1.5)'
    })
    .to(gunEl, {
      x: -15,
      rotation: -8,
      duration: 0.1,
      ease: 'power2.out'
    })
    .to(gunEl, {
      x: 0,
      rotation: 0,
      duration: 0.3,
      ease: 'back.out(2)'
    })
    .to(gunEl, {
      scale: 1.2,
      duration: 0.1,
      ease: 'power2.out'
    })
    .to(gunEl, {
      scale: 1,
      duration: 0.2,
      ease: 'back.out(1.5)'
    });

    // Flash effect
    setTimeout(() => {
      document.body.style.backgroundColor = '#fff';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 100);
    }, 200);

    // Show result after gun animation
    setTimeout(() => {
      this.zone.run(() => {
        this.specialResult = '💀 Eliminated!';
        this.finalResult = '💀 Eliminated!';
        this.isCalculating = false;
        this.countLabel = '';
        
        // Hide gun
        gsap.to(gunEl, {
          autoAlpha: 0,
          scale: 0,
          duration: 0.5,
          ease: 'power2.in'
        });

        // Show result card
        const card = this.resultCard.nativeElement;
        card.style.pointerEvents = 'auto';
        gsap.to(card, {
          autoAlpha: 1,
          scale: 1,
          rotation: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)'
        });

        // Add dramatic confetti (red themed)
        this.triggerSpecialConfetti();
      });
      this.cdr.detectChanges();
    }, 1500);
  }

  triggerSpecialConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff0000', '#cc0000', '#990000', '#ff3333', '#ff6666']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff0000', '#cc0000', '#990000', '#ff3333', '#ff6666']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#ff0000', '#cc0000', '#990000', '#ff3333', '#ff6666', '#ff9999']
      });
    }, 300);
  }

  goCalculate() {
    if (!this.name1.trim() || !this.name2.trim()) return;

    // Check for special names first
    if (this.checkSpecialNames()) {
      // If special name found, skip the normal calculation but still show the calculation view
      const landing = this.landingEl.nativeElement;
      const calc    = this.calcEl.nativeElement;

      const tl = gsap.timeline();
      tl.to(landing, { x: '-100%', autoAlpha: 0, duration: 0.5, ease: 'power3.inOut' })
        .fromTo(calc, { x: '100%', autoAlpha: 0 }, { x: '0%', autoAlpha: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25');
      
      // For santhoshkumar, show gun animation after transition
      if (this.showGunAnimation) {
        setTimeout(() => {
          this.triggerGunAnimation();
        }, 800);
      }
      return;
    }

    // Normal calculation flow
    const landing = this.landingEl.nativeElement;
    const calc    = this.calcEl.nativeElement;

    this.result = '';
    this.finalResult = '';
    this.countLabel = '';
    this.specialResult = '';
    this.name1Letters = this.name1.toLowerCase().replace(/\s/g,'').split('').map(c=>({ char:c, strikeout:false }));
    this.name2Letters = this.name2.toLowerCase().replace(/\s/g,'').split('').map(c=>({ char:c, strikeout:false }));
    this.flamesLetters = this.FLAMES.map((c,i)=>({ char:c, active:true, eliminated:false, winner:false }));
    this.resultCard.nativeElement.style.pointerEvents = 'none';
    gsap.set(this.resultCard.nativeElement, { autoAlpha: 0, scale: 0.5, rotation: -15, y: 30 });
    gsap.set(this.ballEl.nativeElement, { x: 0, y: 0, scale: 1, autoAlpha: 0 });
    this.cdr.detectChanges();

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
    this.countLabel = 'Comparing letters...';
    this.cdr.detectChanges();

    // Animate tiles entrance
    gsap.fromTo('.ftile', { y: -60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1, ease: 'bounce.out' });

    // Hide ball initially
    const ball = this.ballEl.nativeElement;
    gsap.set(ball, { scale: 0, autoAlpha: 0 });

    setTimeout(() => this.animateElimination(), 800);
  }

  async animateElimination() {
    const n1 = this.name1Letters;
    const n2 = this.name2Letters;

    for (let i = 0; i < n1.length; i++) {
      if (n1[i].strikeout) continue;
      for (let j = 0; j < n2.length; j++) {
        if (!n2[j].strikeout && n1[i].char === n2[j].char) {
          n1[i].strikeout = true;
          n2[j].strikeout = true;

          // Must run inside zone so Angular detects the change and applies .struck class
          this.zone.run(() => {
            this.name1Letters = [...n1];
            this.name2Letters = [...n2];
          });
          this.cdr.detectChanges();

          await this.delay(300);
          break;
        }
      }
    }

    const count = n1.filter(l => !l.strikeout).length + n2.filter(l => !l.strikeout).length;
    const c = count === 0 ? 1 : count;

    this.zone.run(() => {
      this.countLabel = `${c} letter${c > 1 ? 's' : ''} remaining. Preparing oracle...`;
    });
    this.cdr.detectChanges();
    await this.delay(1000);

    // Ball bouncing animation through FLAMES
    await this.runBouncingBall(c);
  }

  async runBouncingBall(count: number) {
    const ball = this.ballEl.nativeElement;
    const calcMain = this.calcMainEl.nativeElement;
    let activeTiles = [...this.FLAMES];
    let currentIdx = 0;

    // Helper: get ball target position relative to .calc-main (the ball's positioned ancestor)
    const getBallPos = (tile: HTMLElement) => {
      const mainRect = calcMain.getBoundingClientRect();
      const tileRect = tile.getBoundingClientRect();
      return {
        x: tileRect.left - mainRect.left + tileRect.width / 2 - 16,
        y: tileRect.top - mainRect.top + tileRect.height / 2 - 16
      };
    };

    // Position ball at the first tile and fade in
    const firstTile = calcMain.querySelector<HTMLElement>(`[data-idx="0"]`);
    if (firstTile) {
      const pos = getBallPos(firstTile);
      gsap.set(ball, { x: pos.x, y: pos.y, scale: 0, autoAlpha: 1 });
      this.cdr.detectChanges();
      await new Promise<void>(resolve => {
        gsap.to(ball, { scale: 1, duration: 0.3, ease: 'back.out(2)', onComplete: () => resolve() });
      });
    }

    // Loop until 1 tile remains
    while (activeTiles.length > 1) {
      // Count `count` steps
      for (let step = 0; step < count; step++) {
        const tempIdx = (currentIdx + step) % activeTiles.length;
        const letter = activeTiles[tempIdx];
        const origIdx = this.FLAMES.indexOf(letter);
        const tile = calcMain.querySelector<HTMLElement>(`[data-idx="${origIdx}"]`);

        if (tile) {
          const pos = getBallPos(tile);

          this.zone.run(() => {
            this.countLabel = `Counting... ${step + 1} (${letter})`;
          });
          this.cdr.detectChanges();

          // Animate bounce: hop up then land on tile
          await new Promise<void>(resolve => {
            const tl = gsap.timeline({ onComplete: () => resolve() });
            tl.to(ball, {
              x: pos.x,
              y: pos.y - 35,
              duration: 0.18,
              ease: 'power2.out'
            })
            .to(ball, {
              y: pos.y,
              duration: 0.14,
              ease: 'power1.in',
              onStart: () => {
                gsap.fromTo(tile, { scale: 0.92 }, { scale: 1, duration: 0.2 });
              }
            });
          });
        }
      }

      // Eliminate the tile at the end of this round
      const elimIdx = (currentIdx + count - 1) % activeTiles.length;
      const elimLetter = activeTiles[elimIdx];
      
      this.zone.run(() => {
        this.countLabel = `Eliminating: ${this.meanings[elimLetter]}...`;
        const fl = this.flamesLetters.find(f => f.char === elimLetter);
        if (fl) {
          fl.active = false;
          fl.eliminated = true;
        }
        this.flamesLetters = [...this.flamesLetters];
      });
      this.cdr.detectChanges();

      // Remove from activeTiles
      activeTiles.splice(elimIdx, 1);
      
      // Next round starts from the letter immediately after the eliminated one
      currentIdx = elimIdx;
      if (currentIdx >= activeTiles.length) {
        currentIdx = 0;
      }

      await this.delay(800);
    }

    // Result tile is the only one remaining
    const finalChar = activeTiles[0];
    this.zone.run(() => {
      this.result = finalChar;
      this.finalResult = this.meanings[finalChar];
      this.isCalculating = false;
      this.countLabel = '';
      const fl = this.flamesLetters.find(f => f.char === finalChar);
      if (fl) {
        fl.winner = true;
        fl.active = true;
        fl.eliminated = false;
      }
      this.flamesLetters = [...this.flamesLetters];
    });
    this.cdr.detectChanges();

    // Hide ball
    gsap.to(ball, { autoAlpha: 0, scale: 0, duration: 0.3 });

    await this.delay(200);

    // Trigger confetti!
    this.triggerConfetti();

    // Reveal result card — also enable pointer-events so button is clickable
    const card = this.resultCard.nativeElement;
    card.style.pointerEvents = 'auto';
    gsap.to(card, {
      autoAlpha: 1,
      scale: 1,
      rotation: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
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
        colors: ['#abecfe', '#ff7b3a', '#8b5cf6', '#06b6d4', '#f59e0b']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#abecfe', '#ff7b3a', '#8b5cf6', '#06b6d4', '#f59e0b']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#abecfe', '#ff7b3a', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981']
      });
    }, 300);
  }

  reset() {
    const landing = this.landingEl.nativeElement;
    const calc    = this.calcEl.nativeElement;

    // Reset special states
    this.showGunAnimation = false;
    this.specialResult = '';
    
    // Hide gun if visible
    gsap.to(this.gunAnimationEl.nativeElement, {
      autoAlpha: 0,
      scale: 0,
      duration: 0.3
    });

    const tl = gsap.timeline({
      onComplete: () => this.zone.run(() => {
        this.name1 = ''; this.name2 = '';
        this.result = ''; this.finalResult = '';
        this.isCalculating = false;
        this.countLabel = '';
        this.specialResult = '';
        this.showGunAnimation = false;
        this.animateLanding();
        this.cdr.detectChanges();
      })
    });
    tl.to(calc,      { x: '100%', autoAlpha: 0, duration: 0.5, ease: 'power3.inOut' })
      .fromTo(landing, { x: '-100%', autoAlpha: 0 }, { x: '0%', autoAlpha: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25');
  }

  delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}
