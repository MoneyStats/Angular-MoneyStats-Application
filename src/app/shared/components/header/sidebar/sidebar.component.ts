import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void { }
  
  closeModal() {
    this.activeModal.close('Modal Closed');
  }
}
