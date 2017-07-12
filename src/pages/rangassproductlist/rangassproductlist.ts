import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the RangassproductlistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-rangassproductlist',
  templateUrl: 'rangassproductlist.html',
})
export class RangassproductlistPage {
	products: string = this.navParams.get('rass_products');
	day_of_week: string = this.navParams.get('day_of_week');
	store_id: string = this.navParams.get('store_id');
	store_name: string = this.navParams.get('store_name');
	category_id: string = this.navParams.get('category_id');
	category_name: string = this.navParams.get('category_name');

  	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RangassproductlistPage');
	}

	closeModal() {
		this.viewCtrl.dismiss();
	}

}
