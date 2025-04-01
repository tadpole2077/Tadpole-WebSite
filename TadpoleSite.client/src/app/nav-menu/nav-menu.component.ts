import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Inject, NgZone, Output, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { Application } from '../common/application';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnDestroy {

  private httpClient: HttpClient;
  private rootBaseUrl: string;
  //subscriptionAccountActive$: Subscription;
  darkMode = signal(true);
  isExpanded = false;  
  @Output() darkModeChangeEvent = new EventEmitter();

  constructor(private zone: NgZone, private cdf: ChangeDetectorRef, private location: Location, public activatedRoute: ActivatedRoute, private router: Router, http: HttpClient, @Inject('BASE_URL') rootBaseUrl: string) {

    this.rootBaseUrl = rootBaseUrl;
    this.httpClient = http;
    //app.menuCDF = cdf;

    // Monitor using service - when account status changes - active / inactive.
    //this.subscriptionAccountActive$ = app.accountActive$.subscribe(() => {
    //  this.cdf.detectChanges();
    //  darkMode.set(application.dark_mode);
    //})

  }

  ngOnDestroy() {
    //this.subscriptionAccountActive$.unsubscribe();  
  }

  darkModeChange(clientEvent: Event, enabled: boolean) {

      this.darkModeChangeEvent.emit({ event: clientEvent, modeEnabled: enabled });    // bubble event up to parent component
      this.darkMode.set(enabled);
  }

  getName() {


  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  clickAccountLink = async() => {

    //this.app.approveEthereumAccountLink(this.httpClient, this.rootBaseUrl);

    return;
  }
  
}
