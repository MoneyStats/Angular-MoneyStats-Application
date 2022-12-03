import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/assets/core/utils/toast.service';

@Component({
  selector: 'app-available-soon',
  templateUrl: './available-soon.component.html',
  styleUrls: ['./available-soon.component.scss'],
})
export class AvailableSoonComponent implements OnInit {
  constructor(private toast: ToastService) {}

  ngOnInit(): void {}

  closingModal() {
    this.toast.closeToast();
  }
}
