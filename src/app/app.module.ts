import { AuthService } from '../providers/auth-service/auth-service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CalldayselectPage } from '../pages/calldayselect/calldayselect';
import { CallsPage } from '../pages/calls/calls';
import { ObjectivesPage } from '../pages/objectives/objectives';
import { StorecallPage } from '../pages/storecall/storecall';
import { AddobjectivePage } from '../pages/addobjective/addobjective';
import { StrikeratePage } from '../pages/strikerate/strikerate';
import { SurveysPage } from '../pages/surveys/surveys';
import { SurveyformPage } from '../pages/surveyform/surveyform';
import { PictureofsuccessPage } from '../pages/pictureofsuccess/pictureofsuccess';
import { PictureofsuccessformPage } from '../pages/pictureofsuccessform/pictureofsuccessform';
import { RangingandassortmentPage } from '../pages/rangingandassortment/rangingandassortment';
import { PosViewImagePage } from '../pages/pos-view-image/pos-view-image';
import { RangassproductlistPage } from '../pages/rangassproductlist/rangassproductlist';
import { RangingandassortmentfillPage } from '../pages/rangingandassortmentfill/rangingandassortmentfill';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
 
import { MyApp } from './app.component';
 
@NgModule({
  declarations: [
	MyApp,
	HomePage,
	CalldayselectPage,
	CallsPage,
	StorecallPage,
	ObjectivesPage,
	AddobjectivePage,
	StrikeratePage,
	SurveysPage,
	SurveyformPage,
	PictureofsuccessPage,
	PictureofsuccessformPage,
	PosViewImagePage,
	RangingandassortmentPage,
	RangingandassortmentfillPage,
	RangassproductlistPage,
  ],
  imports: [
	BrowserModule,
	HttpModule,
	IonicStorageModule.forRoot(),
	IonicModule.forRoot(MyApp, {
	  tabsPlacement: 'bottom',
	  platforms: {
		ios: {
			statusbarPadding: true
		}
	  }
	})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
	MyApp,
	HomePage,
	CalldayselectPage,
	CallsPage,
	StorecallPage,
	ObjectivesPage,
	AddobjectivePage,
	StrikeratePage,
	SurveysPage,
	SurveyformPage,
	PictureofsuccessPage,
	PictureofsuccessformPage,
	PosViewImagePage,
	RangingandassortmentPage,
	RangingandassortmentfillPage,
	RangassproductlistPage,
  ],
  providers: [
	StatusBar,
	Geolocation,
	SplashScreen,
	{provide: ErrorHandler, useClass: IonicErrorHandler},
	AuthService,
	File,
	Transfer,
	Camera,
	FilePath,
  ]
})
export class AppModule {}