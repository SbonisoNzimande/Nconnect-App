import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveyformPage } from './surveyform';

@NgModule({
  declarations: [
    SurveyformPage,
  ],
  imports: [
    IonicPageModule.forChild(SurveyformPage),
  ],
  exports: [
    SurveyformPage
  ]
})
export class SurveyformPageModule {}
