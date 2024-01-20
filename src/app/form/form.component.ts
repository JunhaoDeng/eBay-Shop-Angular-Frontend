import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl, NgForm } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  @ViewChild('f') productForm!: NgForm;
  searchResult: any;
  submitted = false;
  searchResultNotFound = false;
  wishActive: boolean = false;
  bar: boolean = false;
  zips: string[] = [];
  zipControl = new FormControl(''); // 此属性用于存储用户输入的值。
  zipcodeOptions = ['90001', '90002', '90003', '90004', '90005'];
  filteredZipcodeOptions: string[] = [];
  ngOnInit() {
    this.setCurrentLocation();
    // this.filteredZipcodeOptions = this.zipcodeOptions;
    this.filteredZipcodeOptions = this.zips;
    // this.get_zipData(this);
  }

  async onZipChange() {
    await this.get_zipData(this.model.zip);
    this.filterZipcodeOptions();
  }

  filterZipcodeOptions() {
    if (!this.model.zip || this.model.zip === '') {
      // If the input is empty, show all options.
      // this.filteredZipcodeOptions = this.zipcodeOptions;
      this.filteredZipcodeOptions = [];
    } else {
      // Filter the options based on the input.
      // this.filteredZipcodeOptions = this.zipcodeOptions.filter((zipcode) =>
      //   zipcode.startsWith(this.model.zip)
      // );
      this.filteredZipcodeOptions = this.zips.filter((zipcode) =>
        zipcode.startsWith(this.model.zip)
      );
    }
  }

  model = {
    keyword: '',
    category: '-1',
    new: false,
    used: false,
    unspecified: false,
    local: false,
    free: false,
    distance: 10,
    // current: true,
    // other: false,
    fromLocation: 'current',
    zip: '',
    myzip: '',
    buyerPostalCode: '',
  };

  constructor(private httpClient: HttpClient) {}

  onFromLocationChange() {
    if (this.model.fromLocation === 'current') {
      this.setCurrentLocation();
    }
  }

  setCurrentLocation() {
    this.httpClient
      .get('https://ipinfo.io/76.87.49.220?token=2d803fdf8cd403')
      .subscribe((data) => {
        this.model.myzip = (data as any).postal;
        this.model.buyerPostalCode = this.model.myzip; //要改
        console.log(data);
        // console.log(this.model.zip);
      });
  }

  // zips = {
  //   postalCodes: [], // 此属性用于存储自动完成数据。这里我只是初始化为空数组，但实际上您可能需要从某个API或其他数据源获取数据。
  // };

  async get_zipData(curr: any) {
    const url = `https://ebayexpressbackend-233.wl.r.appspot.com/getAPIResponse?curr=${curr}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Assuming 'data' is the object that contains the 'postalCodes' array
      // Map the 'postalCodes' array to get an array of 'postalCode' values
      this.zips = data.postalCodes.map((item: any) => item.postalCode);
      console.log(this.zips);
    } catch (error) {
      console.error('Error fetching zip data:', error);
    }
  }

  setZip(option: any) {
    // 此函数应该处理用户选择的自动完成选项。
    // 例如，您可以设置model.zip属性或执行其他逻辑。
    this.model.zip = option.postalCode;
  }

  onSubmit(event: Event) {
    event.preventDefault(); // This will prevent the default form submission behavior.
    this.searchResultNotFound = false;
    // Here, you call the function that performs the fetch operation
    this.search();
  }

  async search() {
    localStorage.removeItem('selectedItemId');
    localStorage.removeItem('selectedItemIdForWishList');
    if (this.model.fromLocation === 'other') {
      this.model.buyerPostalCode = this.model.zip;
    }
    if (this.model.fromLocation === 'current') {
      this.model.buyerPostalCode = this.model.myzip;
    }
    const url =
      'https://ebayexpressbackend-233.wl.r.appspot.com/getProductSearchResult';
    // const url = '/getProductSearchResult';
    const queryParamsObject = {
      ...this.model,
      new: this.model.new.toString(),
      used: this.model.used.toString(),
      unspecified: this.model.unspecified.toString(),
      local: this.model.local.toString(),
      free: this.model.free.toString(),
      distance: this.model.distance.toString(),
      // ... convert other non-string properties similarly
    };
    const queryParams = new URLSearchParams(queryParamsObject).toString();

    fetch(`${url}?${queryParams}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.searchResult = data;
        if (
          this.searchResult == undefined ||
          this.searchResult == null ||
          this.searchResult.length === 0
        ) {
          this.searchResultNotFound = true;
        }
        console.log('searchResult:');
        console.log(this.searchResult);
        // Handle the data as needed
      })
      .catch((error) => {
        console.error(
          'There was a problem with the fetch operation:',
          error.message
        );
      });
    this.submitted = true;
  }

  newForm() {
    this.model = {
      keyword: '',
      category: '-1',
      new: false,
      used: false,
      unspecified: false,
      local: false,
      free: false,
      distance: 10,
      fromLocation: 'current',
      zip: '',
      myzip: this.model.myzip,
      buyerPostalCode: '',
    };
    this.productForm.reset(this.model);
  }

  // 这个函数会清除组件的状态
  clearAll(form: NgForm) {
    localStorage.removeItem('selectedItemId');
    localStorage.removeItem('selectedItemIdForWishList');
    form.resetForm();
    this.searchResult = undefined; // 清除搜索结果
    this.newForm(); // 重置表单
    // console.log(this.model); // 仅用于调试

    // 其他可能的清除逻辑...
    this.productForm.resetForm(this.model);
    this.submitted = false;
    this.searchResultNotFound = false;
    this.searchResult = undefined;
    this.wishActive = false;
  }

  activateWishList() {
    this.wishActive = true;
  }

  deactivateWishList() {
    this.wishActive = false;
  }

  showBar() {
    this.bar = true;
    console.log('bar is');
    console.log(this.bar);

    setTimeout(() => {
      this.bar = false;
      console.log('bar is');
      console.log(this.bar);
    }, 800);
  }

  // ... other methods here ...
}
