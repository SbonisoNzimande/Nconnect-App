import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DayselectpagePage } from './dayselectpage';

@NgModule({
  declarations: [
    DayselectpagePage,
  ],
  imports: [
    IonicPageModule.forChild(DayselectpagePage),
  ],
  exports: [
    DayselectpagePage
  ]
})
export class DayselectpagePageModule {}
