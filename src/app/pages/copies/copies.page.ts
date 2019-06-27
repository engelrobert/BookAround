import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';


// Modals and Pages:
import { AddBookScannerPage } from '../add-book-scanner/add-book-scanner.page';
import { AddBookSearchPage } from '../add-book-search/add-book-search.page';
import { AddUserLocationPage } from '../add-user-location/add-user-location.page';

// Models:
import { Copy } from '../../models/copy.model';
import { Locationdata } from '../../models/locationdata.model';

// Services:
import { LocationsService } from '../../services/locations/locations.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-copies',
  templateUrl: './copies.page.html',
  styleUrls: ['./copies.page.scss'],
})
export class CopiesPage implements OnInit {
  bookArray: Array<Copy>;
  data: Locationdata = { userName: '', bookArray: [] };
  locationIsKnown: Boolean = false;
  userId: string;

  constructor(
    public modalController: ModalController,
    public locationService: LocationsService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.auth.user$.subscribe(result => {
      if (result) {
        this.userId = result.uid;
        if (result.lat) {
          this.locationIsKnown = true;
        }
      }
      this.locationService.getLocationChanges().subscribe(result => {
        console.log(result);
        if (result) {
          this.data = result.data;
          console.log(this.data.bookArray);
        } else {
          this.data = { userName: '', bookArray: [] };
          console.log(this.data.bookArray);
        }
      });
    })
  }

  async presentAddUserLocation() {
    const modal = await this.modalController.create({
      component: AddUserLocationPage
    });
    return await modal.present();
  }

  async presentAddByIsbnModal() {
    const modal = await this.modalController.create({
      component: AddBookSearchPage
    });
    return await modal.present();
  }

  async presentAddByScannerModal() {
    const modal = await this.modalController.create({
      component: AddBookScannerPage
    });
    return await modal.present();
  }

}
