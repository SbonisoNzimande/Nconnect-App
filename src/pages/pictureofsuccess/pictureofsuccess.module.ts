import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PictureofsuccessPage } from './pictureofsuccess';

@NgModule({
  declarations: [
    PictureofsuccessPage,
  ],
  imports: [
    IonicPageModule.forChild(PictureofsuccessPage),
  ],
  exports: [
    PictureofsuccessPage
  ]
})
export class PictureofsuccessPageModule {}
