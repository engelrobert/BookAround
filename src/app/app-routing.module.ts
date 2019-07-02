import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app/tabs',
    pathMatch: 'full'
  },
  {
    path: 'app',
    redirectTo: 'app/tabs',
    pathMatch: 'full'
  },
  {
    path: 'app',
    loadChildren: './pages/tabs/tabs.module#TabsModule',
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule',
  },
  { path: 'add-user-location', loadChildren: './pages/add-user-location/add-user-location.module#AddUserLocationPageModule' },
  { path: 'book', loadChildren: './pages/book/book.module#BookPageModule' },
  { path: 'location', loadChildren: './pages/location/location.module#LocationPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
