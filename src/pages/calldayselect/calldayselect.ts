import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import {CallsPage} from '../calls/calls';

/**
 * Generated class for the CalldayselectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-calldayselect',
  templateUrl: 'calldayselect.html',
})
export class CalldayselectPage {

  constructor(public http: Http, private nav: NavController, private auth: AuthService) {
  }

  ionViewDidLoad() {
	console.log('ionViewDidLoad CalldayselectPage');
  }

  public goback() {
	this.nav.push(HomePage);
  }

  public gotocalls(day_of_week) {
  	this.nav.push(CallsPage, {day_of_week: day_of_week});
  }

}
