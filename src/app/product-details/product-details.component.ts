import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  private _album: any = [];
  @Input() productDetails: any;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  open(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
    });
  }
}
