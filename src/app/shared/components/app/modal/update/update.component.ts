import { Component, Input, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ModalConstant } from 'src/assets/core/data/constant/constant';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss'],
    standalone: false
})
export class UpdateComponent implements OnInit {
  @Input('modalId') modalId: string = '';

  constructor(private readonly updates: SwUpdate) {}
  ngOnInit(): void {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  doAppUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
