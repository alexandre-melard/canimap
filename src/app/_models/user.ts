import { MapBox } from './mapBox';
import { Helper } from './helper';

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    cp: string;
    club: string;
    helpers: Helper[];
    mapBoxes: MapBox[];
    lastLogin: number;
    token: string;
}
