import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {StartPage} from "../start/start";
import {ApiServiceProvider} from "../../providers/api-service/api-service";
import {FormBuilder, FormGroup, Validators,} from "@angular/forms";
import { MustMatch } from '../../providers/custom-validations/must-match.validator';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  private registerForm : FormGroup;
  private loginUsername  : string = '';
  private loginPassword  : string = '';

  constructor(
    public navCtrl: NavController,
    private api: ApiServiceProvider,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    
  )
  {
    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{1}[a-zA-Z0-9.\-_]*@[a-zA-Z]{1}[a-zA-Z.-]*[a-zA-Z]{1}[.][a-zA-Z]{2,}$')]],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      c_password: ['', Validators.required],
      condition_check: [false, Validators.pattern('true')],
    }, {
      validator: MustMatch('password', 'c_password')
    });
    
  }

  get first_name() {
    return this.registerForm.get("first_name");
  }
  get last_name() {
    return this.registerForm.get("last_name");
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get c_password() {
    return this.registerForm.get('c_password');
  }
  get condition_check() {
    return this.registerForm.get('condition_check');
  }
  
  public errorMessages = {
    first_name: [
      { type: 'required', message: 'First name is required' },
    ],
    last_name: [
      { type: 'required', message: 'Last name is required' },
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email address' },
      { type: 'pattern', message: 'Please enter a valid email address' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Please enter at least 6 characters' }
    ],
    c_password: [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'mustMatch', message: 'Password not matched'}
    ],
    condition_check: [
      { type: 'required', message: 'Accept terms and conditions' },
    ],
  };

  goToStart(params)
  {
    if (!params) params = {};
    this.navCtrl.setRoot(StartPage);
  }

  doRegister()
  {
    let userData: any = {
      first_name : this.registerForm.value.first_name,
      last_name : this.registerForm.value.last_name,
      email : this.registerForm.value.email,
      password : this.registerForm.value.password,
      c_password : this.registerForm.value.c_password,
    };
    this.api.register(userData).then((res: any) =>{
      let data = JSON.parse(res.data).success;
      let alert = this.alertCtrl.create({
        title: 'Successfully Registered',
        message: data.message,
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              this.goToStart({});
            }
          },
        ]
      });
      alert.present();
    });
  }
}
