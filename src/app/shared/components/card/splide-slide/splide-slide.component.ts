import { Component, Input, OnInit } from '@angular/core';
import { SplideService } from 'src/assets/core/utils/splide.service';

@Component({
  selector: 'app-splide-slide',
  templateUrl: './splide-slide.component.html',
  styleUrls: ['./splide-slide.component.scss'],
})
export class SplideSlideComponent implements OnInit {
  @Input('walletImg') walletImg?: string;
  @Input('walletName') walletName?: string;
  @Input('category') category?: string;
  @Input('btn') btn?: string;

  constructor(private splide: SplideService) {}

  ngOnInit(): void {
    //this.splide.activeSplide();
  }
}
