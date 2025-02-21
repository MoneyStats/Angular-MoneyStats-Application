import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { AppService } from 'src/assets/core/services/api/app.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { saveAs } from 'file-saver';
import { LOG } from 'src/assets/core/utils/log.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-backup-data',
    templateUrl: './backup-data.component.html',
    styleUrls: ['./backup-data.component.scss'],
    standalone: false
})
export class BackupDataComponent implements OnDestroy {
  backupSubscribe: Subscription = new Subscription();
  restoresubscribe: Subscription = new Subscription();

  @Input('modalId') modalId: string = '';
  walletEntities: Wallet[] = [];

  constructor(
    private appService: AppService,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.backupSubscribe.unsubscribe();
    this.restoresubscribe.unsubscribe();
  }

  backupData() {
    this.appService.backupData().subscribe((data) => {
      LOG.info(data.message!, 'BackupDataComponent');
      this.walletEntities = data.data;
      let fileName = 'Backup_Moneystats_' + new Date().toISOString();
      this.downloadObjectAsJson(this.walletEntities, fileName);
      SwalService.toastMessage(
        SwalIcon.SUCCESS,
        this.translate.instant('response.backup')
      );
    });
  }

  restoreData(event: any): void {
    let file: File = event.target.files[0];

    //this.wallet.image = this.fileUpload.append(file.name, file, file.name);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.walletEntities = JSON.parse(event.target.result);
        this.appService.restoreData(this.walletEntities).subscribe((data) => {
          LOG.info(data.message!, 'BackupDataComponent');
          SwalService.toastMessage(
            SwalIcon.SUCCESS,
            this.translate.instant('response.restore')
          );
        });
      };

      reader.readAsText(event.target.files[0]);
    }
  }

  downloadObjectAsJson(exportObj: any, exportName: string) {
    const jsonBlob = new Blob([JSON.stringify(exportObj)], {
      type: 'application/json',
    });
    saveAs(jsonBlob, `${exportName}.json`);
  }
}

/**
 * @deprecated
 * @param exportObj
 * @param exportName
 */
function downloadObjectAsJson(exportObj: any, exportName: string) {
  var dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
