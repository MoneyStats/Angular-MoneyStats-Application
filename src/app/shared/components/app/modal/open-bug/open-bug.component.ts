import { Component, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { GithubIssues } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { AppService } from 'src/assets/core/services/api/app.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { SwalService } from 'src/assets/core/utils/swal.service';

@Component({
  selector: 'app-open-bug',
  templateUrl: './open-bug.component.html',
  styleUrls: ['./open-bug.component.scss'],
  standalone: false,
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

    // Composizione del corpo del messaggio con informazioni dettagliate
    const deviceInfo = `<h5><strong>Device Information:</strong></h5><table class="table table-bordered"><tbody><tr><th>Operating System</th><td>${
      window.navigator.platform
    }</td></tr><tr><th>Browser</th><td>${
      window.navigator.userAgent
    }</td></tr><tr><th>Browser Version</th><td>${Utils.getBrowserVersion(
      window.navigator.userAgent
    )}</td></tr><tr><th>Screen Resolution</th><td>${window.screen.width}x${
      window.screen.height
    }</td></tr></tbody></table><br><hr><br>`;

    // Dettagli del bug
    githubIssues.body = `<p><strong>Description:</strong></p><p>${this.description}</p><br>${deviceInfo}`;

    this.appService.openIssues(githubIssues).subscribe((res) => {
      LOG.info(res.message!, 'SettingsComponent');
      SwalService.toastMessage(
        SwalIcon.SUCCESS,
        this.translate.instant('response.bug')
      );
    });
  }
}
