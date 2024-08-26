import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InfoComponent } from './info/info.component';

const routes: Routes = [
  { path: '**', component: InfoComponent },
  { path: '', component: InfoComponent, pathMatch: 'full' },
  { path: 'info', component: InfoComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking'
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
