import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

// Models:
import { Location } from '../../models/location.model';

// Pages & Modals
import { AddUserLocationPage } from '../add-user-location/add-user-location.page';

// Services:
import { AuthService } from '../../services/auth/auth.service';
import { LocationsService } from '../../services/locations/locations.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  lat: number = 51.678418;
  lng: number = 7.809007;
  locationIsKnown: Boolean = false;
  name: string;
  locationsArray: Array<any> = [];
  radius: any;  

  constructor(
    public auth: AuthService,
    public locationsService: LocationsService,
    public modalController: ModalController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(result => {
      if (result) {
        if (result.lat) {
          this.lat = result.lat;
          this.lng = result.lng;
          this.locationIsKnown = true;
          this.name = result.displayName;
        }
      }
      this.searchBooksforLocation();
    })
    this.radius = "1";    
  }

  async presentAddUserLocation() {
    const modal = await this.modalController.create({
      component: AddUserLocationPage
    });
    return await modal.present();
  }

  searchBooksforLocation() {
    this.locationsService.queryLocation(this.lat, this.lng, this.radius).subscribe(result => {     
      this.locationsArray = result;
    })
  }

  onRadiusChange(newListId) {    
    this.searchBooksforLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.searchBooksforLocation();
      });
    }
    else {
      console.log("Geolocation is not supported by this browser.");
    }
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
        this.searchBooksforLocation();
      }
    })
  }

}
