import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { HeaderComponent } from '@modules/main/header/header.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,HeaderComponent,
    SettingsRoutingModule,
    FormsModule
  ]
})
export class SettingsModule { }
