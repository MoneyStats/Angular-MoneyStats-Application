import { Component, Input, OnInit } from '@angular/core';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-version',
    templateUrl: './version.component.html',
    styleUrls: ['./version.component.scss'],
    standalone: false
})
export class VersionComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  environment = environment;

  constructor() {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}
}
