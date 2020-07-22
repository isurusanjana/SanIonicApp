import { Injectable } from '@angular/core';
import { Http, Response, Headers, ResponseContentType, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { AlertController } from 'ionic-angular';
import { ApiServiceProvider } from './api-service';



@Injectable()
export class Services {
    
    public baseUrl = 'http://test.com/api/';
    
    alert: any;
    constructor(public http: Http, private API : ApiServiceProvider,
        public alertCtrl: AlertController) {
            this.baseUrl = this.API.apiUrl;
    }


    /**
     * POST data
     * @param service 
     * @param parameters 
     * @param data 
     * @param apiToken 
     */
    sendData(service: string, parameters: any, data: any) {

        const body = data;
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        // header.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('login')).token);

        return this.http.post(this.baseUrl + service + parameters, body, {
            headers: header
        }).map((response: Response) => response.json())
            .catch((error: any) => this.handleGetError(error));

    }

    /**
     * Error handler
     */
    handleGetError(error: any) {
        return Observable.throw(error);
    }

    downloadFile(url) {
        let options = new RequestOptions({ responseType: ResponseContentType.Blob });
        return this.http.get(url, options)
            .map(res => res.blob())
            .catch((error: any) => this.handleGetError(error));
    }

    /**
   * Show error msg
   * @param title error msg title
   * @param subtitle error msg sub msgs
   */
    showErrorAlert(title: string, subtitle: string) {

        this.alert = this.alertCtrl.create({
            title: "",
            subTitle: "",
            buttons: ['OK']
        });

        this.alert.setTitle(title);
        this.alert.setSubTitle(subtitle);
        this.alert.present();
    }
}