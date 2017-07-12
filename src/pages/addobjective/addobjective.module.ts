import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddobjectivePage } from './addobjective';

@NgModule({
  declarations: [
    AddobjectivePage,
  ],
  imports: [
    IonicPageModule.forChild(AddobjectivePage),
  ],
  exports: [
    AddobjectivePage
  ]
})
export class AddobjectivePageModule {}
