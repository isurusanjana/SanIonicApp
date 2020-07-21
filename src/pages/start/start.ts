import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import {HomePage} from "../home/home";
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {ApiServiceProvider} from "../../providers/api-service/api-service";

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  private loginForm : FormGroup;
  private loginUsername  : string = '';
  private loginPassword  : string = '';
  private loginRemember  : boolean = false;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private api: ApiServiceProvider
  )
  {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required],
      rememberMe: [null]
    });

  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  public errorMessages = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Please enter a valid email address' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
    ],  };

  ionViewDidLoad() {
    if (localStorage.getItem('login') !== null) {
      localStorage.setItem('appLoad', '1');
      this.navCtrl.setRoot(HomePage);
    } 
    else if(localStorage.getItem('rememberMe') === 'true') {
      this.loginUsername = localStorage.getItem('loginEmail');
      this.loginPassword = localStorage.getItem('loginPassword');
      this.loginRemember = true;
    //   this.api.login({email: localStorage.getItem('loginEmail'), password: localStorage.getItem('loginPassword')}).then((res: any)=>{
    //     localStorage.setItem('login', JSON.stringify(JSON.parse(res.data).success));
    //   this.goToHome(res);
    // });
    }
  }

  goToRegister(params){
    if (!params) params = {};
    this.navCtrl.setRoot(RegisterPage);
  }

  goToForgotPassword(params){
    if (!params) params = {};
    this.navCtrl.push(ForgotPasswordPage);
  }

  goToHome(params){
    if(!params) params = { appLoad:true };
    this.navCtrl.setRoot(HomePage, { 'appLoad':'true' });
  }

  onTermsChecked($event){
    alert($event.checked);
    if ( ! $event.checked)
    {
        // this.userContractForm.patchValue({ termsAccepted: null });
    }
  }

  doLogin(){
    var rememberMe = this.loginForm.value.rememberMe;
    var loginEmail = this.loginForm.value.email;
    var loginPassword = this.loginForm.value.password;

    this.api.login(this.loginForm.value).then((res: any)=>{
      console.log(JSON.parse(res.data).success);
      
      if(rememberMe == true) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('loginEmail', loginEmail);
        localStorage.setItem('loginPassword', loginPassword);
      } else {
        localStorage.setItem('rememberMe', 'false');
      }

      localStorage.setItem('login', JSON.stringify(JSON.parse(res.data).success));
      this.goToHome(res);
    });

    this.loginUsername = '';
    this.loginPassword = '';
  }
}
