import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoaderService } from 'src/assets/core/interceptors/loader.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: false,
})
export class LoadingComponent implements OnInit {
  isLoading?: Subject<boolean>;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.isLoading = this.loaderService.isLoading;
  }
}
