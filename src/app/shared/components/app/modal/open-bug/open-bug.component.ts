import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UtilsException } from 'src/assets/core/data/class/error';
import { GithubIssues } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { UserService } from 'src/assets/core/services/user.service';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { SwalService } from 'src/assets/core/utils/swal.service';

@Component({
  selector: 'app-open-bug',
  templateUrl: './open-bug.component.html',
  styleUrls: ['./open-bug.component.scss'],
})
export class OpenBugComponent implements OnDestroy {
  issuesSubscribe: Subscription = new Subscription();

  @Input('modalId') modalId: string = '';
  title: string = '';
  description: string = '';

  constructor(
    private swal: SwalService,
    private userService: UserService,
    private logger: LoggerService,
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
    this.userService.openIssues(githubIssues).subscribe((res) => {
      this.logger.LOG(res.message!, 'SettingsComponent');
      this.swal.toastMessage(
        SwalIcon.SUCCESS,
        this.translate.instant('response.bug')
      );
    });
  }
}
