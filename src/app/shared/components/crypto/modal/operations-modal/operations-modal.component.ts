import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-operations-modal',
  templateUrl: './operations-modal.component.html',
  styleUrls: ['./operations-modal.component.scss']
})
export class OperationsModalComponent implements OnInit {
  @Input('modalId') modalId: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
