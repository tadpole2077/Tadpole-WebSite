import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, NgZone, Output, ViewChild } from '@angular/core';
import { PRIMARY_OUTLET, UrlSegment, UrlSegmentGroup, UrlTree, ActivatedRoute, NavigationEnd, RouterEvent, Router, Params } from '@angular/router';
import { Application } from '../common/application';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {

  private subscriptionRouterEvent: any;
  private httpClient: HttpClient;
  private baseUrl: string;
  private rootBaseUrl: string;
  public worldName: string;
  private that: any = this;
  subscriptionAccountActive$: Subscription;

  isExpanded = false;
  @Output() selectWorldEvent = new EventEmitter<any>();
  @Output() darkModeChangeEvent = new EventEmitter<any>();

  constructor(public app: Application, private zone: NgZone, private cdf: ChangeDetectorRef, private location: Location, public application: Application, public activatedRoute: ActivatedRoute, private router: Router, http: HttpClient, @Inject('BASE_URL') rootBaseUrl: string) {

    this.rootBaseUrl = rootBaseUrl;     // Unknow world type at this point, checkWorldFromURL will identify.
    this.httpClient = http;
    application.menuCDF = cdf;    

    // Monitor using service - when account status changes - active / inactive.
    this.subscriptionAccountActive$ = this.app.accountActive$.subscribe(active => {
      this.cdf.detectChanges();
    })

  }

  ngOnDestroy() {
    this.subscriptionAccountActive$.unsubscribe();  
  }

  darkModeChange(modeEnabled: boolean) {

    this.darkModeChangeEvent.emit(modeEnabled);    // bubble event up to parent component
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

    this.app.approveEthereumAccountLink(this.httpClient, this.baseUrl);

    return;
  }
  
}
