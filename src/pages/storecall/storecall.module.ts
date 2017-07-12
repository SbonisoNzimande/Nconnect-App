import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StorecallPage } from './storecall';

@NgModule({
  declarations: [
    StorecallPage,
  ],
  imports: [
    IonicPageModule.forChild(StorecallPage),
  ],
  exports: [
    StorecallPage
  ]
})
export class StorecallPageModule {}
