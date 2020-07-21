import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private profileForm : FormGroup;
  private first_name : string;
  private last_name : string;
  private email : string;
  private totalFreeReportCount :number;
  private totalCreditReportCount :number;
  private remainingFreeReportCount :number;
  private remainingCreditReportCount :number;
  private storageData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
  ) {
    this.profileForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    this.storageData = JSON.parse(localStorage.getItem('details'));
    this.totalFreeReportCount = this.storageData.total_free_reports;
    this.totalCreditReportCount = this.storageData.total_credit_reports;
    this.remainingFreeReportCount = this.storageData.remaining_free_reports;
    this.remainingCreditReportCount = this.storageData.remaining_credit_reports;

    let userData = JSON.parse(localStorage.getItem('login'));
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.email = userData.email;
    console.log('ionViewDidLoad ProfilePage');
  }

}
