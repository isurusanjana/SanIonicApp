import {Component} from '@angular/core';
import {App, IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {UsefulLinksPage} from "../useful-links/useful-links";
import {ReportsPage} from "../reports/reports";
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {StartPage} from "../start/start";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  private username :string;
  private app: App;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiServiceProvider,
    private alertCtrl: AlertController,
  )
  {

  }

  ionViewDidLoad()
  {

    this.api.getUserDetails().then((res:any) => {
      let data = JSON.parse(res.data).success;
      let userData = JSON.parse(localStorage.getItem('login'));
      this.username = userData.first_name +" "+ userData.last_name;

      localStorage.setItem('appLoad','2');
    });
  }

  goUsefulLinkPage()
  {
    this.navCtrl.push(UsefulLinksPage);
  }

  goReportsPage()
  {
    this.navCtrl.push(ReportsPage);
  }

  doLogout() {
    localStorage.removeItem('login');
    localStorage.removeItem('details');
    localStorage.removeItem('appLoad');
    this.navCtrl.setRoot(StartPage);
  }

}
