import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';
//import { mockOwnerData } from '../mocks/mock-owner-data';
//import { IOwnerData } from '../owner-data/owner-interface';

// Intercepter Service - Mock REST Service request - response - using mock data.
// See app.modules.ts providers for wireup {provide: HTTP_INTERCEPTORS, useClass: TestInterceptorService, multi:true }

interface IMockData {
  id: number
}

//export function mockInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

//}


@Injectable({
    providedIn: 'root'
})
export class TestInterceptorService {

    private readonly API_URL = '/mock/api/';                  // mock REST url
    private readonly STORAGE_key = 'mock_api_filter';         // key used to store data in local storage

    //constructor() { }

    // Para1 : current request
    // Para2 : handles response back to request. HttpHandler - used to dispach a request in a stream of requests.
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {        

        if (request.url.startsWith(this.API_URL) && request.method === 'GET') {
            console.log('intercept test - GET');
            return this.getMockData();
        }
        if (request.url === this.API_URL && request.method === 'PUT') {
            console.log('intercept test - PUT');
            if (typeof request.body === 'string') {
                return this.setFilter(request.body);
            }
            else {
                return this.setFilter("");
            }

        }
    
        // if request does not match the mock url AND is not a Get or Put type then just return the http handler - process as normal.
        return next.handle(request);
    }

    // The mock services are using the browser local storage to store and retrieve the filter key.  
    private getMockData(): Observable<HttpEvent<IMockData>>{

        // Return a mock http response event.
        return new Observable(observer => {

            observer.next(new HttpResponse<IMockData>({
                status: 200,
                body: { id: 1 }
            }));
      
            observer.complete();    // release the observer and automatically unsubscribe ALL subscribers 
        });

    }

    private setFilter(body:string): Observable<HttpEvent<IMockData>>{

        window.localStorage.setItem(this.STORAGE_key, body);
        return this.getMockData();

    }
}
