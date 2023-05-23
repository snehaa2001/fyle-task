import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SubjectsService } from '../../core/services/subjects.service';
import { Book } from 'src/app/core/models/book-response.model';
import { Router } from '@angular/router';

@Component({
  selector: 'front-end-internship-assignment-trending-subjects',
  templateUrl: './trending-subjects.component.html',
  styleUrls: ['./trending-subjects.component.scss'],
})
export class TrendingSubjectsComponent implements OnInit {

  isLoading: boolean = true;

  subjectName: string = '';

  allBooks: Book[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subjectsService: SubjectsService
  ) {}

  goBack(): void {
    this.router.navigate(['/']);
  }
  getAllBooks() {
    this.isLoading = true; 
    this.subjectsService.getAllBooks(this.subjectName).subscribe(
      (data) => {
        this.allBooks = data?.works;
      },
      (error) => {
        console.log('Error occurred while fetching books:', error);
      },
      () => {
        this.isLoading = false; // Set loading to false after the API call is completed
      }
    );
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.subjectName = params.get('name') || '';
      this.isLoading = true;
      this.getAllBooks();
    });
  }

}
