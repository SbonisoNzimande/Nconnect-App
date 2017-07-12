import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage,  NavParams, ToastController, ActionSheetController, Platform} from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuthService } from '../../providers/auth-service/auth-service';
import {API_URL} from '../../providers/config';
import { Geolocation } from '@ionic-native/geolocation';
import { SurveysPage } from '../surveys/surveys';
import { LoginPage } from '../login/login';
import { StorecallPage } from '../storecall/storecall';

import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import * as $ from 'jquery'

/**
 * Generated class for the SurveyformPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-surveyform',
  templateUrl: 'surveyform.html',
})
export class SurveyformPage {

	survey_type: any;
	survey_type_id: any;
	survey_id: any;
	survey_title: any;
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
	number_bins: any;
	number_godnola: any;
	survey_list: any;
	npd_list: any;
	adhoc_list: any;
	question_list: string[] 		= [];
	imageChosen: any = 0;
	imagePath: any;
	imageNewPath: any;
	image_names = '';

	replys_object = {};
	i = 0;
	img_count = 0;

	public images: string[] 		= [];
	success:any;
	

	constructor (public http: Http, private nav: NavController, private auth: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private navParams: NavParams, private geolocation: Geolocation, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheet: ActionSheetController, public toastCtrl: ToastController, public platform: Platform) {
		this.survey_type 	= navParams.get('survey_type'); 
		this.survey_type_id = navParams.get('survey_type_id'); 
		this.survey_id 		= navParams.get('survey_id'); 
		this.survey_title 	= navParams.get('survey_title'); 
		this.store_id 		= navParams.get('store_id'); 
		this.store_name 	= navParams.get('store_name'); 
		this.day_of_week 	= navParams.get('day_of_week'); 

		console.log('survey_type', this.survey_type);
		console.log('survey_id', this.survey_id);
	
		this.auth.loadUserCredentials();
	
		if (!this.auth.AuthToken) { // validate if login
			this.nav.setRoot ('LoginPage');
		}

		this.auth.getUserInfo();

		// console.log (this.auth.currentUser);
		this.AuthToken 		= this.auth.AuthToken;
		this.rep_id 		= this.auth.currentUser.re_id;
		this.rep_name 		= this.auth.currentUser.rep_name;

		this.get_survey_questions_list (this.survey_id, this.survey_type_id);

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SurveyformPage');
	}


	public get_survey_questions_list(survey_id, survey_type) {
		this.auth.showLoading();
		this.http.get(API_URL + '/GetQuestionsBySurveyID?survey_id=' +survey_id+'&survey_type='+survey_type).map(res => res.json()).subscribe(data => {
			var response = data;

			this.question_list 	= response;
			
			this.auth.hideLoading();
			console.log(response);

		});
	}

	public goback() {
		this.nav.push(SurveysPage, {day_of_week: this.day_of_week, store_id: this.store_id, store_name: this.store_name});
	}

	public SubmitForm(form) {

		this.auth.showcustomLoading('Saving Form...');

		var form_data 	= { 'survey_id': this.survey_id, 'survey_type': this.survey_type_id, 'store_id': this.store_id, 'rep_id': this.rep_id}
		// form_data.concat(form);
		var submit_data = $.extend(form_data, form);

		console.log(submit_data);

		var headers 			= new Headers();

		headers.append ('Content-Type', 'application/x-www-form-urlencoded');

		this.http.post (API_URL + '/SaveSurveyForm', submit_data, {headers: headers}).subscribe(data => {
			if(data.json().success === true){
				this.goback ();
				this.auth.showSuccess (data.json().text);
			}
			else
				this.auth.showError (data.json().text);
		});
	}

	chooseImage(question_number, e) {

		e.preventDefault(); 

		var options: any;

		

		options = {
			quality: 30,
			destinationType: this.camera.DestinationType.FILE_URI,
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
			allowEdit: false,
			encodingType: this.camera.EncodingType.JPEG,
			targetWidth: 500,
			targetHeight: 500,
			saveToPhotoAlbum: false
		};

		this.camera.getPicture(options).then((imgUrl) => {

			var sourceDirectory 	= imgUrl.substring(0, imgUrl.lastIndexOf('/') + 1);
			var sourceFileName 		= imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.length);
			sourceFileName 			= sourceFileName.split('?')[0];
			this.auth.showcustomLoading('Uploading...');

			
			this.file.copyFile(sourceDirectory, sourceFileName, cordova.file.cacheDirectory, sourceFileName).then((result: any) => {
				this.imagePath 		= imgUrl;
				this.imageChosen 	= 1;
				this.imageNewPath 	= result.nativeURL;

				

				this.images.push(this.imageNewPath);
				console.log('Image Path', this.images);


				let filename 		=  this.imageNewPath.split('/').pop();

				console.log('!!filename!!', filename);

				let options  	= {
					fileKey: "file",
					fileName: filename,
					chunkedMode: true,
					mimeType: "image/jpg",
					params: {'rep_id':this.rep_id, 'survey_id':this.survey_id, 'store_id':this.store_id, 'survey_type':this.survey_type_id, 'question_number':question_number }
				};


				const fileTransfer: TransferObject 	= this.transfer.create();

				fileTransfer.upload(this.imageNewPath, API_URL + '/UploadSurveyImage',
					options).then((entry) => {

						var response = JSON.parse(entry.response);
						if(response.success === true){
							// this.showSuccess (response.text);
							this.success 	= true;

							this.image_names = response.image_name;

							$('#' + question_number).val(response.image_name);

							this[question_number] = response.image_name;

							console.log(this[question_number]);
	
							this.auth.hideLoading();
							this.img_count++;

						}else{
							this.auth.showError (response.text);
							this.success = false;
						}
						console.log('entry', entry);
					}, (err) => {
						this.auth.showError('Error Uploading' + JSON.stringify(err));
						console.log('Error Transferring Image', JSON.stringify(err));
				  });


			}, (err) => {
				this.auth.showError('Error copyFile, ' + JSON.stringify(err));
				console.log('Error copyFile', err);
		  });

		}, (err) => {
			this.auth.showError('Error Get Picture, ' + JSON.stringify(err));
			console.log('Error Get Picture', JSON.stringify(err));
		});
	}




}
