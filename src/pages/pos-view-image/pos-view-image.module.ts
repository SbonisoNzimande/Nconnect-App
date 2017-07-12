import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PosViewImagePage } from './pos-view-image';

@NgModule({
  declarations: [
    PosViewImagePage,
  ],
  imports: [
    IonicPageModule.forChild(PosViewImagePage),
  ],
  exports: [
    PosViewImagePage
  ]
})
export class PosViewImagePageModule {}
