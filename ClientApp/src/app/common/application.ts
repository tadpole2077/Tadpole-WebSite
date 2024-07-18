import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { Subscription, interval, Subject } from 'rxjs';
import { AppComponent } from '../app.component';
import Web3 from 'web3';
import { EIP1193Provider, EthExecutionAPI, SupportedProviders, Web3BaseProvider } from 'web3-types';
import DetectEthereumProvider from '@metamask/detect-provider';
import { Router, UrlSegmentGroup, PRIMARY_OUTLET, UrlSegment, UrlTree, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


interface RequestAccountsResponse {
  code: number, // 200：ok，4000：In-queue， 4001：user rejected
  message: string
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider<unknown>;
}
interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}



const APPROVAL_TYPE = {
  NONE: 0,
  NO_WALLET_ENABLED: 1,
  ACCOUNT_WITH_NO_PLOTS: 2
}


@Injectable()
export class Application {

  public homeCDF: ChangeDetectorRef = null;
  public menuCDF: ChangeDetectorRef = null;
  public appComponentInstance: AppComponent = null;

  // Flag tracks wallet allowed access to this site
  private _walletApproved: boolean = false;
  private _networkChainId: string;
  private _walletKeyFormated: string;

  public public_key: string;
  public dark_mode: boolean = true;

  // ********** Observables ******************************
  // Service to capture when an account become active - used by components to update/enable account specific features
  // NOTE : On reload of page - Event "accountsChanged" will trigger as wallet is initialized, any subscribed listeners to accountActiveSubject will also trigger.
  private accountActiveSubject = new Subject<boolean>();
  public accountActive$ = this.accountActiveSubject.asObservable();

  // Observable event - triggered on blockchain network change
  private networkChangeSubject = new Subject<string>();
  public networkChange$ = this.networkChangeSubject.asObservable();

  metaMask: EIP1193Provider<unknown> = null;

  set walletApproved(value) {    

    let changed = this._walletApproved != value;
    this._walletApproved = value;

    if (this._walletApproved) {
      this._walletKeyFormated = this.public_key.substring(0, 6) + "..." + this.public_key.substring(this.public_key.length - 4, this.public_key.length);
    }
    else {
      this._walletKeyFormated = "";
    }
    // Trigger any Approve component to update
    //if (changed && this.approveSwitchComponent) {
    //  if (value) {i
    //    this.approveSwitchComponent.show();
    //  }
    //  else {
    //    this.approveSwitchComponent.hide();
    //  }
    //}
    //console.log("RequestApprove:", this._requestApprove);
  }

  get walletKeyFormated() {
    return this._walletKeyFormated;
  }
  get walletApproved() {
    return this._walletApproved;
  }
  get networkChainId() {
    return this._networkChainId;
  }

  public approvalType: number = APPROVAL_TYPE.NONE;



  constructor(private httpClient: HttpClient, @Inject('BASE_URL') public rootBaseUrl: string, public router: Router, private location: Location, private route: ActivatedRoute) {

    this.getProviders();

  }

  getProviders = async() => {

    // Call and wait for the promise to resolve - Typescript requires mapping to type
    let providers = await Web3.requestEIP6963Providers() as Map<string, EIP6963ProviderDetail>;

    for (const [key, value] of providers) {
      console.log(value);

      /* Based on your DApp's logic show use list of providers and get selected provider's UUID from user for injecting its EIP6963ProviderDetail.provider EIP1193 object into web3 object */

      if (value.info.name === 'MetaMask') {

        const web3 = new Web3(value.provider);

        this.metaMask = value.provider;

        this.setEventListeners();
      }
    }

    // Web3 feature does seems to work -  lock & unlock Metamask
    Web3.onNewProviderDiscovered((provider) => {
      // Log the populated providers map object, provider.detail has Map of all providers yet discovered
      console.log("New Provider Identified: ", provider.detail);

      // add logic here for updating UI of your DApp
    });

  }

  // Check Metamask Provider :  Supporting Metamask & CoinbaseWallet
  checkApprovedWalletType = async() =>{

    const ethereum = (window as any).ethereum;

    const approved = (this.metaMask || ethereum.isTrustWallet || ethereum.isCoinbaseWallet);

    if (approved) {

      //if (provider !== ethereum) {
      //  console.log('Do you have multiple wallets installed?');
      //  return false;
      //}
    }

    return approved;
  }

