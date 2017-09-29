import { MapBox } from './mapBox';
import { Helper } from './helper';

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    helpers: Helper[];
    mapBoxes: MapBox[];
}
