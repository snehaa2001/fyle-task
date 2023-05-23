import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  
})
export class HomeComponent implements OnInit {
  bookSearch: FormControl;
  searchResults: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalResults: number = 0;
  totalPages: number = 0;
  noResultsFound: boolean = false;
  subjectsLoading: boolean = false;
  searchLoading: boolean = false;
  trendingSubjects: any[] = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];

  constructor(private apiService: ApiService) {
    this.bookSearch = new FormControl('');
  }

  ngOnInit(): void {

    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
        filter(value => value.length >= 3) // Filter to trigger search only when at least 3 characters are entered
      )
      .subscribe((value: string) => {
        this.currentPage = 1; // Reset current page when initiating a new search
        this.searchBooks(value);
      });
  }

  searchBooks(searchTerm: string): void {
    this.searchLoading = true;
    this.apiService
      .searchBooks(searchTerm, this.currentPage, this.pageSize)
      .subscribe((response: any) => {
        this.searchResults = response.docs;
        this.totalResults = response.numFound;
        this.totalPages = Math.ceil(this.totalResults / this.pageSize); // Calculate the total number of pages
        this.searchLoading = false;
       
      });
  }

  clearSearch(): void {
    this.bookSearch.reset();
    this.searchResults = [];
    this.totalResults = 0;
    this.totalPages = 0;
    this.noResultsFound = false;
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.searchBooks(this.bookSearch.value);
    }
  }
  getPageNumbers(): number[] {
    const pageNumbers = [];
    const startPage = Math.max(this.currentPage - 2, 1);
    const endPage = Math.min(startPage + 4, this.totalPages);
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  
    return pageNumbers;
  }
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.searchBooks(this.bookSearch.value);
    }
  }
    
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchBooks(this.bookSearch.value);
    }
  }
}