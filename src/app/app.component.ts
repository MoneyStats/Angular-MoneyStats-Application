import { Component, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/assets/core/data/class/user.class';
import { UserService } from 'src/assets/core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @Output('user') user?: User = new User();
  constructor(
    private translate: TranslateService,
    private userService: UserService
  ) {
    translate.setDefaultLang('en');
  }
  ngOnInit(): void {
    const user = this.userService.getUser();
    user.subscribe((data) => {
      this.user = data;
      this.userService.user = data;
    });
  }
}
