import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PictureofsuccessformPage } from './pictureofsuccessform';

@NgModule({
  declarations: [
    PictureofsuccessformPage,
  ],
  imports: [
    IonicPageModule.forChild(PictureofsuccessformPage),
  ],
  exports: [
    PictureofsuccessformPage
  ]
})
export class PictureofsuccessformPageModule {}
