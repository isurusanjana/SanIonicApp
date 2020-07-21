import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {CameraOptions, Camera} from '@ionic-native/camera';
import {Platform} from "ionic-angular";
import {HTTP} from "@ionic-native/http";

/*
  Generated class for the CameraServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CameraServiceProvider {

  constructor(
    private camera: Camera,
    public platform: Platform,
    private http: HTTP,)
  {
    console.log('Hello CameraServiceProvider Provider');
  }

  public getPicture(): Observable<any> {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      targetWidth: 300,
      targetHeight: 300,
    };

    return Observable.create(observer => {
      this.platform.ready().then(() => {
        this.camera.getPicture(options).then((imageData: any) => {
          // Android DestinationType.FILE_URI returns a local image url in this form: content://media/external/images/media/1249
          // iOS DestinationType.FILE_URI returns a local image url in this form: file:///var/mobile/Containers/Data/Application/25A3F622-38DB-4701-AB20-90AAE9AC02C8/tmp/cdv_photo_002.jpg
          observer.next(imageData);
          observer.complete();

        }).catch((error) => {
          // Handle error.
          observer.next("");
          observer.complete();
        });
      });
    });
  }

  public getPicture1(sourceType:any): Observable<any> {

    const options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: true,
        targetWidth: 300,
        targetHeight: 300,
    };

    return Observable.create(observer => {
        this.platform.ready().then(() => {
            this.camera.getPicture(options).then((imageData: any) => {
                // Android DestinationType.FILE_URI returns a local image url in this form: content://media/external/images/media/1249
                // iOS DestinationType.FILE_URI returns a local image url in this form: file:///var/mobile/Containers/Data/Application/25A3F622-38DB-4701-AB20-90AAE9AC02C8/tmp/cdv_photo_002.jpg
                observer.next(imageData);
                observer.complete();

            }).catch((error) => {
                // Handle error.
                observer.next("");
                observer.complete();
            });
        });
    });
}


  getBlob(b64Data:string) {
    return Observable.create(observer => {
      let contentType = 'image/jpeg';
      let sliceSize = 512;

      let byteCharacters = atob(b64Data);
      let byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      let blob = new Blob(byteArrays, {type: contentType});
      observer.next(blob);
      observer.complete();
    });
  }

}
