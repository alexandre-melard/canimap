import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-canimap-menu',
  moduleId: module.id.toString(),
  templateUrl: 'menu.component.html'
})

export class MenuComponent implements OnInit {

  get displayMap() {
    return (this.router.url === '/map');
  }

  get isMapVisible() {
    return this.router.url === '/map';
  }

  get isRegisterVisible() {
    return this.router.url === '/register';
  }
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
  }
}
