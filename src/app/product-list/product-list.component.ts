import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(private productsService: ProductsService) { }

  productList: any;
  currentSortCriteria = 'id';
  currentSortIsAsc = true;
  fromDate: any;
  toDate: any;
  fromDateInString: string;
  toDateInString: string;
  apiCallInProgress = false;
  isErrorNoteVisible = false;
  errorNoteText = '';
  selectDateWarning = 'To filter the records, please select from date, to date or both and then apply filters.';
  fromDateGreaterWarning = 'From Date should not be greater than to date.';
  ngOnInit(): void {
    this.getProductList(this.currentSortCriteria, this.currentSortIsAsc);
  }

  getSortIconClass(fieldName) {
    if(this.currentSortCriteria !== fieldName)
    return '';
    return this.currentSortIsAsc ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
  }
  getProductList(sortField, sortDirection) {
    const sortDirInString = sortDirection ? 'asc' : 'desc';
    const apiFilters = {
      sortBy: sortField,
      sortDirAsc: sortDirection,
      fromDate: this.fromDateInString,
      toDate: this.toDateInString,
    };
    if (!apiFilters.fromDate) {
      delete apiFilters.fromDate;
    }
    if (!apiFilters.toDate) {
      delete apiFilters.toDate;
    }
    this.apiCallInProgress = true;
    this.productsService.getProducts(apiFilters)
      .subscribe(
        data => {
          this.apiCallInProgress = false;
          this.productList = data;
          console.log('data in get prodcuts api ', data);
        },
        error => {
          this.apiCallInProgress = false;
          this.productList = [];
          console.log('error in get prodcuts api ', error);
        });
  }
  getDateInString(ngbDateObj) {
    return ngbDateObj ? (ngbDateObj.year + '-' + ngbDateObj.month + '-' + ngbDateObj.day) : '';
  }
  onDateSelect(date) {
    console.log('selected date is ', date);
  }
  isFromDateGreaterThanToDate() {
    if (this.fromDate && this.toDate) {
      return (this.fromDate.year > this.toDate.year) ||
        (this.fromDate.month > this.toDate.month) ||
        (this.fromDate.day > this.toDate.day);
    }
    return false;
  }
  applyFilter() {
    console.log('filters applied are ', this.fromDate, this.toDate);
    if (!this.fromDate && !this.toDate) {
      this.errorNoteText = this.selectDateWarning;
      this.isErrorNoteVisible = true;
      return;
    } else if (this.isFromDateGreaterThanToDate()) {
      this.errorNoteText = this.fromDateGreaterWarning;
      this.isErrorNoteVisible = true;
      return;
    }
    this.isErrorNoteVisible = false;
    this.fromDateInString = this.getDateInString(this.fromDate);
    this.toDateInString = this.getDateInString(this.toDate);
    this.getProductList(this.currentSortCriteria, this.currentSortIsAsc);
  }
  clearFilter() {
    this.errorNoteText = '';
    this.isErrorNoteVisible = false;
    this.fromDate = undefined;
    this.toDate = undefined;
    this.fromDateInString = undefined;
    this.toDateInString = undefined;
    this.getProductList(this.currentSortCriteria, this.currentSortIsAsc);
    console.log('clear applied filters are ', this.fromDate, this.toDate);
  }

  sortData(sortCriteria) {
    if (this.currentSortCriteria !== sortCriteria) {
      this.currentSortCriteria = sortCriteria;
      this.currentSortIsAsc = true;
    } else {
      this.currentSortIsAsc = !this.currentSortIsAsc;
    }
    this.getProductList(this.currentSortCriteria, this.currentSortIsAsc);
  }
}
