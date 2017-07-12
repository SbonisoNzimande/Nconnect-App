import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController, Loading, IonicPage,  NavParams, ToastController, ActionSheetController, Platform} from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuthService } from '../../providers/auth-service/auth-service';
import {API_URL} from '../../providers/config';
import { Geolocation } from '@ionic-native/geolocation';
import { StorecallPage } from '../storecall/storecall';
import { SurveyformPage } from '../surveyform/surveyform';
import { PictureofsuccessPage } from '../pictureofsuccess/pictureofsuccess';
import { LoginPage } from '../login/login';
import { PosViewImagePage } from '../pos-view-image/pos-view-image';

import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import * as $ from 'jquery'

/**
 * Generated class for the PictureofsuccessPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-pictureofsuccessform',
  templateUrl: 'pictureofsuccessform.html',
})
export class PictureofsuccessformPage {
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
  pos_categories: any;
  category_id: any;
  category_name: any;
  poc_id: any;
  pos_upload_image: any;
  category_inline: any;
  image_names = '';
  image_list = {id:0, src:''};
  public images: string[] 		= [];
  success:any;
  i = 0;
  img_count = 0;

	constructor (public modalCtrl: ModalController, public http: Http, private nav: NavController, private auth: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private navParams: NavParams, private geolocation: Geolocation, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheet: ActionSheetController, public toastCtrl: ToastController, public platform: Platform) {
		this.store_id 			= navParams.get('store_id'); 
		this.store_name 		= navParams.get('store_name'); 
		this.day_of_week 		= navParams.get('day_of_week'); 
		this.poc_id 			= navParams.get('poc_id'); 
		this.pos_upload_image 	= navParams.get('pos_upload_image'); 
		this.category_id 		= navParams.get('category_id'); 
		this.category_name 		= navParams.get('category_name'); 

		this.auth.loadUserCredentials();

		if (!this.auth.AuthToken) { // validate if login
			this.nav.setRoot ('LoginPage');
		}

		this.auth.getUserInfo();

		// console.log (this.auth.currentUser);
		this.AuthToken 			= this.auth.AuthToken;
		this.rep_id 			= this.auth.currentUser.re_id;
		this.rep_name 			= this.auth.currentUser.rep_name;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PictureofsuccessformPage');
  }


	public goback() {
		this.nav.push(PictureofsuccessPage, {day_of_week: this.day_of_week, store_id: this.store_id, store_name: this.store_name});
	}


	view_pos_image() {
		let myModal = this.modalCtrl.create(PosViewImagePage, {image: this.pos_upload_image});
		myModal.present();
  	}



  chooseImage() {

  	try{
  	    let actionSheet = this.actionSheet.create({
  	      title: 'Choose Picture Source',
  	      buttons: [
  	    	{
  	    	  text: 'Gallery',
  	    	  icon: 'albums',
  	    	  handler: () => {
  	    		this.actionHandler(1);
  	    	  }
  	    	},
  	    	{
  	    	  text: 'Camera',
  	    	  icon: 'camera',
  	    	  handler: () => {
  	    		this.actionHandler(2);
  	    	  }
  	    	},
  	    	{
  	    	  text: 'Cancel',
  	    	  role: 'cancel',
  	    	  handler: () => {
  	    		console.log('Cancel clicked');
  	    	  }
  	    	}
  	      ]
  	    });
  	    
  	    actionSheet.present();

  	}catch(e){
  		console.log(e);
  		console.log(e.stack);
  		console.log(e.line);
  	}
   
  	
  }


  actionHandler(selection: any) {
      var options: any;
   
      if (selection == 1) {
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
      } else {
  		options = {
  			quality: 30,
  			destinationType: this.camera.DestinationType.FILE_URI,
  			sourceType: this.camera.PictureSourceType.CAMERA,
  			allowEdit: false,
  			encodingType: this.camera.EncodingType.JPEG,
  			targetWidth: 500,
  			targetHeight: 500,
  			saveToPhotoAlbum: false
  		};
      }


      
   
      this.camera.getPicture(options).then((imgUrl) => {

      	console.log('imgUrl', imgUrl);
   
  		var sourceDirectory 	= imgUrl.substring(0, imgUrl.lastIndexOf('/') + 1);
  		var sourceFileName 		= imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.length);
  		console.log('sourceFileName1', sourceFileName);
  		sourceFileName 			= sourceFileName.split('?')[0];

  		console.log('sourceDirectory', sourceDirectory);
  		console.log('sourceFileName2', sourceFileName);

  		this.auth.showcustomLoading('Uploading Image..');

  		// var i = 0;

		this.file.copyFile(sourceDirectory, sourceFileName, cordova.file.cacheDirectory, sourceFileName).then((result: any) => {
  			this.imagePath 		= imgUrl;
          	this.imageChosen 	= 1;
          	this.imageNewPath 	= result.nativeURL;


          	this.image_list.id 	= this.i;
          	this.image_list.src = imgUrl;
          	this.i++;
        

          	this.images.push(this.imageNewPath);
          	console.log('Image Path', this.images);


          	let filename 	=  this.imageNewPath.split('/').pop();

          	console.log('!!filename!!', filename);

          	let options  	= {
				fileKey: "file",
				fileName: filename,
				chunkedMode: true,
				mimeType: "image/jpg",
				params: { 'poc_id': this.poc_id, 'category_id': this.category_id, 'store_id': this.store_id, 'rep_id': this.rep_id}
          	};

          	const fileTransfer: TransferObject 	= this.transfer.create();

          	fileTransfer.upload(this.imageNewPath, API_URL + '/UploadPOSImage',
          		options).then((entry) => {

          			var response = JSON.parse(entry.response);

          			console.log('RESPONCE', response);
          			if(response.success === true){
          				this.success 		= true;

          				this.image_names 	+= response.image_name + ',';
  
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
        })
   
      }, (err) => {
      	this.auth.showError('Error Get Picture, ' + JSON.stringify(err));
        	console.log('Error Get Picture', JSON.stringify(err));
      });
   
    }


    SavePictureOfSuccess () {
    	this.auth.showcustomLoading('Saving...');

    	if (this.category_inline) {

    		// Save data only
    		var submit_data1 		= { 'image_names': this.image_names, 'category_inline': this.category_inline, 'poc_id': this.poc_id, 'category_id': this.category_id, 'store_id': this.store_id, 'rep_id': this.rep_id};

    		var headers 			= new Headers();

    		console.log('SUBMIT DATA', submit_data1);

    		headers.append ('Content-Type', 'application/x-www-form-urlencoded');

    		this.http.post (API_URL + '/SavePictureOfSuccess', submit_data1, {headers: headers}).subscribe(data => {
    			if(data.json().success === true){
    				this.auth.showSuccess (data.json().text);
    				// resolve(true);
    				this.goback ();
    			}
    			else
    				this.auth.showError (data.json().text);
    				// resolve(false);
    		});

    		
    	}else{
    		this.auth.showError('Is the category in line with the picture of success?');
    	}
     
    	
    }

}
