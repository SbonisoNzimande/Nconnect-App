import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import {API_URL} from '../../providers/config';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import {CalldayselectPage} from '../calldayselect/calldayselect';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	loading: Loading;
	rep_id 		= '';
	rep_name	= '';
	target_week: any;
	promos: any;
	constructor(public http: Http, private nav: NavController, private auth: AuthService, private loadingCtrl: LoadingController) {
		let info 		= this.auth.getUserInfo();

		// let params: URLSearchParams = new URLSearchParams();
		// params.set('rep_id', info['rep_id']);

		var creds 		= "rep_id=" + info['rep_id'];

		this.rep_id 	= info.re_id;
		this.rep_name 	= info.rep_name;

		this.http 		= http;

		console.log(info.re_id);
		this.get_dash_data(info.re_id);

		
	}

	public get_dash_data(rep_id) {
		this.showLoading();
		this.http.get(API_URL + '/GetDashboardInfo?rep_id=' +rep_id).map(res => res.json()).subscribe(data => {
			
			this.target_week 	= data.target_week + '%';
			this.promos 		= data.promo_info;
			this.hideLoading();
			console.log(data);
		});
	}

	public logout() {
		this.auth.logout().subscribe(succ => {
		  this.nav.setRoot('LoginPage');
		});
	}

	public gotocalls() {
		this.nav.push(CalldayselectPage);
	}

	doRefresh(refresher) {
		console.log('Begin async operation', refresher);

		setTimeout(() => {
		  console.log('Async operation has ended');
		  this.nav.push(HomePage);
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

}
