import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/assets/core/utils/toast.service';
import { AvailableSoonComponent } from '../../modal/available-soon/available-soon.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(public toast: ToastService) {}

  ngOnInit(): void {}

  availableSoon() {
    this.toast.availableSoon();
  }
}
