import { HttpClient } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { Application } from "../common/application";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
    constructor(public app: Application, http: HttpClient, @Inject('BASE_URL') public rootBaseUrl: string) {

  }
}
