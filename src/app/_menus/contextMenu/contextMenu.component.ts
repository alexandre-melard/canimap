import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-canimap-context-menu',
  moduleId: module.id.toString(),
  templateUrl: 'contextMenu.component.html'
})

export class ContextMenuComponent implements OnInit {
  @Input() visible = false;
  @Input() states: {label: string, link: HTMLElement}[];

  constructor() { }

  ngOnInit() {
    const me = this;
    $(document).on( 'mouseup click', () => {
      const actions = $('.leaflet-draw-actions a').filter(':visible').length;
      me.visible = (actions !== 0);
  });
  }

  click(event: any, state: any) {
    const link = $('.leaflet-draw-actions a:visible')[state.id];
    link.click();
    this.visible = !state.end;
  }
}
