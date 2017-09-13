import { Injectable } from '@angular/core';

@Injectable()
export class HelperEventService {

  callHelper(key: string): boolean {
    return ('true' === localStorage.getItem(key + '_dismissHelp'));
  }

  dismissHelp(key: string) {
    localStorage.setItem(key + '_dismissHelp', 'true');
  }
}
