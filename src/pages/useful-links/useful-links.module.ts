import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsefulLinksPage } from './useful-links';

@NgModule({
  declarations: [
    UsefulLinksPage,
  ],
  imports: [
    IonicPageModule.forChild(UsefulLinksPage),
  ],
})
export class UsefulLinksPageModule {}
