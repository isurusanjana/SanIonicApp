import {Component, ViewChild} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams,
  TextInput,
  ActionSheetController
} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {HTTP} from "@ionic-native/http";
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';

import { MapPage } from "../map/map";
import {AddressProvider} from "../../providers/address/address";
import {CameraServiceProvider} from "../../providers/camera-service/camera-service";
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {ReportsPage} from "../reports/reports";

/**
 * Generated class for the AccidentReportAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-accident-report-add',
  templateUrl: 'accident-report-add.html',
})
export class AccidentReportAddPage {

  private accidentForm : FormGroup;
  private currentAddress : any;
  private lat : number;
  private lng : number;
  private date : any;
  private time : any;
  private testDate : any = new Date().toISOString();
  private image1: string = '';
  private image2: string = '';
  private image3: string = '';
  private image4: string = '';
  private image1Base64: any = '';
  private image2Base64: any = '';
  private image3Base64: any = '';
  private image4Base64: any = '';
  private totalFreeReportCount :number;
  private totalCreditReportCount :number;
  private remainingFreeReportCount :number;
  private remainingCreditReportCount :number;
  private storageData: any;
  private loading: any;

  @ViewChild('address') myInput: TextInput;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private addressProvider : AddressProvider,
    private cameraService : CameraServiceProvider,
    private api: ApiServiceProvider,
    private alertCtrl: AlertController,
    private http: HTTP,
    private loadingCtrl : LoadingController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private geolocation: Geolocation
  )
  {
    this.accidentForm = this.formBuilder.group({
      reported_by: [''],
      date_time: ['', Validators.required],
      time_of_accident: ['', Validators.required],
      address: ['', Validators.required],
      type: [''],
      whether: [''],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      involved_persons: [''],
      description: [''],
      diver_name: [''],
      driver_address: [''],
      driver_phone: [''],
      vehicle_make: [''],
      vehicle_colour: [''],
      vehicle_model: [''],
      vehicle_registration: [''],
      insurance_company: [''],
      number_of_passenger: [''],
      witness_name: [''],
      witness_address: [''],
      witness_phone: [''],
      injury_person_involved: [''],
      injuries: [''],
      description_image1: [''],
      description_image2: [''],
      description_image3: [''],
      description_image4: [''],
    });

  }

  ionViewDidLoad()
  {
    //changes to convert time to uk timezones
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

  presentMapModal()
  {
    let mapModal = this.modalCtrl.create(MapPage);
    mapModal.onDidDismiss(data => { console.log(data);
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

  goToHome(params){
    if(!params) params = { appLoad:false };
    this.navCtrl.setRoot(ReportsPage, params);
  }

  doSubmit()
  {
    if(this.storageData.remaining_free_reports >=1 || this.storageData.remaining_credit_reports >=1 ) {
      let data: any = {
        'reported_by': this.accidentForm.value.reported_by,
        'date_time': this.accidentForm.value.date_time,
        'time_of_accident': this.accidentForm.value.time_of_accident,
        'address': this.accidentForm.value.address,
        'type': this.accidentForm.value.type,
        'whether': this.accidentForm.value.whether,
        'latitude': this.accidentForm.value.latitude,
        'longitude': this.accidentForm.value.longitude,
        'involved_persons': this.accidentForm.value.involved_persons,
        'description': this.accidentForm.value.description,
        'diver_name': this.accidentForm.value.diver_name,
        'driver_address': this.accidentForm.value.driver_address,
        'driver_phone': this.accidentForm.value.driver_phone,
        'vehicle_make': this.accidentForm.value.vehicle_make,
        'vehicle_colour': this.accidentForm.value.vehicle_colour,
        'vehicle_model': this.accidentForm.value.vehicle_model,
        'vehicle_registration': this.accidentForm.value.vehicle_registration,
        'insurance_company': this.accidentForm.value.insurance_company,
        'number_of_passenger': this.accidentForm.value.number_of_passenger,
        'witness_name': this.accidentForm.value.witness_name,
        'witness_address': this.accidentForm.value.witness_address,
        'witness_phone': this.accidentForm.value.witness_phone,
        'injury_person_involved': this.accidentForm.value.injury_person_involved,
        'injuries': this.accidentForm.value.injuries,
        'description-image1': this.accidentForm.value.description_image1,
        'description-image2': this.accidentForm.value.description_image2,
        'description-image3': this.accidentForm.value.description_image3,
        'description-image4': this.accidentForm.value.description_image4,
        'image1': this.image1,
        'image2': this.image2,
        'image3': this.image3,
        'image4': this.image4,
      };

      console.log(data)

      this.api.postData('accident_report', data).then((res: any) => {
        let data = JSON.parse(res.data).success;
        this.storageData.remaining_free_reports = data.remaining_free_report;
        this.storageData.remaining_credit_reports = data.remaining_credit_report;
        localStorage.setItem('details', JSON.stringify(this.storageData));
        let alert = this.alertCtrl.create({
          title: 'Successfully Created..',
          message: "You have successfully created Accident/Incident Report..",
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
    else{
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
                          "Access-Control-Allow-Origin": "https://accsapp.com",
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
                          "Access-Control-Allow-Origin": "https://accsapp.com",
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
