import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController, LoadingController, Platform} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {ReportsPage} from "../reports/reports";

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
declare let cordova: any;

@IonicPage()

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('mapCanvas') mapElement: ElementRef;

  private lat : number;
  private lng : number;
  private map : any;
  private marker : any;
  private geocoder : any;
  private infowindow : any;
  private address : string;
  private geoCoderResult : any;
  private mapLoaded : boolean = false;
  private watch: any;
  private loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    private alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public platform: Platform,)
  {

  }

  async ionViewDidLoad() {
    await this.platform.ready().then(async () => {
      await this.locationRequest();
      this.getLocation();
    });
  }

  async getLocation() {
    this.loading = await this.loadingCtrl.create({
      content: '<ion-spinner name="bubbles"></ion-spinner> Loading...',
    });

    this.loading.present();
    let options = {timeout: 20000, enableHighAccuracy: true, maximumAge: 1000};
    await this.geolocation.getCurrentPosition(options).then((resp) => {
      
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;

      this.loadMap();
      this.loading.dismiss();
    }).catch((error) => {
      let alert = this.alertCtrl.create({
        title: 'Device location off',
        subTitle: error,
        buttons: ['Dismiss']
      });
      alert.present();
      this.loading.dismiss();
      this.navCtrl.push(ReportsPage);
    });

  }

    async locationRequest() {
      if(this.platform.is('android')) {
          await cordova.plugins.locationAccuracy.canRequest(async function(canRequest){
            if (canRequest) { 
              await cordova.plugins.locationAccuracy.request(function () {}, 
                  function (error) {
                    let alert = this.alertCtrl.create({
                      title: 'Device location off',
                      message: 'Will redirect to the location setting',
                      buttons: ['Dismiss']
                    });
                    alert.present();
                    cordova.plugins.diagnostic.switchToLocationSettings();
                  }, 
                  cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
              );

              this.navCtrl.push(ReportsPage);
            } else { 
      
              await cordova.plugins.locationAccuracy.request(function () {

                }, function (error) {
                  let alert = this.alertCtrl.create({
                    title: 'Device location off',
                    message: 'Will redirect to the location setting',
                    buttons: ['Dismiss']
                  });
                  alert.present();
                  cordova.plugins.diagnostic.switchToLocationSettings();
                }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
              );

              this.navCtrl.push(ReportsPage);
            }
          });
      } else if(this.platform.is('ios')) { 
        await cordova.plugins.locationAccuracy.canRequest(async function(canRequest){
          if (canRequest) { 
            await cordova.plugins.locationAccuracy.request(function () {}, 
                function (error) {
                  let alert = this.alertCtrl.create({
                    title: 'Device location off',
                    message: 'Will redirect to the location setting',
                    buttons: ['Dismiss']
                  });
                  alert.present();
                  cordova.plugins.diagnostic.switchToLocationSettings();
                }
            );
    
            this.navCtrl.push(ReportsPage);
          } else { 
     
            await cordova.plugins.locationAccuracy.request(function () {
    
              }, function (error) {
                let alert = this.alertCtrl.create({
                  title: 'Device location off',
                  message: 'Will redirect to the location setting',
                  buttons: ['Dismiss']
                });
                alert.present();
                cordova.plugins.diagnostic.switchToLocationSettings();
              }
            );
    
            this.navCtrl.push(ReportsPage);
          }
        });
      }
    }

   loadMap(){

      let mapEle = this.mapElement.nativeElement;

      this.map = new google.maps.Map(mapEle, {
        center: {lat: this.lat, lng: this.lng},
        zoom: 16
      });

      this.marker = new google.maps.Marker({
        position: this.map.getCenter(),
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: 'My Location'
      });

      google.maps.event.addListenerOnce(this.map, mapEle, this.isMapFullyLoaded());

  }

  isMapFullyLoaded(){
    this.mapLoaded = true;
    this.watch = this.geolocation.watchPosition();
    this.watch.subscribe((data) => {
      this.lat = data.coords.latitude;
      this.lng = data.coords.longitude;
      this.marker.setPosition({lat: this.lat, lng: this.lng});
    });
  }

  sendLocation(){
    this.viewCtrl.dismiss({'lat' : this.marker.getPosition().lat(), 'lng' : this.marker.getPosition().lng()});
  }

  goBack() {
    this.navCtrl.push(ReportsPage);
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>`,
      duration: 5000
    });
  
    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });
  
    loading.present();
  }

}
