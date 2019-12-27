import {MapBox} from './mapBox';
import {Helper} from './helper';

export class User {
    _id: String;
    email: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    cp: string;
    club: string;
    helpers: Helper[];
    mapBoxes: MapBox[];
}
