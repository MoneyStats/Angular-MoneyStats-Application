import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/assets/core/utils/toast.service';

@Component({
    selector: 'app-available-soon',
    templateUrl: './available-soon.component.html',
    styleUrls: ['./available-soon.component.scss'],
    standalone: false
})
export class AvailableSoonComponent {
  closingModal() {
    ToastService.closeToast();
    ToastService.closeUpdateToast();
    ToastService.closeCopiedToast();
  }
}
