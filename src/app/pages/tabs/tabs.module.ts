import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs.routing.module';

import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [   
    CommonModule,
    IonicModule,   
    TabsPageRoutingModule
  ],
  declarations: [
    TabsPage,
  ]
})
export class TabsModule { }
