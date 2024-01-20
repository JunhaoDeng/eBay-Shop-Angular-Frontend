import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css'],
})
export class PhotosComponent {
  @Input() productPhotos: any;
  // productPhotosArray: any[] = [];
  // ngOnInit() {
  //   this.productPhotosArray = this.productPhotos.items;
  // }
}
