import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

import { AuthGuard } from '../../services/guard/guard.service';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: '../home/home.module#HomePageModule'
      },
      {
        path: 'copies',
        loadChildren: '../copies/copies.module#CopiesPageModule'        
      },
      {
        path: 'profile',
        loadChildren: '../profile/profile.module#ProfilePageModule'
      },
      {
        path: 'chats',
        loadChildren: '../chats/chats.module#ChatsPageModule'
      },
      {
        path: 'chat',
        loadChildren: '../chat/chat.module#ChatPageModule'
      },
      {
        path: 'chat/:chatId',
        loadChildren: '../chat/chat.module#ChatPageModule'
      },
      {
        path: 'book',
        loadChildren: '../book/book.module#BookPageModule'
      },
      {
        path: 'book/:locationId/:bookId',
        loadChildren: '../book/book.module#BookPageModule'
      },
      {
        path: 'location',
        loadChildren: '../location/location.module#LocationPageModule'
      },
      {
        path: 'location/:locationId',
        loadChildren: '../location/location.module#LocationPageModule'
      },
      {
        path: 'about',
        loadChildren: '../about/about.module#AboutPageModule'
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }