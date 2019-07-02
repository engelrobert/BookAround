import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Models:
import { Location } from '../../models/location.model';

// Services:
import { LocationsService } from '../../services/locations/locations.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  locationId: string;
  location: Location;

  constructor(
    private activatedRoute: ActivatedRoute,
    private locationsService: LocationsService
  ) { }

  ngOnInit() {
    this.locationId = this.activatedRoute.snapshot.paramMap.get('locationId');
    if (this.locationId) {
      this.locationsService.getUserLocation(this.locationId).subscribe(result => {
        this.location = result;
      })
    }

  }

}
