import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Github, User } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { UserService } from 'src/assets/core/services/user.service';

@Component({
  selector: 'app-social-list',
  templateUrl: './social-list.component.html',
  styleUrls: ['./social-list.component.scss'],
})
export class SocialListComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  @Input('user') user?: User;
  @Output('emitDisconnectSocial') emitDisconnectSocial =
    new EventEmitter<User>();

  constructor(private userService: UserService) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    if (this.user === undefined) {
      this.user = this.userService.user;
    }
  }

  disconnect(user: User) {
    this.emitDisconnectSocial.emit(user);
  }
}
