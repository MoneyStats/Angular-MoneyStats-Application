import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UtilsException } from 'src/assets/core/data/class/error';
import { ErrorService } from 'src/assets/core/interceptors/error.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error-handle',
  templateUrl: './error-handle.component.html',
  styleUrls: ['./error-handle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ErrorHandleComponent implements OnInit {
  @Input('statusCode') statusCode?: string;
  @Input('exceptionCode') exceptionCode?: any;
  @Input('exceptionError') exceptionError?: string;
  @Input('message') message?: string;
  @Input('exceptionMessage') exceptionMessage?: string;
  exception?: UtilsException;

  constructor(
    public screenService: ScreenService,
    private errorService: ErrorService,
    private location: Location
  ) {}

  ngOnInit(): void {
    //this.screenService.setupHeader();
    //this.screenService.hideFooter();
    this.exception = this.errorService.exception;
  }

  goBack() {
    this.location.back();
  }
}
