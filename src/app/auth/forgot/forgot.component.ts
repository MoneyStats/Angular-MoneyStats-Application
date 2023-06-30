import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from 'src/assets/core/services/user.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { Router } from '@angular/router';
import { LoggerService } from 'src/assets/core/utils/log.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {
  email: string = '';
  constructor(
    private location: Location,
    private userService: UserService,
    private swal: SwalService,
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  resetPassword() {
    const user = this.userService.forgotPassword(this.email);
    user.subscribe((data) => {
      this.logger.LOG(data.message!, 'ForgotComponent');
      this.swal.toastMessage(SwalIcon.SUCCESS, data.message!);
    });
    this.router.navigate(['auth/login']);
  }
}