  // Only set once to avoid dups, remove listeners when switching worlds.
  setEventListeners = async() => {

    // On wallet account change - recheck linked account    
    const provider = await DetectEthereumProvider();      // incudes 3 second timeout - useful to initiate ethereum object on client load.
    const ethereum = (window as any).ethereum;

    // Ensure only one instance of Eth event handler - remove any existing ethereum obj using Node.js EventEmitter tech     
    if (this.metaMask) {
      
      this.metaMask.removeListener("accountsChanged", this.ethAccountsChanged);
      this.metaMask.on("accountsChanged", this.ethAccountsChanged);

      this.metaMask.removeListener("chainChanged", this.ethNeworkChanged);
      this.metaMask.on("chainChanged", this.ethNeworkChanged);
    }
    else {

      ethereum.removeListener("accountsChanged", this.ethAccountsChanged);
      ethereum.on("accountsChanged", this.ethAccountsChanged);

      // metamask : networkChanged depreciated on 3/2024 : https://docs.metamask.io/whats-new/#march-2024
      ethereum.removeListener("networkChanged", this.ethNeworkChanged);
      ethereum.on("networkChanged", this.ethNeworkChanged);
    }

  }  

  // Using named function var with [ES6 Arrow Function] - allows use of [this] pointing to the original caller class, otherwise the eventEmitter class will be used.
  private ethAccountsChanged = (accounts) => {
    console.log("Ethereum Account Changed");

    this.getEthereumAccounts(this.rootBaseUrl);

  };

  private ethNeworkChanged = (chainId: string) => {
    console.log("Network change to " + chainId);

    this._networkChainId = chainId;
    this.networkChangeSubject.next(chainId);

    // Get Hex value of chain and push to subject - any observables listeners will pick up and react.
    //const ethereum = (window as any).ethereum;
    //ethereum.request({ method: "eth_chainId", params: [] }).then((chainIdHex) => {
    //  this.networkChangeSubject.next(chainIdHex);
    //});    
  }

  // Triggered by (a) On initial load of page or redirect load
  // Using anomymous function reference =>{} passing this context
  getEthereumAccounts = async(baseUrl: string) => {

    const provider = await DetectEthereumProvider();
    const ethereum = (window as any).ethereum;
    const walletExtension = this.metaMask != null ? this.metaMask : ethereum;


    // Check Metamask Provider :  Supporting Metamask, CoinbaseWallet, Trust
    if (await this.checkApprovedWalletType()) {

      const chainId = await walletExtension.request({ method: 'eth_chainId' });
      const accounts = await walletExtension.request({ method: 'eth_accounts' });

      if (accounts && accounts.length) {

        // Selected first site linked account 
        const selectedAddress = accounts[0];

        console.log(">>>Ethereum Account linked<<<");
        console.log("Key = ", selectedAddress);    // previously using depreciated ethereum.selectedAddress
                
        this.public_key = selectedAddress;
        this.walletApproved = true;
        this._networkChainId = chainId;

        // trigger subscribed event handlers
        this.accountActiveSubject.next(true);

      }
      else {
        console.log(">>>No Ethereum Account linked<<<");
        console.log("ChainId = ", chainId);

        this.walletApproved = false;
        this._networkChainId = chainId;

        // Zone update components impacted by no connected wallet
        this.walletApprovedRefresh();

        // trigger subscribed event handlers
        this.accountActiveSubject.next(false);
      }      
    }

    return this.walletApproved;
  }

  approveEthereumAccountLink = async(httpClient: HttpClient, baseUrl: string) => {

    const ethereum = (window as any).ethereum;
    const walletExtension = this.metaMask != null ? this.metaMask : ethereum;

    const accountsApproved = await walletExtension.request({ method: 'eth_requestAccounts' });
    const accountAddress = accountsApproved != null ? accountsApproved[0] : "";

    const chainId = await walletExtension.request({ method: 'eth_chainId' });

    if (accountAddress && accountAddress !== "") {
      console.log(">>>Ethereum Account linked<<<");
      console.log("Key = ", accountAddress);

      this.public_key = accountAddress;
      this.walletApproved = true;
      //this.accountActiveSubject.next(true);     // No need to trigger an observable event here as it will be picked up by the already active event listeners (account & network change)

    }
    else {
      console.log(">>>No Ethereum Account linked<<<");
      console.log("ChainId = ", chainId);
      this.walletApproved = false;
      this.accountActiveSubject.next(false);
    }

    return accountAddress;
  }

  walletApprovedRefresh() {
    //if (this.approveSwitchComponent) {
    //  this.approveSwitchComponent.update();
    //}

    if (this.menuCDF) {
      this.menuCDF.detectChanges();
    }
    if (this.homeCDF) {
      this.homeCDF.detectChanges();   // show/hide buttons based on account settings.
    }

  }


  // typically para extractPathComponents(this.location.path())
  extractPathComponents(path: string) {

    const routeTree: UrlTree = this.router.parseUrl(path);
    const routeSegmentGroup: UrlSegmentGroup = routeTree.root.children[PRIMARY_OUTLET];
    let segmentList: UrlSegment[] = null;
    let lastComponentName: string = "/";

    if (routeSegmentGroup != undefined) {
      segmentList = routeSegmentGroup.segments;
    }

    return segmentList;
  }

  

}

export { 
  APPROVAL_TYPE
}
