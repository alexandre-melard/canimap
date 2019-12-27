import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import 'hammerjs';

if (environment.production) {
    document.write('<script async src="https://www.googletagmanager.com/gtag/js?id=' + environment.google + '"></script>');
    document.write('<script type="text/javascript">');
    document.write('window.dataLayer = window.dataLayer || [];');
    document.write('function gtag() { dataLayer.push(arguments) };');
    document.write('gtag("js", new Date());');
    document.write('gtag("config", "' + environment.google + '");');
    document.write('</script>');
}

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
