import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RangassproductlistPage } from './rangassproductlist';

@NgModule({
  declarations: [
    RangassproductlistPage,
  ],
  imports: [
    IonicPageModule.forChild(RangassproductlistPage),
  ],
  exports: [
    RangassproductlistPage
  ]
})
export class RangassproductlistPageModule {}
