import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { MapService } from '../_services/map.service';

@Component({
  selector: 'app-canimap-map',
  templateUrl: './canimap.component.html',
  styleUrls: ['./canimap.component.css']
})
export class CanimapComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.userService.currentUser()
      .subscribe(user => {
        if (user) {
          this.mapService.setMapFromUserPreferences().subscribe(() => this.mapService.loadMap());
        } else {
          this.router.navigate(['/register']);
        }
      }, () => {
        this.router.navigate(['/register']);
      });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
      return false;
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
      return false;
  }
}
