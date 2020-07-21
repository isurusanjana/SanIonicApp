import {Component} from '@angular/core';
import {App, IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {AccidentReportAddPage} from "../accident-report-add/accident-report-add";
import {InsuranceReportAddPage} from "../insurance-report-add/insurance-report-add";
import {SurveyReportAddPage} from "../survey-report-add/survey-report-add";
import {WorkReportAddPage} from "../work-report-add/work-report-add";
import {InvoiceReportAddPage} from "../invoice-report-add/invoice-report-add";
import {StartPage} from "../start/start";
import {ProfilePage} from "../profile/profile";
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {UsefulLinksPage} from "../useful-links/useful-links";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {
  private username :string;
  private totalFreeReportCount :number;
  private totalCreditReportCount :number;
  private remainingFreeReportCount :number;
  private remainingCreditReportCount :number;
  private accidentReportCount :number;
  private insuranceReportCount :number;
  private surveyReportCount :number;
  private workReportCount :number;
  private invoiceReportCount :number;
  private bgShow : boolean = false;
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
    console.log(this.navParams.get('appLoad'));
    console.log('ionViewDidLoad HomePage');
    this.api.getUserDetails().then((res:any) => {
      let data = JSON.parse(res.data).success;
      let userData = JSON.parse(localStorage.getItem('login'));
      this.username = userData.first_name +" "+ userData.last_name;
      this.totalFreeReportCount = data.total_free_reports;
      this.totalCreditReportCount = data.total_credit_reports;
      this.remainingFreeReportCount = data.remaining_free_reports;
      this.remainingCreditReportCount = data.remaining_credit_reports;
      this.accidentReportCount = data.accident_reports;
      this.insuranceReportCount = data.insurance_reports;
      this.surveyReportCount = data.survey_reports;
      this.workReportCount = data.work_reports;
      this.invoiceReportCount = data.invoice_reports;
      localStorage.setItem('details', JSON.stringify(data));
      if(localStorage.getItem('appLoad')=='1') {
        // if (data.default_report == '1') {
        //   this.goAcciddentAddPage();
        // } else if (data.default_report == '2') {
        //   this.goInsuranceAddPage();
        // } else if (data.default_report == '3') {
        //   this.goWorkAddPage();
        // } else if (data.default_report == '4') {
        //   this.goSurveyAddPage();
        // } else if (data.default_report == '5') {
        //   this.goInvoiceAddPage();
        // }
      }
      localStorage.setItem('appLoad','2');
    });
  }

  bgToggle()
  {
    this.bgShow= !this.bgShow;
  }

  goAcciddentAddPage()
  {
    this.navCtrl.push(AccidentReportAddPage);
  }

  goInsuranceAddPage()
  {
    this.navCtrl.push(InsuranceReportAddPage);
  }

  goSurveyAddPage()
  {
    this.navCtrl.push(SurveyReportAddPage);
  }

  goWorkAddPage()
  {
    this.navCtrl.push(WorkReportAddPage);
  }

  goInvoiceAddPage()
  {
    this.navCtrl.push(InvoiceReportAddPage);
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

  getMoreReports() {
    let userData = JSON.parse(localStorage.getItem('login'));
    let userDetails: any = {
      userName : userData.first_name +" "+ userData.last_name,
      userEmail : userData.email,
    };
    this.api.getMoreReports(userDetails).then((res: any) =>{
      let data = JSON.parse(res.data).success;
      let alert = this.alertCtrl.create({
        title: 'Successfully Requested',
        message: data.message,
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              // this.navCtrl.setRoot(StartPage);
              // this.goToStart({});
            }
          },
        ]
      });
      alert.present();
    });
    
  }

  goUsefulLinkPage()
  {
    this.navCtrl.push(UsefulLinksPage);
  }

}
