import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoiceReportAddPage } from './invoice-report-add';

@NgModule({
  declarations: [
    InvoiceReportAddPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoiceReportAddPage),
  ],
})
export class InvoiceReportAddPageModule {}
