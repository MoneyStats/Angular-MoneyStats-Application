import { Component, OnInit, Output } from '@angular/core';
import { User } from 'src/assets/core/data/class/user.class';
import { StorageConstant } from 'src/assets/core/data/constant/modal.constant';
import { UserService } from 'src/assets/core/services/user.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  @Output('user') user?: User = new User();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.user;
  }
}
