import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css'],
})
export class ShippingComponent implements OnInit {
  @Input() shippingDetails: any;

  // Define properties to hold the extracted information
  shippingServiceCost: string = '';
  shipToLocation: string = '';
  handlingTime: string = '';
  expeditedShipping: string = '';
  isExpeditedShipping: boolean = false;
  oneDayShippingAvailable: string = '';
  isOneDayShippingAvailable: boolean = false;
  returnsAccepted: string = '';
  isReturnsAccepted: boolean = false;

  ngOnInit(): void {
    if (this.shippingDetails) {
      // Extract and assign the information to the properties
      this.shippingServiceCost =
        this.shippingDetails.shippingInfo.shippingServiceCost[0].__value__;
      if (this.shippingServiceCost === '0.0') {
        this.shippingServiceCost = 'Free Shipping';
      } else {
        this.shippingServiceCost =
          '$' + this.shippingServiceCost + ' for shipping';
      }
      this.shipToLocation =
        this.shippingDetails.shippingInfo.shipToLocations[0];
      this.handlingTime = this.shippingDetails.shippingInfo.handlingTime[0];
      if (this.handlingTime === '1' || this.handlingTime === '0') {
        this.handlingTime = this.handlingTime + ' day';
      } else {
        this.handlingTime = this.handlingTime + ' days';
      }

      this.expeditedShipping =
        this.shippingDetails.shippingInfo.expeditedShipping[0];
      if (this.expeditedShipping === 'true') {
        this.isExpeditedShipping = true;
      }
      this.oneDayShippingAvailable =
        this.shippingDetails.shippingInfo.oneDayShippingAvailable[0];
      if (this.oneDayShippingAvailable === 'true') {
        this.isOneDayShippingAvailable = true;
      }
      this.returnsAccepted = this.shippingDetails.returnsAccepted;
      if (this.returnsAccepted === 'true') {
        this.isReturnsAccepted = true;
      }
    }
    console.log(
      this.isExpeditedShipping,
      this.isOneDayShippingAvailable,
      this.isReturnsAccepted
    );
  }
}
