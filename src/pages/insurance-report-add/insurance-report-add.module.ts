import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InsuranceReportAddPage } from './insurance-report-add';

@NgModule({
  declarations: [
    InsuranceReportAddPage,
  ],
  imports: [
    IonicPageModule.forChild(InsuranceReportAddPage),
  ],
})
export class InsuranceReportAddPageModule {}
