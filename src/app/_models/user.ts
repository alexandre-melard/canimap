export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    helpers: {
      key: string;
      visible: boolean;
    }[];
    maps: {
      key: string;
      opacity: number;
      visible: boolean;
    }[];
}
