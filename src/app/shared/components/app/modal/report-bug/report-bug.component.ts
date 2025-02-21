import { Component, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UtilsException } from 'src/assets/core/data/class/error';
import { GithubIssues } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { AppService } from 'src/assets/core/services/api/app.service';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { SwalService } from 'src/assets/core/utils/swal.service';

@Component({
  selector: 'app-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss'],
  standalone: false,
})
export class ReportBugComponent implements OnDestroy {
  bugSubscribe: Subscription = new Subscription();

  @Input('modalId') modalId: string = '';
  @Input('exception') exception?: UtilsException;
  description: string = '';

  constructor(
    private appService: AppService,
    private translate: TranslateService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnDestroy(): void {
    this.bugSubscribe.unsubscribe();
  }

  reportBug() {
    let githubIssues = new GithubIssues();
    githubIssues.title =
      '[' +
      this.exception?.error?.errorCode +
      ']: ' +
      this.exception?.error?.exception;
    githubIssues.assignees = ['giovannilamarmora'];
    githubIssues.labels = ['bug'];

    this.appService.getTemplate().subscribe((t) => {
      let template = t.template
        .replace('$DATETIME$', this.exception!.dateTime!.toString())
        .replace('$URL$', this.exception!.url!)
        .replace('$EXCEPTION_CODE$', this.exception?.error?.errorCode)
        .replace('$STATUS$', this.exception?.error?.statusCode!)
        .replace('$MESSAGE$', this.exception?.error?.message!)
        .replace(
          '$BODY$',
          JSON.stringify(this.exception)
            .replace(',', ',<br>')
            .replace('{', '{<br>')
            .replace('}', '}<br>')
        )
        .replace(
          '$DESCRIPTION$',
          this.description +
            (this.exception?.error?.stackTrace
              ? '<hr> <h1>Stacktrace:</h1> <pre>' +
                this.exception.error.stackTrace +
                '</pre>'
              : '') +
            '<hr>' +
            '<h2>Device Information:</h2>' +
            this.getDeviceInfo()
        );
      githubIssues.body = template;

      this.appService.openIssues(githubIssues).subscribe((res) => {
        LOG.info(res.message!, 'SettingsComponent');
        SwalService.toastMessage(
          SwalIcon.SUCCESS,
          this.translate.instant('response.bug')
        );
      });
    });
  }

  private getDeviceInfo(): string {
    const os = this.getOperatingSystem();
    const browser = Utils.getBrowserVersion(window.navigator.userAgent);
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const deviceInfo = `
      <table style="width:100%">
        <tr><th>Operating System</th><td>${os}</td></tr>
        <tr><th>Browser</th><td>${browser}</td></tr>
        <tr><th>Screen Resolution</th><td>${screenResolution}</td></tr>
      </table>
    `;
    return deviceInfo;
  }

  private getOperatingSystem(): string {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes('Windows NT')) return 'Windows';
    if (userAgent.includes('Mac OS X')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad'))
      return 'iOS';
    return 'Unknown';
  }
}
