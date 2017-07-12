import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage,  NavParams, ToastController, ActionSheetController, Platform} from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuthService } from '../../providers/auth-service/auth-service';
import {API_URL} from '../../providers/config';
import { Geolocation } from '@ionic-native/geolocation';
import { StorecallPage } from '../storecall/storecall';
import { SurveyformPage } from '../surveyform/surveyform';
import { LoginPage } from '../login/login';

import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import * as $ from 'jquery'

/**
 * Generated class for the SurveysPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-surveys',
  templateUrl: 'surveys.html',
})
export class SurveysPage {

  store_id: any;
  store_name: any;
  rep_id: any;
  rep_name: any;
  loading: any;
  day_of_week: any;
  objective_list: any;
  promo_id: any;
  promo_name: any;
  AuthToken: any;
  lastImage: string = null;
  imageChosen: any = 0;
  imagePath: any;
  imageNewPath: any;
  reasonLabel: any;
  reasonValue: any;
  bin_placed: any;
  reason = '';
  number_bins: any;
  number_godnola: any;
  survey_list: any;
  npd_list: any;
  adhoc_list: any;
  // image_names = [];
  image_list = {id:0, src:''};
  i = 0;
  img_count = 0;

  
  

  constructor (public http: Http, private nav: NavController, private auth: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private navParams: NavParams, private geolocation: Geolocation, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheet: ActionSheetController, public toastCtrl: ToastController, public platform: Platform) {
	this.store_id 		= navParams.get('store_id'); 
	this.store_name 	= navParams.get('store_name'); 
	this.day_of_week 	= navParams.get('day_of_week'); 

	this.auth.loadUserCredentials();

	if (!this.auth.AuthToken) { // validate if login
		this.nav.setRoot ('LoginPage');
	}

	this.auth.getUserInfo();

	// console.log (this.auth.currentUser);
	this.AuthToken 		= this.auth.AuthToken;
	this.rep_id 		= this.auth.currentUser.re_id;
	this.rep_name 		= this.auth.currentUser.rep_name;

	// this.image_names 	= [];

	this.get_survey_list (this.rep_id, this.store_id);
  }


  ionViewDidLoad() {
	console.log('ionViewDidLoad SurveysPage');
  }

  public get_survey_list(rep_id, store_id) {
	this.auth.showLoading();
	this.http.get(API_URL + '/GetAllSurveys?rep_id=' +rep_id+'&store_id='+store_id).map(res => res.json()).subscribe(data => {
		var response = data.data;

		this.survey_list 	= response.surveys;
		this.npd_list 		= response.npd_surveys;
		this.adhoc_list 	= response.adhoc_surveys;
		this.auth.hideLoading();
		console.log(response);

	});
  }

  public goback() {
	this.nav.push(StorecallPage, {day_of_week: this.day_of_week, store_id: this.store_id, store_name: this.store_name});
  }


	public gotoformfill (survey_type, survey_type_id, survey_id, survey_title) {
		this.nav.setRoot(SurveyformPage, {survey_type: survey_type, survey_type_id: survey_type_id, survey_id: survey_id, survey_title: survey_title, store_id: this.store_id, store_name: this.store_name, day_of_week:this.day_of_week});
	}
}
