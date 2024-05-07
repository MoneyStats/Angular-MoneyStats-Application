import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegEx } from 'src/assets/core/data/constant/constant';
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

  public EMPTY: string = '';

  isPasswordShow: boolean = false;

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

  validateRegexPassword() {
    const regex: RegExp = new RegExp(RegEx.PASSWORD_FULL);
    // Se la password è vuota non mostro l'errore
    return this.password != this.EMPTY ? regex.test(this.password) : true;
  }

  checkIfPasswordMatch() {
    return this.password != this.EMPTY && this.passwordR != this.EMPTY
      ? this.password === this.passwordR
      : true;
  }

  resetPassword() {
    const user = this.userService.resetPassword(this.password, this.token);
    user.subscribe((data) => {
      LOG.info(data.message!, 'ResetPasswordComponent');
      SwalService.toastMessage(SwalIcon.SUCCESS, data.message!);
    });
    this.router.navigate(['auth/login']);
  }

  hideShowPassword() {
    this.isPasswordShow
      ? (this.isPasswordShow = false)
      : (this.isPasswordShow = true);
  }
}
