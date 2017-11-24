interface AuthConfig {
    CLIENT_ID: string;
    CLIENT_DOMAIN: string;
    RESPONSE_TYPE: string;
    AUDIENCE: string;
    REDIRECT: string;
    SCOPE: string;
}

export const AUTH_CONFIG: AuthConfig = {
    CLIENT_ID: 'HXGX610IWqnjdjz3EgF0O4qXHuL4ZSbJ',
    CLIENT_DOMAIN: 'canimap.eu.auth0.com',
    RESPONSE_TYPE: 'token id_token',
    AUDIENCE: 'https://canimap.eu.auth0.com/api/v2/',
    REDIRECT: 'http://localhost:4200/callback',
    SCOPE: 'openid email'
};
