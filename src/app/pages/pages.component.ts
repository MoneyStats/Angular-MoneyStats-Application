import { Component, OnInit, Output } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { User } from 'src/assets/core/data/class/user.class';
import { StorageConstant } from 'src/assets/core/data/constant/constant';
import { UserService } from 'src/assets/core/services/user.service';
import { fader, slideUp } from '../shared/animations/route-animations';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  animations: [
    // <-- add your animations here
    fader,
    slideUp,
  ],
})
export class PagesComponent implements OnInit {
  @Output('user') user?: User = new User();

  constructor(
    private userService: UserService,
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
