import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { HeaderComponent } from '@modules/main/header/header.component';


@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,HeaderComponent,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
