import {Component, ViewChild} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams,
  TextInput,
  ActionSheetController
} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HTTP} from "@ionic-native/http";
import { Camera } from '@ionic-native/camera';

import {MapPage} from "../map/map";
import {AddressProvider} from "../../providers/address/address";
import {CameraServiceProvider} from "../../providers/camera-service/camera-service";
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {ReportsPage} from "../reports/reports";

/**
 * Generated class for the WorkReportAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-work-report-add',
  templateUrl: 'work-report-add.html',
})
export class WorkReportAddPage {
  private workForm: FormGroup;
  private currentAddress: any;
  private lat: number;
  private lng: number;
  private date: any ;
  private time: any ;
  private image1: string = '';
  private image2: string = '';
  private image3: string = '';
  private image4: string = '';
  private image1Base64: string = '';
  private image2Base64: string = '';
  private image3Base64: string = '';
  private image4Base64: string = '';
  private label1: string = 'Label 1';
  private label2: string = 'Label 2';
  private totalFreeReportCount: number;
  private totalCreditReportCount: number;
  private remainingFreeReportCount: number;
  private remainingCreditReportCount: number;
  private storageData: any;
  private loading: any;

  @ViewChild('address') myInput: TextInput;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private addressProvider: AddressProvider,
    private cameraService: CameraServiceProvider,
    private api: ApiServiceProvider,
    private alertCtrl: AlertController,
    private http: HTTP,
    private loadingCtrl : LoadingController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera
  )
  {
    this.workForm = this.formBuilder.group({
      reported_by: [''],
      date_time: ['', Validators.required],
      label1: [''],
      value1: [''],
      label2: [''],
      value2: [''],
      additional_info: [''],
      address: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      details: [''],
      description_image1: [''],
      description_image2: [''],
      description_image3: [''],
      description_image4: [''],
    });

  }

  ionViewDidLoad() {
    let today = new Date();
    today.setHours(today.getHours() + 1);

    this.date = today.toISOString();
    this.time = today.toISOString();
    this.storageData = JSON.parse(localStorage.getItem('details'));
    this.totalFreeReportCount = this.storageData.total_free_reports;
    this.totalCreditReportCount = this.storageData.total_credit_reports;
    this.remainingFreeReportCount = this.storageData.remaining_free_reports;
    this.remainingCreditReportCount = this.storageData.remaining_credit_reports;
    console.log('ionViewDidLoad AccidentReportAddPage');
    this.presentMapModal()
  }

  presentMapModal() {

    let mapModal = this.modalCtrl.create(MapPage);
    mapModal.onDidDismiss(data => {
      // Do things with data coming from modal, for instance :
      console.log(data);
      this.addressProvider.getAddress(data).subscribe(res => {
        //console.log(res);
        this.currentAddress = res;
        this.myInput.setFocus();
      });
      console.log(this.currentAddress);
      this.lat = data.lat;
      this.lng = data.lng;
    });
    mapModal.present();
  }

  doSubmit() {
    if (this.storageData.remaining_free_reports >= 1 || this.storageData.remaining_credit_reports >= 1) {
      let data: any = {
        'reported_by': this.workForm.value.reported_by,
        'date_time': this.workForm.value.date_time,
        'address': this.workForm.value.address,
        'latitude': this.workForm.value.latitude,
        'longitude': this.workForm.value.longitude,
        'label1': this.workForm.value.label1,
        'value1': this.workForm.value.value1,
        'label2': this.workForm.value.label2,
        'value2': this.workForm.value.value2,
        'additional_info': this.workForm.value.additional_info,
        'details': this.workForm.value.details,
        'description-image1': this.workForm.value.description_image1,
        'description-image2': this.workForm.value.description_image2,
        'description-image3': this.workForm.value.description_image3,
        'description-image4': this.workForm.value.description_image4,
        'image1': this.image1,
        'image2': this.image2,
        'image3': this.image3,
        'image4': this.image4,
      };

      this.api.postData('work_report', data).then((res: any) => {
        let data = JSON.parse(res.data).success;
        this.storageData.remaining_free_reports = data.remaining_free_report;
        this.storageData.remaining_credit_reports = data.remaining_credit_report;
        localStorage.setItem('details', JSON.stringify(this.storageData));
        let alert = this.alertCtrl.create({
          title: 'Successfully Created..',
          message: "You have successfully created Work Completion Report..",
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              handler: () => {
                this.goToHome({});
              }
            },
          ]
        });
        alert.present();
      });
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Failed to Create Report..',
        message: "You have don't have any remaining reports for this month. Please get more reports..",
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              this.goToHome({});
            }
          },
        ]
      });
      alert.present();
    }
  }

  goToHome(params) {
    if(!params) params = { appLoad:false };
    this.navCtrl.setRoot(ReportsPage, params);
  }

  doTakePhoto(imageNumber) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
          {
              text: 'Load from Library',
              handler: () => {
                  this.cameraService.getPicture1(this.camera.PictureSourceType.PHOTOLIBRARY).subscribe(data => {
                      let apiTocken = JSON.parse(localStorage.getItem('login')).token;
                      let authenticateHeader = "Bearer " + apiTocken;
                      let photoData: any = {'photo': data};
                      this.presentLoadingDefault();
                      this.http.post(this.api.apiUrl + 'photo', photoData, {
                          "authorization": authenticateHeader,
                          "Access-Control-Allow-Origin": "https://test.com",
                          "accept": "application/json",
                          "content-type": "application/x-www-form-urlencoded; charset=utf-8",
                          "cache-control": "no-cache",
                      })
                          .then((res: any) => {
                              this.loading.dismiss();
                              if (imageNumber === 1) {
                                  this.image1Base64 = 'data:image/jpeg;base64,' + data;
                                  this.image1 = JSON.parse(res.data).success.id;
                              }
                              else if (imageNumber === 2) {
                                  this.image2Base64 = 'data:image/jpeg;base64,' + data;
                                  this.image2 = JSON.parse(res.data).success.id;
                              }
                              else if (imageNumber === 3) {
                                  this.image3Base64 = 'data:image/jpeg;base64,' + data;
                                  this.image3 = JSON.parse(res.data).success.id;
                              }
                              if (imageNumber === 4) {
                                  this.image4Base64 = 'data:image/jpeg;base64,' + data;
                                  this.image4 = JSON.parse(res.data).success.id;
                              }
                          })
                          .catch(err => {
                              this.loading.dismiss();
                              let alert = this.alertCtrl.create({
                                  title: 'Uploading Failed',
                                  message: 'Photo did not upload to the server please try again..',
                                  buttons: [
                                      {
                                          text: 'OK',
                                          role: 'cancel',
                                      },
                                  ]
                              });
                              alert.present();
                          });
                  });
              }
          },
          {
              text: 'Use Camera',
              handler: () => {
                  this.cameraService.getPicture1(this.camera.PictureSourceType.CAMERA).subscribe(data => {
                      let apiTocken = JSON.parse(localStorage.getItem('login')).token;
                      let authenticateHeader = "Bearer " + apiTocken;
                      let photoData: any = {'photo': data};
                      this.presentLoadingDefault();
                      this.http.post(this.api.apiUrl + 'photo', photoData, {
                          "authorization": authenticateHeader,
                          "Access-Control-Allow-Origin": "https://test.com",
                          "accept": "application/json",
                          "content-type": "application/x-www-form-urlencoded; charset=utf-8",
                          "cache-control": "no-cache",
                      })
                          .then((res: any) => {
                              this.loading.dismiss();
                              if (imageNumber === 1) {
                                  this.image1Base64 = 'data:image/jpeg;base64,' + data;
                                  this.image1 = JSON.parse(res.data).success.id;
                              }
                              else if (imageNumber === 2) {
                                  this.image2Base64 = 'data:image/jpeg;base64,' + data;
                                  this.image2 = JSON.parse(res.data).success.id;
                              }
                              else if (imageNumber === 3) {
                                  this.image3Base64 = 'data:image/jpeg;base64,' + data;
                                  this.image3 = JSON.parse(res.data).success.id;
                              }
                              if (imageNumber === 4) {
                                  this.image4Base64 = 'data:image/jpeg;base64,' + data;
                                  this.image4 = JSON.parse(res.data).success.id;
                              }
                          })
                          .catch(err => {
                              this.loading.dismiss();
                              let alert = this.alertCtrl.create({
                                  title: 'Uploading Failed',
                                  message: 'Photo did not upload to the server please try again..',
                                  buttons: [
                                      {
                                          text: 'OK',
                                          role: 'cancel',
                                      },
                                  ]
                              });
                              alert.present();
                          });
                  });
              }
          },
          {
              text: 'Cancel',
              role: 'cancel'
          }
      ]
  });
  actionSheet.present();
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Uploading Photo...'
    });

    this.loading.present();
  }

  doRemovePhoto(imageNumber) {
    let alert = this.alertCtrl.create({
      title: 'Delete Photo',
      message: 'Do you really need to delete this photo..',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            if (imageNumber === 1) {
              let data = {
                'id': this.image1
              };
              this.api.deleteData('photo',data);
              this.image1 = "";
              this.image1Base64 = ""
            }
            if (imageNumber === 2) {
              let data = {
                'id': this.image2
              };
              this.api.deleteData('photo',data);
              this.image2 = "";
              this.image2Base64 = "";
            }
            if (imageNumber === 3) {
              let data = {
                'id': this.image3
              };
              this.api.deleteData('photo',data);
              this.image3 = "";
              this.image3Base64 = "";
            }
            if (imageNumber === 4) {
              let data = {
                'id': this.image4
              };
              this.api.deleteData('photo',data);
              this.image4 = "";
              this.image4Base64 = "";
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
    alert.present();

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
              this.navCtrl.setRoot(ReportsPage);
              // this.goToStart({});
            }
          },
        ]
      });
      alert.present();
    });
    
  }

}
