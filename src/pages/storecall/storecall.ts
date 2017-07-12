import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage,  NavParams} from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { CallsPage } from '../calls/calls';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import {API_URL} from '../../providers/config';
import { HomePage } from '../home/home';
import { ObjectivesPage } from '../objectives/objectives';
import { StrikeratePage } from '../strikerate/strikerate';
import { SurveysPage } from '../surveys/surveys';
import { PictureofsuccessPage } from '../pictureofsuccess/pictureofsuccess';
import { RangingandassortmentPage } from '../rangingandassortment/rangingandassortment';


import { Geolocation } from '@ionic-native/geolocation';


/**
 * Generated class for the StorecallPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
 	selector: 'page-storecall',
 	templateUrl: 'storecall.html',
 })
 export class StorecallPage {
 	store_id: any;
 	store_name: any;
 	rep_id: any;
 	rep_name: any;
 	loading: any;
 	day_of_week: any;
 	checkedin: any;
 	latitude: any;
 	longitude: any;
 	location_id: any;
 	checkedout: any;

 	constructor(public http: Http, private nav: NavController, private auth: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private navParams: NavParams, private geolocation: Geolocation) {
 		this.store_id 		= navParams.get('store_id'); 
 		this.store_name 	= navParams.get('store_name'); 
 		this.day_of_week 	= navParams.get('day_of_week'); 

 		this.checkedin 		= false;

 		console.log('Store Name:', this.store_name);

 		let info 			= this.auth.getUserInfo();
 		this.rep_id 		= info.re_id;
 		this.rep_name 		= info.rep_name;

 		this.check_if_checkedin  (this.rep_id, this.store_id);
 		// this.check_if_checkedout (this.location_id);


 		this.geolocation.getCurrentPosition().then((resp) => {
			this.latitude 	= resp.coords.latitude;
			this.longitude 	= resp.coords.longitude;

			console.log('latitude:', resp.coords.latitude);
			console.log('longitude:', resp.coords.longitude);
 		 // resp.coords.longitude
 		}).catch((error) => {
 		  console.log('Error getting location', error);
 		});

 		// let watch = this.geolocation.watchPosition();
 		// watch.subscribe((data) => {
	 	// 	this.latitude 	= data.coords.latitude;
	 	// 	this.longitude 	= data.coords.longitude;
 		// });

 		
 	}

 	public gotoobjectives () {
 		this.nav.push(ObjectivesPage, {store_id: this.store_id, store_name: this.store_name, day_of_week:this.day_of_week});
 	}

 	public gotostrikerate () {
 		this.nav.setRoot (StrikeratePage, {store_id: this.store_id, store_name: this.store_name, day_of_week:this.day_of_week});
 		// this.nav.push(StrikeratePage, {store_id: this.store_id, store_name: this.store_name, day_of_week:this.day_of_week});
 	}

 	public gotosurveys () {
 		this.nav.setRoot(SurveysPage, {store_id: this.store_id, store_name: this.store_name, day_of_week:this.day_of_week});
 	}

 	public gotopos () {
 		this.nav.setRoot(PictureofsuccessPage, {store_id: this.store_id, store_name: this.store_name, day_of_week:this.day_of_week});
 	}

 	public gotorass () {
 		this.nav.setRoot(RangingandassortmentPage, {store_id: this.store_id, store_name: this.store_name, day_of_week:this.day_of_week});
 	}


 	public get_current_location (){
 		let watch = this.geolocation.watchPosition();
 		watch.subscribe((data) => {
	 		this.latitude 	= data.coords.latitude;
	 		this.longitude 	= data.coords.longitude;
 		});
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad StorecallPage');
 	}

 	public goback() {
		this.nav.push(CallsPage, {day_of_week: this.day_of_week});
 	}

 	public chekin() {
 		// this.get_current_location();
 		console.log('Checking In', this.store_id);
 		var headers 	= new Headers();
 		headers.append ('Content-Type', 'application/x-www-form-urlencoded');
 		var prams 		= "store_id="+this.store_id +"&rep_id="+this.rep_id+"&latitude="+this.latitude+"&longitude="+this.longitude;


 		this.showLoading();
 		return new Promise (resolve => {
 			this.http.post (API_URL + '/CheckinStore', prams, {headers: headers}).subscribe(data => {
 				if(data.json().success){
 					
 					this.checkedin = true;
 					var prams 		= "store_id="+data.json().store_id +"&rep_id="+data.json().re_id ;
 					this.http.get (API_URL + '/CheckIfCheckedIn?'+prams).subscribe(data => {
 						if(data.json().success){
 							
 							this.checkedin 		= true;
 							this.location_id 	= data.json().checkid_id;
 						}
 						else
 							this.checkedin = false;
 					});
 				}
 				else
 					this.showError(data.json().text);

 				this.hideLoading();
 			});
 		});
 	}

 	public checkout() {
 		console.log('Checking Out', this.store_id);
 		var headers 	= new Headers();
 		headers.append ('Content-Type', 'application/x-www-form-urlencoded');
 		var prams 		= "location_id="+this.location_id;


 		this.showLoading();
 		return new Promise (resolve => {
 			this.http.post (API_URL + '/CheckOutStore', prams, {headers: headers}).subscribe(data => {
 				if(data.json().success){
 					
 					this.checkedin 	= true;
 					var prams 		= "location_id="+ this.location_id;

 					this.http.get (API_URL + '/CheckIfCheckedOut?'+prams).subscribe(data => {
 						if(data.json().success){
 							this.checkedout 	= true;
 							this.location_id 	= data.json().checkid_id;
 						}
 						else
 							this.checkedout 	= false;
 					});
 				}
 				else
 					this.showError(data.json().text);

 				this.hideLoading();
 			});
 		});
 	}


 	public check_if_checkedin (rep_id, store_id) {
 		

 		var headers 	= new Headers();
 		headers.append ('Content-Type', 'application/x-www-form-urlencoded');
 		var prams 		= "store_id="+store_id +"&rep_id="+rep_id;


 		this.showLoading();
 		return new Promise (resolve => {
 			this.http.get (API_URL + '/CheckIfCheckedIn?'+prams).subscribe(data => {
 				if(data.json().success){
 					
 					this.checkedin 		= true;
 					this.location_id 	= data.json().checkid_id;
 				}
 				else
 					this.checkedin = false;

 				var prams2 			= "location_id="+this.location_id;
 				this.http.get (API_URL + '/CheckIfCheckedOut?'+prams2).subscribe(data => {
 					if(data.json().success){
 						
 						this.checkedout = true;
 						// this.location_id 	= data.json().checkid_id;
 					}
 					else
 						this.checkedout = false;
 				});
 			});
 			this.hideLoading();
 		});
 	}

 	public check_if_checkedout (location_id) {

 		var headers 	= new Headers();
 		headers.append ('Content-Type', 'application/x-www-form-urlencoded');
 		var prams 		= "location_id="+location_id;

 		this.showLoading();
 		return new Promise (resolve => {
 			this.http.get (API_URL + '/CheckIfCheckedOut?'+prams).subscribe(data => {
 				if(data.json().success){
 					
 					this.checkedout = true;
 					// this.location_id 	= data.json().checkid_id;
 				}
 				else
 					this.checkedout = false;
 			});
 			this.hideLoading();
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
