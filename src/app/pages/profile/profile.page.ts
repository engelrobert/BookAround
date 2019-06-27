import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

//Model:
import { User } from '../../models/user.model';

// Modals and Pages:
import { AddUserLocationPage } from '../add-user-location/add-user-location.page';

// Services:
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User;

  constructor(
    public auth: AuthService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(result => {
      this.user = result;
    });

  }

  async presentAddUserLocation() {
    const modal = await this.modalController.create({
      component: AddUserLocationPage
    });
    return await modal.present();
  }

}
