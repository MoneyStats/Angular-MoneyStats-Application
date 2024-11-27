import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UtilsException } from 'src/assets/core/data/class/error';
import { GithubIssues } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { AppService } from 'src/assets/core/services/api/app.service';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { SwalService } from 'src/assets/core/utils/swal.service';

@Component({
    selector: 'app-open-bug',
    templateUrl: './open-bug.component.html',
    styleUrls: ['./open-bug.component.scss'],
    standalone: false
})
export class OpenBugComponent implements OnDestroy {
  issuesSubscribe: Subscription = new Subscription();

  @Input('modalId') modalId: string = '';
  title: string = '';
  description: string = '';

  constructor(
    private appService: AppService,
    private translate: TranslateService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnDestroy(): void {
    this.issuesSubscribe.unsubscribe();
  }

  reportBug() {
    let githubIssues = new GithubIssues();
    githubIssues.title = '[Bug Opened]: ' + this.title;
    githubIssues.assignees = ['giovannilamarmora'];
    githubIssues.labels = ['bug'];

    githubIssues.body =
      this.description +
      '<br><hr>' +
      'Device Datas: <br>' +
      window.navigator.userAgent;
    this.appService.openIssues(githubIssues).subscribe((res) => {
      LOG.info(res.message!, 'SettingsComponent');
      SwalService.toastMessage(
        SwalIcon.SUCCESS,
        this.translate.instant('response.bug')
      );
    });
  }
}
