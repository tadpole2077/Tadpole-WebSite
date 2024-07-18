import { Component, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Application } from './common/application';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  @HostBinding('class') className = '';

  constructor(public application: Application, private overlay: OverlayContainer) {
    application.appComponentInstance = this;
  }

  darkModeChange(darkModeEnabled: boolean) {
    
    const darkClassName = "darkMode";
    this.className = darkModeEnabled ? darkClassName : '';

    // Need to apply class to root body - as no material root control used.
    if (darkModeEnabled) {
      this.overlay.getContainerElement().parentElement.classList.add(darkClassName);
    } else {
      this.overlay.getContainerElement().parentElement.classList.remove(darkClassName);
    }
  }
}
