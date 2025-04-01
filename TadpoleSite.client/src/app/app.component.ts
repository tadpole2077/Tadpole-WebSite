import { Component, HostBinding, OnInit, signal, WritableSignal } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

/// "@angular/cdk" additional dependency package required within package.json to use OverlayContanier.

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  title = 'tadpole-site.client';
  @HostBinding('class') className = '';

  constructor(private overlay: OverlayContainer) {}

  // emitter can pass one object $event - strongly typed here to avoid ANY type
  darkModeChange(emitterEvent: { darkModeEnabled: boolean }) {
    
    const darkClassName = "darkMode";
    this.className = emitterEvent.darkModeEnabled ? darkClassName : '';

    // Need to apply class to root body - as no material root control used.
    if (this.overlay.getContainerElement().parentElement) {

      if (emitterEvent.darkModeEnabled) {
        this.overlay.getContainerElement().parentElement!.classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().parentElement!.classList.remove(darkClassName);
      }

    }
  }
  
}
