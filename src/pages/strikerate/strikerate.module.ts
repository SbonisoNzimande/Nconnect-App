import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StrikeratePage } from './strikerate';

@NgModule({
  declarations: [
    StrikeratePage,
  ],
  imports: [
    IonicPageModule.forChild(StrikeratePage),
  ],
  exports: [
    StrikeratePage
  ]
})
export class StrikeratePageModule {}
