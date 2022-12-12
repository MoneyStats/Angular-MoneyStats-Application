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

  goToDashboard() {
    this.resetAllBtn();
    const dashboard = document.getElementById('dashboard');
    dashboard!.classList.add('active');
  }

  goToWallet() {
    this.resetAllBtn();
    const wallet = document.getElementById('wallet');
    wallet!.classList.add('active');
  }

  resetAllBtn() {
    const dashboard = document.getElementById('dashboard');
    dashboard!.classList.remove('active');

    const wallet = document.getElementById('wallet');
    wallet!.classList.remove('active');
  }
}
