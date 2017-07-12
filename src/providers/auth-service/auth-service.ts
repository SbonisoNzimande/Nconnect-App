import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {API_URL} from '../config';
import { NavController, AlertController, LoadingController, Loading, IonicPage,  NavParams, ToastController, ActionSheetController, Platform} from 'ionic-angular';


 
export class User {
	re_id: string;
	rep_name: string;
 
	constructor(re_id: string, rep_name: string) {
		this.re_id  	= re_id;
		this.rep_name 	= rep_name;
  	}
}
 
@Injectable()
export class AuthService {
	currentUser: User;
	isLoggedin: boolean;
	loginError: string;
	loading: any;
	AuthToken;

	constructor(public http: Http, private loadingCtrl: LoadingController, private alertCtrl: AlertController, public storage: Storage) {
		this.http 		= http;
		this.isLoggedin = false;
		this.AuthToken 	= null;
	}

	// ** Store User Session ** //
	public storeUserCredentials (token) {
		window.localStorage.setItem ('nconnect_user', token);
		this.useCredentials (token);
	}


	public useCredentials (token) {
		this.isLoggedin = true;
		this.AuthToken 	= token;
	}

	public loadUserCredentials() {
		var token = window.localStorage.getItem ('nconnect_user');
		this.useCredentials (token);
	}

	public destroyUserCredentials() {
		this.isLoggedin = false;
		this.AuthToken 	= null;
		window.localStorage.clear();
	}


	public authenticate (credentials) {
		var creds 		= "rep_id=" + credentials.rep_id + "&password=" + credentials.password;
		var headers 	= new Headers();
		headers.append ('Content-Type', 'application/x-www-form-urlencoded');

		console.log('AUt')
		
		return new Promise (resolve => {
			this.http.post (API_URL + '/RepLogin', creds, {headers: headers}).subscribe(data => {
				if(data.json().success){
					this.storeUserCredentials (data.json().token);
					this.currentUser 	= new User(data.json().re_id, data.json().rep_name);
					resolve(true);
				}
				else
					this.loginError 	= data.json().text;
					resolve(false);
			});
		});
	}

 
	public login(credentials) {
		if (credentials.re_id === null || credentials.password === null) {
		  return Observable.throw("Please insert credentials");
		} else {
		  return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			let access = (credentials.password === "pass" && credentials.re_id === "re_id");
			this.currentUser = new User('Simon', 'saimon@devdactic.com');
			observer.next(access);
			observer.complete();
		  });
		}
	}
		
	public register(credentials) {
		if (credentials.re_id === null || credentials.password === null) {
		  return Observable.throw("Please insert credentials");
		} else {
		  // At this point store the credentials to your backend!
		  return Observable.create(observer => {
			observer.next(true);
			observer.complete();
		  });
		}
	}
		
	// public getuserinfo() {
	// 	return new Promise(resolve => {
	// 		var headers 	= new Headers();
	// 		this.loadUserCredentials();

	// 		console.log(this.AuthToken);

	// 		headers.append('Authorization', 'Bearer ' +this.AuthToken);
	// 		this.http.get(API_URL + '/GetRepInfo', {headers: headers}).subscribe(data => {
	// 			if(data.json().success)
	// 				resolve(data.json());
	// 			else
	// 				resolve(false);
	// 		});
	// 	})
	// }

	public getUserInfo() {
	    return this.currentUser;
	}
		
		
	public logout() {
		return Observable.create(observer => {
			this.destroyUserCredentials();
			observer.next(true);
			observer.complete();
		});
	}

	showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...',
			dismissOnPageChange: false
		});
		this.loading.present();
	}

	hideLoading() {
		this.loading.dismiss();
	}


	  public showError (text) {
	  	this.loading.dismiss();
	  	let alert = this.alertCtrl.create({
	  		title: 'Error',
	  		subTitle: text,
	  		buttons: ['OK']
	  	});
	  	alert.present(prompt);
	  }

	public showSuccess (text) {
	  this.loading.dismiss();
	  let alert = this.alertCtrl.create({
	  	title: 'Success',
	  	subTitle: text,
	  	buttons: ['OK']
	  });
	  alert.present(prompt);
	}

	showcustomLoading(text) {
		this.loading = this.loadingCtrl.create({
			content: text,
			dismissOnPageChange: true
		});
		this.loading.present();
	}

}