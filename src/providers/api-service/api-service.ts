import {Injectable} from '@angular/core';
import {HTTP} from "@ionic-native/http";
import {AlertController, LoadingController} from "ionic-angular";
import {Observable} from "rxjs/Observable";

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiServiceProvider {

  public apiUrl = 'http://www.test.test/api/';
  public loading: any;

  constructor(
    private http: HTTP,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  )
  {
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  public login(credentials: any) {
    return new Promise((resolve, reject) => {
      this.presentLoadingDefault();
      this.http.post(this.apiUrl + 'login', credentials, {})
        .then(res => {
          this.loading.dismiss();
          resolve(res);
        }).catch(err => {
          console.log(err.error);
          console.log(err);
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Incorrect email or password',
            message: err.error,
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => {
                  reject(err);
                }
              },
            ]
          });
          alert.present();
        });
    });
  }

  public register(data: any) {
    return new Promise((resolve, reject) => {
      this.presentLoadingDefault();
      this.http.post(this.apiUrl + 'register', data, {})
        .then(res => {
          this.loading.dismiss();
          resolve(res);
        }).catch (err => {
          this.loading.dismiss();
          console.log(err);
          let alert = this.alertCtrl.create({
            title: 'Register Failed..',
            message: "This email already has an account please login.",
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => {
                  reject(err);
                }
              },
            ]
          });
          alert.present();
        });
    });
  }

  public getUserDetails() {
    let apiTocken = JSON.parse(localStorage.getItem('login')).token;
    let authenticateHeader = "Bearer " + apiTocken;
    console.log(authenticateHeader);
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + 'details', {}, {
        "authorization": authenticateHeader
      }).then((res: any) => {
        resolve(res);
      });
    });
  }

  public postData(url:string, data:any){
    let apiTocken = JSON.parse(localStorage.getItem('login')).token;
    let authenticateHeader = "Bearer " + apiTocken;
    return new Promise((resolve, reject) => {
      this.presentLoadingDefault();
      this.http.post(this.apiUrl + url, data, {
        "authorization": authenticateHeader
      }).then(res => {
          this.loading.dismiss();
          resolve(res);
        }).catch (err => {
          this.loading.dismiss();
          console.log(err.error);
          let alert = this.alertCtrl.create({
            title: 'Please try again..',
            message: "Please check your internet connection and try again.",
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => {
                  reject(err);
                }
              },
            ]
          });
          alert.present();
        });
    });
  }

  public deleteData(url:string, data:any){
    let apiTocken = JSON.parse(localStorage.getItem('login')).token;
    let authenticateHeader = "Bearer " + apiTocken;
    return new Promise((resolve, reject) => {
      this.presentLoadingDefault();
      this.http.post(this.apiUrl + url+'/delete' , data, {
        "authorization": authenticateHeader
      }).then(res => {
        this.loading.dismiss();
        resolve(res);
      }).catch (err => {
        this.loading.dismiss();
        console.log(err.error);
        let alert = this.alertCtrl.create({
          title: 'Please try again..',
          message: "Please check your internet connection and try again.",
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              handler: () => {
                reject(err);
              }
            },
          ]
        });
        alert.present();
      });
    });
  }

  public getMoreReports(data:any){
    let apiTocken = JSON.parse(localStorage.getItem('login')).token;
    let authenticateHeader = "Bearer " + apiTocken;
    return new Promise((resolve, reject) => {
      this.presentLoadingDefault();
      this.http.post(this.apiUrl + 'more_report', data, {
        "authorization": authenticateHeader
      }).then(res => {
          this.loading.dismiss();
          resolve(res);
        }).catch (err => {
          this.loading.dismiss();
          console.log(err.error);
          let alert = this.alertCtrl.create({
            title: 'Please try again..',
            message: err.error,
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => {
                  reject(err);
                }
              },
            ]
          });
          alert.present();
        });
    });
  }
  
  public getUsefulLinks() {
    let apiTocken = JSON.parse(localStorage.getItem('login')).token;

    let authenticateHeader = "Bearer " + apiTocken;
    console.log(authenticateHeader);
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + 'show_links', {}, {
        "authorization": authenticateHeader
      }).then((res: any) => {
        resolve(res);
      });
    });
  }

}
