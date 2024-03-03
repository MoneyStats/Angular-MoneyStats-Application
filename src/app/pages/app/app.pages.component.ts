import { Component, OnInit, Output } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import {
  fadeAnimation,
  fadeSlider,
  fader,
  slideUp,
} from 'src/app/shared/animations/route-animations';
import { User } from 'src/assets/core/data/class/user.class';
import { AuthService } from 'src/assets/core/services/api/auth.service';

@Component({
  selector: 'app-pages',
  templateUrl: './app.pages.component.html',
  styleUrls: ['./app.pages.component.scss'],
  animations: [
    // <-- add your animations here
    //fader,
    //slideUp,
    fadeSlider,
  ],
})
export class AppPagesComponent implements OnInit {
  @Output('user') user?: User = new User();

  constructor(
    private userService: AuthService,
    private contexts: ChildrenOutletContexts
  ) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.user = this.userService.user;
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
