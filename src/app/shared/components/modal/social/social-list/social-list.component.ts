import { Component, Input, OnInit } from '@angular/core';
import { Github, User } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/modal.constant';

@Component({
  selector: 'app-social-list',
  templateUrl: './social-list.component.html',
  styleUrls: ['./social-list.component.scss'],
})
export class SocialListComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  @Input('user') user?: User;

  constructor() {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}
}
