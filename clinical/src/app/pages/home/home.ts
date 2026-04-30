import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  title = "HealthConnect";

  images = [
    'img/portada1.jpeg',
    'img/portada2.jpeg',
    'img/portada3.jpeg',
    'img/portada4.jpeg',
    'img/portada5.jpeg',
    'img/portada6.jpeg',
  ];

  currentSlide = 0;
  private timer: any;

  ngOnInit() {
    this.startAuto();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  startAuto() {
    this.timer = setInterval(() => this.next(), 4000);
  }

  next() {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  prev() {
    this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
  }

  goTo(index: number) {
    this.currentSlide = index;
  }
}