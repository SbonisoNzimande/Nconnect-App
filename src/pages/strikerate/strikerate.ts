import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage,  NavParams, ToastController, ActionSheetController, Platform} from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuthService } from '../../providers/auth-service/auth-service';
import {API_URL} from '../../providers/config';
import { Geolocation } from '@ionic-native/geolocation';
import { StorecallPage } from '../storecall/storecall';


import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery'
/**
 * Generated class for the StrikeratePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-strikerate',
  templateUrl: 'strikerate.html',
})

export class StrikeratePage {
	store_id: any;
	store_name: any;
	rep_id: any;
	rep_name: any;
	loading: any;
	day_of_week: any;
	objective_list: any;
	promo_id: any;
	promo_name = '';
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
	private storage: Storage;
	success:any;
	image_names = '';
	image_list = {id:0, src:''};

	i = 0;
	img_count = 0;

	public images: string[] 		= [];
	// public image_names: string[];
	

	constructor (public http: Http, private nav: NavController, private auth: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private navParams: NavParams, private geolocation: Geolocation, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheet: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, storage: Storage) {
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
		window.localStorage.removeItem ('image_names');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad StrikeratePage');

		this.platform.ready().then(() => {
			// console.log('Platform ready', cordova.file);
			// this.file.checkDir (cordova.file.externalApplicationStorageDirectory, 'mydir').then(_ => console.log('Directory exists')).catch(err => console.log('Directory doesnt exist'));
		});
	}

	public goback() {
		this.nav.push(StorecallPage, {day_of_week: this.day_of_week, store_id: this.store_id, store_name: this.store_name});
	}

	show_promotions () {
		// this.loading.dismiss();

		let alert = this.alertCtrl.create({
			title: 'Select Promotion'
		});

		var promo_list 		= null;
		var prams2 			= "rep_id="+this.rep_id+'&store_id='+this.store_id;
		this.http.get (API_URL + '/GetStorePromos?'+prams2).subscribe(data => {
			if(data.json().success){
				
				promo_list = data.json().data;

				for (let p of data.json().data) {
					alert.addInput({type: 'radio', label: p.promo_description, value: p.promo_id, checked: false});
				}
			}
			else
				promo_list = null;

			alert.addButton('Cancel');
			alert.addButton({
				text: 'OK',
				handler: data => {
					alert.dismiss();
					this.promo_id = data;
					// this.storage.set("nsSite", data);
					// get promo name
					if (promo_list) {
						for (let p of promo_list) {
							if (p.promo_id == this.promo_id) {
								this.promo_name = p.promo_description;

								console.log('promo_name', this.promo_name)
							}
						}
					}

					console.log('selected', data);
					return false;
					}
				});

			alert.present(prompt);
		});

		
	}

	show_reasons () {
		// this.loading.dismiss();

		let alert = this.alertCtrl.create({
			title: 'Select Reason'
		});

		alert.addInput({type: 'radio', label: 'No Stock', value: 'no-stock', checked: false});
		alert.addInput({type: 'radio', label: 'No POS', value: 'no-pos', checked: false});
		alert.addInput({type: 'radio', label: 'Store Not Targeted', value: 'store-not-targeted', checked: false});
		alert.addInput({type: 'radio', label: 'Store Rejected', value: 'store-rejected', checked: false});
		alert.addInput({type: 'radio', label: 'Not Negotiated', value: 'not-negotiated', checked: false});

		var reason 		= null;
		var reason_data = [{id:'no-stock', label:'No Stock'},{id:'no-pos', label:'No POS'},{id:'store-not-targeted', label:'Store Not Targeted'},{id:'store-rejected', label:'Store Rejected'},{id:'not-negotiated', label:'Not Negotiated'}];

		alert.addButton('Cancel');
		alert.addButton({
			text: 'OK',
			handler: data => {
				alert.dismiss();
				this.reasonValue = data;
				reason 			 = true;
				this.reason 	 = data;
				// this.storage.set("nsSite", data);
				// get promo name
				if (reason) {
					for (let r of reason_data) {
						if (r.id == this.reasonValue) {
							this.reasonLabel = r.label;
							

							console.log('r.label', r.label)
						}
					}
				}

				console.log('selected', data);
				return false;
				}
			});

		alert.present(prompt);

		
	}


	uploadPhoto () {
		this.showcustomLoading('Saving...');

		if (this.promo_name) {

			// Save data only
			var submit_data1 		= { 'promo_name': this.promo_name, 'promo_id': this.promo_id, 'store_id': this.store_id, 'rep_id': this.rep_id, 'bin_placed': this.bin_placed, 'number_bins': this.number_bins, 'number_godnola': this.number_godnola, 'reason': this.reason, 'images':this.image_names};

			var headers 			= new Headers();


			headers.append ('Content-Type', 'application/x-www-form-urlencoded');

			this.http.post (API_URL + '/SaveStrikeRate', submit_data1, {headers: headers}).subscribe(data => {
				if(data.json().success === true){
					this.showSuccess (data.json().text);
					// resolve(true);
					this.goback ();
				}
				else
					this.showError (data.json().text);
					// resolve(false);
			});

			
		}else{
			this.showError('Please Select Promo');
		}
	 
		
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

			this.showcustomLoading('Uploading Image..');

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
	        		params: { 'promo_id': this.promo_id, 'store_id': this.store_id, 'rep_id': this.rep_id, 'bin_placed': this.bin_placed, 'number_bins': this.number_bins, 'number_godnola': this.number_godnola, 'reason': this.reason}
	        	};

	        	const fileTransfer: TransferObject 	= this.transfer.create();

	        	fileTransfer.upload(this.imageNewPath, API_URL + '/UploadStrikeRate',
	        		options).then((entry) => {

	        			var response = JSON.parse(entry.response);

	        			console.log('RESPONCE', response);
	        			if(response.success === true){
	        				// this.showSuccess (response.text);
	        				this.success 	= true;
	        				// this.image_names.response.image_name.join(', ');

	        				this.image_names += response.image_name + ',';
	
							this.hideLoading();
							this.img_count++;

	        			}else{
							this.showError (response.text);
							this.success = false;
	        			}
	        			console.log('entry', entry);
	        	  	}, (err) => {
	        			this.showError('Error Uploading' + JSON.stringify(err));
	        			console.log('Error Transferring Image', JSON.stringify(err));
	        	  });


			}, (err) => {
				this.showError('Error copyFile, ' + JSON.stringify(err));
				console.log('Error copyFile', err);
	      })
	 
	    }, (err) => {
	    	this.showError('Error Get Picture, ' + JSON.stringify(err));
	      	console.log('Error Get Picture', JSON.stringify(err));
	    });
	 
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


	showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...',
			dismissOnPageChange: true
		});
		this.loading.present();
	}

	showcustomLoading(text) {
		this.loading = this.loadingCtrl.create({
			content: text,
			dismissOnPageChange: true
		});
		this.loading.present();
	}
	hideLoading() {
		this.loading.dismiss();
	}


}
