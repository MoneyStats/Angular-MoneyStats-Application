import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

declare var Splide: any;

@Injectable({
  providedIn: 'root',
})
export class SplideService {
  environment = environment;
  constructor() {}

  activeSplide() {
    activeSplide();
  }
}

function activeSplide() {
  //-----------------------------------------------------------------------
  // Carousel
  // Splide Carousel
  // Full Carousel
  document.querySelectorAll('.carousel-full').forEach((carousel) =>
    new Splide(carousel, {
      perPage: 1,
      rewind: true,
      type: 'loop',
      gap: 0,
      arrows: false,
      pagination: false,
    }).mount()
  );

  // Single Carousel
  document.querySelectorAll('.carousel-single').forEach((carousel) =>
    new Splide(carousel, {
      perPage: 3,
      rewind: true,
      type: 'loop',
      gap: 16,
      padding: 16,
      arrows: false,
      pagination: false,
      breakpoints: {
        768: {
          perPage: 1,
        },
        991: {
          perPage: 2,
        },
      },
    }).mount()
  );

  // Multiple Carousel
  document.querySelectorAll('.carousel-multiple').forEach((carousel) =>
    new Splide(carousel, {
      perPage: 5,
      rewind: true,
      type: 'loop',
      //autoWidth: true,
      gap: 16,
      padding: 16,
      arrows: false,
      pagination: false,
      breakpoints: {
        768: {
          perPage: 2,
        },
        991: {
          perPage: 3,
        },
      },
    }).mount()
  );

  // Small Carousel
  document.querySelectorAll('.carousel-small').forEach((carousel) =>
    new Splide(carousel, {
      perPage: 9,
      rewind: false,
      type: 'loop',
      gap: 16,
      padding: 16,
      arrows: false,
      pagination: false,
      breakpoints: {
        768: {
          perPage: 4,
        },
        991: {
          perPage: 7,
        },
      },
    }).mount()
  );

  // Slider Carousel
  document.querySelectorAll('.carousel-slider').forEach((carousel) =>
    new Splide(carousel, {
      perPage: 1,
      rewind: false,
      type: 'loop',
      gap: 16,
      padding: 16,
      arrows: false,
      pagination: true,
    }).mount()
  );

  // Stories Carousel
  document.querySelectorAll('.story-block').forEach((carousel) =>
    new Splide(carousel, {
      perPage: 16,
      rewind: false,
      type: 'slide',
      gap: 16,
      padding: 16,
      arrows: false,
      pagination: false,
      breakpoints: {
        500: {
          perPage: 4,
        },
        768: {
          perPage: 7,
        },
        1200: {
          perPage: 11,
        },
      },
    }).mount()
  );
  //-----------------------------------------------------------------------
}
