import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkReportAddPage } from './work-report-add';

@NgModule({
  declarations: [
    WorkReportAddPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkReportAddPage),
  ],
})
export class WorkReportAddPageModule {}
