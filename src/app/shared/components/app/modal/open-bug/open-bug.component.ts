import { Component, Input, OnInit } from '@angular/core';
import { UtilsException } from 'src/assets/core/data/class/error';
import { GithubIssues } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { UserService } from 'src/assets/core/services/user.service';
import { SwalService } from 'src/assets/core/utils/swal.service';

@Component({
  selector: 'app-open-bug',
  templateUrl: './open-bug.component.html',
  styleUrls: ['./open-bug.component.scss'],
})
export class OpenBugComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  title: string = '';
  description: string = '';

  constructor(private swal: SwalService, private userService: UserService) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}

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
      this.swal.toastMessage(SwalIcon.SUCCESS, res.message!);
    });
  }
}
