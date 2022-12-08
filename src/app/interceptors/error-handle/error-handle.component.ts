import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-error-handle',
  templateUrl: './error-handle.component.html',
  styleUrls: ['./error-handle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ErrorHandleComponent implements OnInit {
  @Input('title') title?: string;

  constructor(public screenService: ScreenService) {}

  ngOnInit(): void {}
}
