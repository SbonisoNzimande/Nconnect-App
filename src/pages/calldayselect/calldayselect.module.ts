import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalldayselectPage } from './calldayselect';

@NgModule({
  declarations: [
    CalldayselectPage,
  ],
  imports: [
    IonicPageModule.forChild(CalldayselectPage),
  ],
  exports: [
    CalldayselectPage
  ]
})
export class CalldayselectPageModule {}
