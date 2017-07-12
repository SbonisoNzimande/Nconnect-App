import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage,  NavParams} from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { CallsPage } from '../calls/calls';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import {API_URL} from '../../providers/config';
import { HomePage } from '../home/home';
import { ObjectivesPage } from '../objectives/objectives';
import { RangingandassortmentfillPage } from '../rangingandassortmentfill/rangingandassortmentfill';

import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the AddobjectivePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-addobjective',
  templateUrl: 'addobjective.html',
})
export class AddobjectivePage {

	store_id: any;
	store_name: any;
	rep_id: any;
	rep_name: any;
	loading: any;
	day_of_week: any;
	objective_list: any;
	AuthToken: any;

	smart = {s:false, m:false, a:false, r:false, t:false};

	constructor(public http: Http, private nav: NavController, private auth: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private navParams: NavParams, private geolocation: Geolocation) {

		this.store_id 		= navParams.get('store_id'); 
		this.store_name 	= navParams.get('store_name'); 
		this.day_of_week 	= navParams.get('day_of_week'); 

		this.auth.loadUserCredentials();

		if (!this.auth.AuthToken) { // validate if login
			this.nav.setRoot ('LoginPage');
		}

		this.auth.getUserInfo();

		// console.log (this.auth.currentUser);
		this.AuthToken 	= this.auth.AuthToken;
		this.rep_id 	= this.auth.currentUser.re_id;
		this.rep_name 	= this.auth.currentUser.rep_name;

		// this.get_objective_data (this.rep_id, this.store_id);

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddobjectivePage');
	}

	public goback() {
		this.nav.push(ObjectivesPage, {day_of_week: this.day_of_week, store_id: this.store_id, store_name: this.store_name});
	}


	showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...',
			dismissOnPageChange: true
		});
		this.loading.present();
	}

	public SubmitForm(from_data) {

		var submit_data 		= from_data.value;
		submit_data.store_id 	= this.store_id;
		submit_data.rep_id 		= this.rep_id;

		this.showLoading();
		if (!submit_data.activity) {
			this.showError('Please Insert Activity');
		}else if (!submit_data.strategy) {
			this.showError('Please Select Strategy');
		}else{
			var headers 	= new Headers();
			headers.append ('Content-Type', 'application/x-www-form-urlencoded');

			this.http.post (API_URL + '/SaveObjective', submit_data, {headers: headers}).subscribe(data => {
				if(data.json().success === true){
					this.showSuccess (data.json().text);
					// resolve(true);
				}
				else
					this.showError (data.json().text);
					// resolve(false);
			});
		}

		

		
	

		// console.log(from_data.value);
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

	hideLoading() {
		this.loading.dismiss();
	}






}
