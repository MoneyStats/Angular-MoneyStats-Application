import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss'],
})
export class ChangelogComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  environment = environment;
  changelogs: any[] = [];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.get('modal.version.changelog.data').subscribe((data) => {
      this.changelogs = data.slice().reverse();
    });
  }
}
