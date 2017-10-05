import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// import { AlertService, AuthenticationService } from '../../_services/index';

@Component({
  selector: 'app-canimap-menu',
  moduleId: module.id.toString(),
  templateUrl: 'menu.component.html'
})

export class MenuComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  
  get displayMap() {
    return (this.router.url === '/map');
  }

  get isMapVisible() {
    return this.router.url === '/map';
  }
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
  }
}
