import { Component, Input, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import * as e from 'express';

export enum Tab {
  PRODUCT,
  PHOTOS,
  SHIPPING,
  SELLER,
  SIMILAR,
}

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [style({ opacity: 0 }), animate(300)]),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class SearchResultComponent implements OnInit {
  @Input() searchResult: any;
  detailActive: boolean = false;
  detailFlag: boolean = false; // Assuming this flag determines whether the details button is disabled
  productDetailSelected: any; // Assuming this variable holds the details of the selected item
  productDetails: any; // Assuming this variable holds the details of the selected item
  productInfo: any; // Assuming this variable holds the details of the selected item
  // resultTable: any; // Assuming searchResult holds the array for this table
  productPhotos: any;
  similarProducts: any;
  p: number = 1; // For pagination
  wishlist: any[] = []; // To store items in the wishlist
  productDetailsDisabled: boolean = false;
  sellerNotFound: boolean = false;
  shipNotFound: boolean = false;
  similarProductsNotFound: boolean = false;
  productPhotosNotFound: boolean = false;
  currentId: any;
  currentPrice: any;
  currentData: any;
  currentPhoto: any;
  productTitle: any;
  bar: boolean = false;
  shareLinkURL: any;
  selectedItemId: string | null = null;

  isPresentMap = new Map<string, boolean>();
  async checkItemsPresence() {
    for (let item of this.searchResult) {
      this.isAbsent(item.itemId).then((isAbsent) => {
        this.isPresentMap.set(item.itemId, !isAbsent);
        console.log(`Item ${item.itemId} is present: ${!isAbsent}`);
      });
    }
  }
  async updateItemPresence(itemId: string): Promise<void> {
    try {
      const isAbsent = await this.isAbsent(itemId);
      this.isPresentMap.set(itemId, !isAbsent);
      console.log(`Updated presence for item ${itemId}: ${!isAbsent}`);
    } catch (error) {
      console.error(`Error updating presence for item ${itemId}:`, error);
    }
    console.log('calling checkItemsPresence()');
  }
  // Call this method when the component loads or when searchResult is updated
  // async checkItemsPresence() {
  //   // Create an array to hold all promises
  //   const presencePromises = this.searchResult.map((item: any) =>
  //     this.isAbsent(item.itemId).then((isAbsent) => ({
  //       itemId: item.itemId,
  //       isPresent: !isAbsent,
  //     }))
  //   );

  //   try {
  //     // Wait for all promises to resolve
  //     const results = await Promise.all(presencePromises);

  //     // Update the presence map with the results
  //     results.forEach((result) => {
  //       this.isPresentMap.set(result.itemId, result.isPresent);
  //     });

  //     console.log('All items have been checked for presence.');

  //     // Here, trigger change detection manually if necessary, for example:
  //     // this.cdRef.detectChanges();
  //   } catch (error) {
  //     console.error('Error checking items presence:', error);
  //   }
  // }

  // productEnabled: boolean = false;
  // photosEnabled: boolean = false;
  // shippingEnabled: boolean = false;
  // sellerEnabled: boolean = false;
  // similarEnabled: boolean = false;
  tabsEnabled: boolean[] = [false, false, false, false, false];
  tabDisplayNames = [
    'Product',
    'Photos',
    'Shipping',
    'Seller',
    'Similar Products',
  ];
  TabEnum = Tab;

  constructor() {}

  ngOnInit() {
    // this.resultTable = this.searchResult; // Assuming searchResult is an array
    // console.log(this.resultTable);
    this.checkItemsPresence();
    this.detailActive = false;
    for (var i = 0; i < 10; i++) {
      console.log('calling ngOnInit()');
    }
    this.selectedItemId = localStorage.getItem('selectedItemId');
    if (this.selectedItemId != null) {
      this.detailFlag = true;
    }
    console.log('selected item id:' + this.selectedItemId);
  }

  getTrimmedTitle(title: string): string {
    if (title.length <= 35) {
      return title;
    }

    // Cut the string to the first 35 characters
    let trimmedTitle = title.substring(0, 35);

    // Find the last index of white space before the cut position
    let lastIndex = trimmedTitle.lastIndexOf(' ');

    // Use the last index of white space as the substring’s end index
    if (lastIndex > 0) {
      trimmedTitle = title.substring(0, lastIndex);
    }

    // Add ellipses ‘...’ to the new string
    return trimmedTitle + '...';
  }

  async enable_details() {
    this.detailActive = true;
    this.make_all_inactive();
    this.tabsEnabled[Tab.PRODUCT] = true;
    if (this.selectedItemId != null) {
      let rowdata = this.findItemById(this.selectedItemId);
      await this.showDetail(this.selectedItemId, rowdata.title, rowdata);
    }
    // await this.showDetail(this.selectedItemId)
  }

  findItemById(id: string): any {
    // Assuming searchResult is an array of items and each item has an itemId property
    const item = this.searchResult.find((item: any) => item.itemId === id);
    return item || null; // Return the found item or null if no item matches the given id
  }

  clearSelection() {
    this.selectedItemId = null;
  }

  async showDetail(itemId: string, title: string, rowData: any) {
    this.selectedItemId = itemId;
    localStorage.setItem('selectedItemId', itemId);
    this.shareLinkURL = rowData.viewItemURL;
    this.showBar();
    this.make_all_inactive();
    this.detailFlag = true;
    this.detailActive = true;
    // this.productDetailSelected = true;
    this.productInfo = rowData;
    this.currentData = rowData;
    this.currentId = itemId;
    this.productTitle = rowData.title;
    try {
      // 构建请求URL并获取产品详情
      let url =
        'https://ebayexpressbackend-233.wl.r.appspot.com/getProductDetails?id=' +
        itemId;
      let response = await fetch(url);
      if (!response.ok)
        throw new Error('Network response was not ok for product details');
      let data = await response.json();
      this.productDetails = data;
      console.log('product details are:');
      console.log(this.productDetails);
      if (
        this.productDetails == undefined ||
        this.productDetails == null ||
        this.productDetails.length === 0
      ) {
        this.productDetailsDisabled = true;
        console.log('product details are empty');
      } else {
        console.log('product details are not empty');
        this.productDetailsDisabled = false;
        this.currentPrice = rowData.currentPrice;
        this.currentPhoto = rowData.galleryURL;
        if (
          rowData.sellerInfo == undefined ||
          rowData.sellerInfo == null ||
          rowData.sellerInfo.length === 0
        ) {
          this.sellerNotFound = true;
        } else {
          this.sellerNotFound = false;
          console.log('seller info is:');
        }
        if (
          rowData.shippingInfo == undefined ||
          rowData.shippingInfo == null ||
          rowData.shippingInfo.length === 0
        ) {
          this.shipNotFound = true;
        } else {
          this.shipNotFound = false;
          console.log('shipping info is:');
        }
      }
      // this.productDetailSelected = true;
      this.tabsEnabled[Tab.PRODUCT] = true;
      console.log(data);
      // 在这里处理productDetails

      // 获取产品照片
      url =
        'https://ebayexpressbackend-233.wl.r.appspot.com/getProductPhotos?title=' +
        encodeURIComponent(title);
      response = await fetch(url);
      if (!response.ok)
        throw new Error('Network response was not ok for product photos');
      data = await response.json();
      this.productPhotos = data;
      console.log('photos in result table are:');
      console.log(this.productPhotos);
      if (
        this.productPhotos == undefined ||
        this.productPhotos == null ||
        this.productPhotos.length === 0
      ) {
        this.productPhotosNotFound = true;
      } else {
        this.productPhotosNotFound = false;
      }

      // 在这里处理productPhotos

      // 获取类似商品
      url =
        'https://ebayexpressbackend-233.wl.r.appspot.com/getSimilarItems?id=' +
        itemId;
      response = await fetch(url);
      if (!response.ok)
        throw new Error('Network response was not ok for similar items');
      data = await response.json();
      this.similarProducts = data;
      console.log('similar items are:');
      console.log(this.similarProducts);
      if (
        this.similarProducts == undefined ||
        this.similarProducts == null ||
        this.similarProducts.length === 0
      ) {
        this.similarProductsNotFound = true;
      } else {
        this.similarProductsNotFound = false;
      }
      // 在这里处理similarProducts
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          'There was a problem with the fetch operation:',
          error.message
        );
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  }

  openPhoto(image: any) {
    var win = window.open(image, '_blank');
    if (win) {
      win.focus();
    } else {
      // Handle the error
      console.error('Failed to open the window');
    }
  }

  isAbsent2(itemId: string): boolean {
    if (!localStorage.hasOwnProperty(itemId)) {
      return true;
    } else {
      return false;
    }
  }
  async isAbsent(itemId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://ebayexpressbackend-233.wl.r.appspot.com/mongodb/searchWishList/${encodeURIComponent(
          itemId
        )}`
      );
      const data = await response.json();

      if (response.ok) {
        // Return true if the item is not present
        return !data.isPresent;
      } else {
        console.error('Error searching wish list:', data.error);
        // Depending on the desired behavior, you may want to return true or false here
        // if the search operation itself failed.
        return false;
      }
    } catch (error) {
      console.error('Error during search in wish list:', error);
      // Assuming that if there is an error, the item is considered absent.
      return true;
    }
  }

  isPresent2(itemId: string): boolean {
    if (localStorage.hasOwnProperty(itemId)) {
      return true;
    } else {
      return false;
    }
  }
  // async isPresent(itemId: string): Promise<boolean> {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5038/mongodb/searchWishList/${encodeURIComponent(
  //         itemId
  //       )}`
  //     );
  //     const data = await response.json();

  //     if (response.ok) {
  //       return data.isPresent;
  //     } else {
  //       console.error('Error searching wish list:', data.error);
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error('Error during search in wish list:', error);
  //     return false;
  //   }
  // }

  make_all_inactive() {
    this.tabsEnabled.fill(false);
  }

  activate(i: Tab) {
    this.make_all_inactive();
    this.tabsEnabled[i] = true;
  }

  // isInList(id: any) {
  //   if (
  //     localStorage.getItem(id) != undefined &&
  //     localStorage.getItem(id) != '' &&
  //     localStorage.getItem(id) != null
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  async isInList(id: any): Promise<boolean> {
    // Assuming isAbsent(id) checks if the item is present in the wishlist
    // and returns a Promise<boolean> where true means the item is absent.
    return !(await this.isAbsent(id));
  }

  // addTowish(rowdata: any) {
  //   localStorage.setItem(rowdata.itemId, JSON.stringify(rowdata));
  //   console.log('added');
  //   for (var i = 0; i < localStorage.length; i++) {
  //     const key = localStorage.key(i);
  //     if (key !== null) {
  //       console.log(localStorage.getItem(key));
  //     }
  //   }
  //   //console.log(localStorage);
  // }

  async addTowish(rowdata: any) {
    // localStorage.setItem(rowdata.itemId, JSON.stringify(rowdata));
    const queryParams = new URLSearchParams(rowdata).toString();
    try {
      const response = await fetch(
        `https://ebayexpressbackend-233.wl.r.appspot.com/mongodb/addWishList?${queryParams}`,
        {
          method: 'GET', // Now a GET request
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        console.log('Added to wish list:', await response.json());
      } else {
        console.error('Failed to add to wish list:', response.status);
      }
    } catch (error) {
      console.error('Error during add to wish list:', error);
    }
    this.updateItemPresence(rowdata.itemId);
  }

  // removeFromWish(rowdata: any) {
  //   localStorage.removeItem(rowdata.itemId);
  //   console.log('removed');
  //   for (var i = 0; i < localStorage.length; i++) {
  //     const key = localStorage.key(i);
  //     if (key !== null) {
  //       console.log(localStorage.getItem(key));
  //     }
  //   }
  // }
  async removeFromWish(rowdata: any) {
    // localStorage.removeItem(rowdata.itemId);
    try {
      const itemId = encodeURIComponent(rowdata.itemId);
      const response = await fetch(
        `https://ebayexpressbackend-233.wl.r.appspot.com/mongodb/deleteWishList/${itemId}`,
        {
          method: 'GET', // It's better to use the DELETE method for this operation
        }
      );

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log('Removed from wish list:', jsonResponse.message);
      } else {
        const errorResponse = await response.json();
        console.error(
          'Failed to remove from wish list:',
          errorResponse.message
        );
      }
    } catch (error) {
      console.error('Error during remove from wish list:', error);
    }
    this.updateItemPresence(rowdata.itemId);
  }

  enable_list() {
    this.detailActive = false;
  }

  showBar() {
    this.bar = true;
    console.log('bar is');
    console.log(this.bar);

    setTimeout(() => {
      this.bar = false;
      console.log('bar is');
      console.log(this.bar);
    }, 1100);
  }

  // In your component method
  shareLink(url: string, title: string): string {
    const encodedUrl = encodeURIComponent(this.shareLinkURL);
    return `http://www.facebook.com/sharer.php?u=${encodedUrl}`;
  }
  getShareLink(currentPhoto: string, productTitle: string): string {
    return this.shareLink(currentPhoto, productTitle);
  }
}
