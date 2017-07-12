import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

import { HomePage } from '../home/home';
 
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
	loading: Loading;
	registerCredentials = { rep_id: '', password: '' };
	
	constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { 
	}
	
	public createAccount() {
		this.nav.push('RegisterPage');
	}
 
	public login() {
		this.showLoading()
	

		this.auth.authenticate (this.registerCredentials).then(allowed => {
			if(allowed) {
				console.log(allowed);
				// this.nav.setRoot ('HomePage');
				this.nav.push(HomePage);
			}else {
				this.showError ("Access Denied, " + this.auth.loginError);
			}
		},
		error => {
			    this.showError(error);
			});
	}
 
	showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...',
			dismissOnPageChange: true
		});
		this.loading.present();
	}
 
	showError (text) {
		this.loading.dismiss();

		let alert = this.alertCtrl.create({
			title: 'Fail',
			subTitle: text,
			buttons: ['OK']
		});
		alert.present(prompt);
	}
}