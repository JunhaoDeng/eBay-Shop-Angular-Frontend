import { Component, Input, OnInit } from '@angular/core';
// import { Similar } from './similar';

@Component({
  selector: 'app-simillar-products',
  templateUrl: './simillar-products.component.html',
  styleUrls: ['./simillar-products.component.css'],
})
export class SimillarProductsComponent implements OnInit {
  @Input() similarProducts: any;
  data: any; // Replace 'any' with your data type
  firstHalf: any;
  secondHalf: any;
  all: any;
  show: boolean = false;

  constructor() {
    //this.sortedData = this.all.slice();
  }
  model = new Similar('default', 'Ascending');
  ngOnInit() {
    console.log('similar items in similar component are:');
    console.log(this.similarProducts);
    this.all =
      this.similarProducts.getSimilarItemsResponse.itemRecommendations.item;
    this.firstHalf = this.all.slice(0, 5);
    this.secondHalf = this.all.slice(5);
  }

  sortData() {
    if (this.model.selectedCriteria !== 'default') {
      this.all.sort((a: any, b: any) => {
        let valueA;
        let valueB;

        switch (this.model.selectedCriteria) {
          case 'price':
            valueA = parseFloat(a.buyItNowPrice.__value__);
            valueB = parseFloat(b.buyItNowPrice.__value__);
            break;
          case 'ship':
            valueA = parseFloat(a.shippingCost.__value__);
            valueB = parseFloat(b.shippingCost.__value__);
            break;
          case 'days':
            valueA = this.getDaysLeft(a.timeLeft);
            valueB = this.getDaysLeft(b.timeLeft);
            break;
          case 'name':
            valueA = a.title.toLowerCase(); // convert to lowercase for case-insensitive comparison
            valueB = b.title.toLowerCase();
            break;
          default:
            // If we don't have a special case, just use the criteria as a property name
            valueA = a[this.model.selectedCriteria];
            valueB = b[this.model.selectedCriteria];
        }

        // Use localeCompare for string comparison to handle international characters properly
        if (this.model.selectedCriteria === 'name') {
          return this.model.selectedDirection === 'Ascending'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        // Compare for sorting numeric and date values
        if (valueA < valueB) {
          return this.model.selectedDirection === 'Ascending' ? -1 : 1;
        } else if (valueA > valueB) {
          return this.model.selectedDirection === 'Ascending' ? 1 : -1;
        } else {
          return 0;
        }
      });
    }
  }

  onSortChange() {
    this.sortData();
    this.firstHalf = this.all.slice(0, 5);
    this.secondHalf = this.all.slice(5);
  }

  showMore() {
    this.show = true;
  }

  // filterBy(prop: string) {
  //   return this.all.sort((a, b) =>
  //     a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1
  //   );
  // }

  getDaysLeft(timeLeft: string): number {
    const match = timeLeft.match(/P(\d+)D/);
    return match ? parseInt(match[1], 10) : 0;
  }

  hide() {
    this.show = false;
  }
}

export class Similar {
  constructor(
    public selectedCriteria: string,
    public selectedDirection: string
  ) {}
}
