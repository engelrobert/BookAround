import { Geopoint } from './geopoint.model';
import { Locationdata } from './locationdata.model';

export interface Location {
    position: any;
    data: Locationdata;
}