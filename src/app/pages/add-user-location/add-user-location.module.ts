import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AgmCoreModule } from '@agm/core';

import { AddUserLocationPage } from './add-user-location.page';

const routes: Routes = [
  {
    path: '',
    component: AddUserLocationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCgC1hqe1DjyopCYJb56hLoVoU5ABaKhWg'
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [AddUserLocationPage]
})
export class AddUserLocationPageModule {}
