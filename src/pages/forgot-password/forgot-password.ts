import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Services } from '../../providers/api-service/service';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {

  email: any = "";

  constructor(public navCtrl: NavController, private api: ApiServiceProvider,
    private service: Services) {
  }

  sendData() {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.email == "") {
      this.service.showErrorAlert("", "Email cannot be empty");
    } else if (!re.test(this.email)) {
      this.service.showErrorAlert("", "Please enter a valid email address.");
    } else {

      var data = {
        "email": this.email,
      }

      let dataArray: string = JSON.stringify(data);
      this.api.presentLoadingDefault();
      this.service.sendData("passwordReset", "", dataArray)
        .subscribe(
          data => {
            // console.log("Data (ForgotPasswordPage.ts sendData) :", data);
            this.api.loading.dismiss();
            this.service.showErrorAlert("", data.message);
            this.email = "";
          },
          error => {
            // console.log("error (ForgotPasswordPage.ts sendData) :", error);
            this.api.loading.dismiss();
            this.service.showErrorAlert("", JSON.parse(error._body).message);
          }
        );
    }
  }
}
