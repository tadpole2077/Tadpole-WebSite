import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { InfoComponent } from './info/info.component';


import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NumberDirective } from './directive/numberonly.directive';
import { NumberDecimalDirective } from './directive/number-decimal-only.directive';
import { TabExtractedBodyDirective } from './directive/tab-extracted-body.directive';
import { ImageFallbackDirective } from './directive/image-fallback.directive';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule} from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';

import { Application } from './common/application';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
   
    NumberDirective,
    TabExtractedBodyDirective,
    ImageFallbackDirective,
   
    InfoComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatIconModule,
    MatCheckboxModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatSlideToggleModule,
    MatListModule,
    MatDialogModule,
    DragDropModule,
    NgbDropdownModule,
    RouterModule.forRoot([
      { path: '', component: InfoComponent },
      { path: 'info', component: InfoComponent },
    ]),
    BrowserAnimationsModule,
    ClipboardModule,
    NumberDecimalDirective,
  ],
  providers: [
    Application,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
