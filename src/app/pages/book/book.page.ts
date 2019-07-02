import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


// Models
import { Copy } from '../../models/copy.model';
import { Location } from '../../models/location.model';

// Services
import { LocationsService } from '../../services/locations/locations.service';
import { HelperService } from '../../services/helper/helper.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {

  locationId: string;
  bookId: string;
  book: Copy;
  location: Location;
  canEdit: Boolean = false;
  state: string;
  comment: string;
  offer: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private locationsService: LocationsService,
    private helperService: HelperService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.bookId = this.activatedRoute.snapshot.paramMap.get('bookId');
    this.locationId = this.activatedRoute.snapshot.paramMap.get('locationId');
    this.locationsService.getUserLocation(this.locationId).subscribe(result => {
      this.location = result;
      //TODO: Test this selection!
      this.book = this.location.data.bookArray.find(x => x.id === this.bookId);
    })
    this.auth.user$.subscribe(result => {
      if (result) {
        if (result.uid === this.locationId) {
          this.canEdit = true;
        }
      }
    })
  }

  updateBook() {    
    const helper = this.helperService;    
    const index: number = this.location.data.bookArray.findIndex(x => x.id === this.bookId)
    this.location.data.bookArray[index] = this.book;
    this.locationsService.updateLocation(this.location.data)
      .then(function (result) {
        helper.showToast('Deine Änderungen wurden gespeichert.');
      })
      .catch(function (err) {
        helper.showToast('Beim Verarbeiten der Änderungen ist ein Fehler aufgetreten.');
        console.log(err)
      })
  }

  deleteBook() {    
    const helper = this.helperService;    
    const index: number = this.location.data.bookArray.findIndex(x => x.id === this.bookId)
    this.location.data.bookArray.splice(index, 1);
    this.locationsService.updateLocation(this.location.data)
      .then(function (result) {
        helper.showToast('Das Buch wurde gelöscht.');
      })
      .catch(function (err) {
        helper.showToast('Beim Verarbeiten des Löschens ist ein Fehler aufgetreten.');
        console.log(err)
      })
  }

}
