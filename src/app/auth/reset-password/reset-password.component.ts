import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { SwalService } from 'src/assets/core/utils/swal.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  password: string = '';
  passwordR: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((t: any) => {
      this.token = t.token;
    });
  }

  validatePassword() {
    let validate = false;
    if (this.password != this.passwordR) {
      validate = true;
    }
    return validate;
  }

  resetPassword() {
    const user = this.userService.resetPassword(this.password, this.token);
    user.subscribe((data) => {
      LOG.info(data.message!, 'ResetPasswordComponent');
      SwalService.toastMessage(SwalIcon.SUCCESS, data.message!);
    });
    this.router.navigate(['auth/login']);
  }
}
