import {environment} from '../../environments/environment';

interface AuthConfig {
    CLIENT_ID: string;
    CLIENT_DOMAIN: string;
    RESPONSE_TYPE: string;
    AUDIENCE: string;
    REDIRECT: string;
    SCOPE: string;
    LOGO: string;
    PRIMARY_COLOR: string;
}

export const AUTH_CONFIG: AuthConfig = {
    CLIENT_ID: environment.auth.id,
    CLIENT_DOMAIN: 'canimap.eu.auth0.com',
    RESPONSE_TYPE: 'id_token token',
    AUDIENCE: 'https://canimap.eu.auth0.com/api/v2/',
    REDIRECT: environment.auth.redirect,
    SCOPE: 'openid profile email',
    LOGO: 'https://canimap.melard.fr/assets/cropped-logo-180x180.png',
    PRIMARY_COLOR: 'orange'
};

export const SETTINGS = {
    VERSION: 'v5.3.3',
    TRACK: {
        FREQUENCY: 5,
        COLOR: '#00F'
    }
};
