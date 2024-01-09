import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UtilsException } from 'src/assets/core/data/class/error';
import { ErrorService } from 'src/assets/core/interceptors/error.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { Location } from '@angular/common';
import { ModalConstant } from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-error-handle',
  templateUrl: './error-handle.component.html',
  styleUrls: ['./error-handle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ErrorHandleComponent implements OnInit {
  exception?: UtilsException;
  showMoreData: boolean = false;

  constructor(
    public screenService: ScreenService,
    private errorService: ErrorService,
    private location: Location
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.exception = this.errorService.exception;
  }

  goBack() {
    this.location.back();
  }

  showDataSwitch() {
    return this.showMoreData
      ? (this.showMoreData = false)
      : (this.showMoreData = true);
  }
}
