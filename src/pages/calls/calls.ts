import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage,  NavParams} from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { CalldayselectPage } from '../calldayselect/calldayselect';
import { StorecallPage } from '../storecall/storecall';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import {API_URL} from '../../providers/config';
import { HomePage } from '../home/home';

/**
 * Generated class for the CallsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-calls',
  templateUrl: 'calls.html',
})
export class CallsPage {
	day_of_week: any;
	rep_id: any;
	rep_name: any;
	week_stores: any;
	
	loading: any;
	constructor(public http: Http, private nav: NavController, private auth: AuthService, private loadingCtrl: LoadingController, private navParams: NavParams) {
		this.day_of_week 	= navParams.get('day_of_week'); 
		let info 			= this.auth.getUserInfo();
		this.rep_id 		= info.re_id;
		this.rep_name 		= info.rep_name;

		console.log('day_of_week', this.day_of_week);
		this.get_store_data (this.rep_id, this.day_of_week);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CallsPage');
	}

	public goback() {
		this.nav.push(CalldayselectPage);
	}

	public get_store_data(rep_id, day_of_week) {
		this.showLoading();
		this.http.get(API_URL + '/GetWeekdayStoreInfo?rep_id=' +rep_id+'&day_of_week='+day_of_week).map(res => res.json()).subscribe(data => {
			
			this.week_stores = data;
			this.hideLoading();
			console.log(data);

		});
	}

	public gotostorecall (store_id, store_name) {
		this.nav.push(StorecallPage, {store_id: store_id, store_name: store_name, day_of_week:this.day_of_week});
	}

	doRefresh(refresher) {
		console.log('Begin async operation', refresher);

		setTimeout(() => {
		  console.log('Async operation has ended');
		  this.get_store_data (this.rep_id, this.day_of_week);
		  refresher.complete();
		}, 2000);
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


	// filterItems(searchTerm){
	// 	return this.items.filter((item) => {
	// 		return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
	// 	});     
	 
	// }

	

}
