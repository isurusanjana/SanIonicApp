import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {ProfilePage} from "../profile/profile";
import {ReportsPage} from "../reports/reports";
import {StartPage} from "../start/start";

/**
 * Generated class for the UsefulLinksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-useful-links',
  templateUrl: 'useful-links.html',
})
export class UsefulLinksPage {
  private links :string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiServiceProvider,
    private alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
    this.api.getUsefulLinks().then((res:any) => {
      this.links = JSON.parse(res.data).links;
    });
  }

  goReportsPage()
  {
    this.navCtrl.push(ReportsPage);
  }

  goProfilePage()
  {
    this.navCtrl.push(ProfilePage);
  }

  doLogout() {
    localStorage.removeItem('login');
    localStorage.removeItem('details');
    localStorage.removeItem('appLoad');
    this.navCtrl.setRoot(StartPage);
  }

}
