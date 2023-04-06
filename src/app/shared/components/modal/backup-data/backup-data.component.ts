import { Component, Input, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { AppService } from 'src/assets/core/services/app.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { ToastService } from 'src/assets/core/utils/toast.service';

@Component({
  selector: 'app-backup-data',
  templateUrl: './backup-data.component.html',
  styleUrls: ['./backup-data.component.scss'],
})
export class BackupDataComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  walletEntities: Wallet[] = [];

  constructor(private appService: AppService, private swal: SwalService) {}

  ngOnInit(): void {}

  backupData() {
    this.appService.backupData().subscribe((data) => {
      this.walletEntities = data.data;
      let fileName = 'Backup_Moneystats_' + new Date().toISOString();
      downloadObjectAsJson(this.walletEntities, fileName);
      this.swal.toastMessage(SwalIcon.SUCCESS, data.message!);
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
          this.swal.toastMessage(SwalIcon.SUCCESS, data.message!);
        });
      };

      reader.readAsText(event.target.files[0]);
    }
  }
}

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
