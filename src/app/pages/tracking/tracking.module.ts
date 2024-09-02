import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingRoutingModule } from './tracking-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TrackingRoutingModule,
    CalendarModule,
    FormsModule,TableModule
  ]
})
export class TrackingModule { }
