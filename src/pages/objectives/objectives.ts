import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage,  NavParams} from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuthService } from '../../providers/auth-service/auth-service';
import {API_URL} from '../../providers/config';
import { Geolocation } from '@ionic-native/geolocation';
import { StorecallPage } from '../storecall/storecall';
import { AddobjectivePage } from '../addobjective/addobjective';

/**
 * Generated class for the ObjectivesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-objectives',
  templateUrl: 'objectives.html',
})
export class ObjectivesPage {


	store_id: any;
	store_name: any;
	rep_id: any;
	rep_name: any;
	loading: any;
	day_of_week: any;
	objective_list = {activity: 'No Objective Yet', strategy: 'No Strategy Yet'};
	AuthToken: any;

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

		this.get_objective_data (this.rep_id, this.store_id);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ObjectivesPage');
	}

   	public goback() {
		this.nav.push(StorecallPage, {day_of_week: this.day_of_week, store_id: this.store_id, store_name: this.store_name});
	}

	public gotoaddobjective () {
		this.nav.push(AddobjectivePage, {store_id: this.store_id, store_name: this.store_name, day_of_week:this.day_of_week});
	}


	hideLoading() {
		this.loading.dismiss();
	}


	public get_objective_data (rep_id, store_id) {
		this.showLoading();
		this.http.get(API_URL + '/GetLastSavedObjective?rep_id=' +rep_id+'&store_id=' +store_id).map(res => res.json()).subscribe(data => {

			if (data.success) {
				this.objective_list.activity 	= data.activity;
				this.objective_list.strategy 	= data.strategy;
			}
			
			
			this.hideLoading();
			console.log(data);
		});
	}

	showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...',
			dismissOnPageChange: true
		});
		this.loading.present();
	}

}
