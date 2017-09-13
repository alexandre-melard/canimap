import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';

@Component({
  selector: 'canimap-menu',
  moduleId: module.id.toString(),
  templateUrl: 'menu.component.html'
})

export class MenuComponent implements OnInit {
  model:any = {};
  loading = false;
  returnUrl:string;

  constructor(private route:ActivatedRoute,
              private router:Router,
              private authenticationService:AuthenticationService,
              private alertService:AlertService) {
  }

  ngOnInit() {
  }
}
