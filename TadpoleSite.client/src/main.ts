import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

// NgModule pattern.
platformBrowserDynamic(providers)
  .bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
