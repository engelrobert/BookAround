import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';

// Services:
import { AuthService } from '../../services/auth/auth.service';
import { LocationsService } from '../../services/locations/locations.service';
import { HelperService } from 'src/app/services/helper/helper.service';

// Models:
import { User } from '../../models/user.model'

@Component({
  selector: 'app-add-user-location',
  templateUrl: './add-user-location.page.html',
  styleUrls: ['./add-user-location.page.scss'],
})
export class AddUserLocationPage implements OnInit {
  lat: number;
  lng: number;
  user: User;

  constructor(
    public auth: AuthService,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    public locationsService: LocationsService,
    public helperService: HelperService,
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(result => {
      this.user = result;
    })
  }



  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
    else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  resetLocation() {
    this.lat = null;
    this.lng = null;
  }

  updateUserLocation() {
    this.user.lat = this.lat;
    this.user.lng = this.lng;
    const helper = this.helperService;
    this.auth.updateUser(this.user)
      .then(function (result) {
        helper.showToast('Der Standort wurde zu deinem Profil hinzugefügt');
      })
      .catch(function (err) {
        helper.showToast('Beim Hinzufügen des Standorts ist ein Fehler aufgetreten.');
        console.log(err)
      }).finally(() => {
        this.dismiss();
      })
  }

  async presentAdressPrompt() {
    const alert = await this.alertController.create({
      header: 'Adresssuche',
      inputs: [
        {
          name: 'address',
          type: 'text',
          placeholder: 'Gebe die Adressdaten ein'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => { //takes the data 
            console.log(alertData.address);
            this.searchAddress(alertData.address);
          }
        }
      ]
    });
    await alert.present();
  }

  searchAddress(adress) {
    this.locationsService.searchAddress(adress).subscribe(result => {
      let data: any = result;
      if (data.results.length) {
        this.lat = data.results[0].geometry.location.lat;
        this.lng = data.results[0].geometry.location.lng;
      }
    })
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
