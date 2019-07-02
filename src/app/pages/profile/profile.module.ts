import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';

// Import Enviroment 
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
