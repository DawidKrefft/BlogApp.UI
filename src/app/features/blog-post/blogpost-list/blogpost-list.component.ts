import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogPostService } from './../services/blog-post.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { PaginatedResult } from 'src/app/shared/models/PaginatedResult';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrls: ['./blogpost-list.component.css'],
})
export class BlogpostListComponent implements OnInit, OnDestroy {
  blogPosts$!: Observable<PaginatedResult<BlogPost>>;
  private destroy$ = new Subject<void>();

  constructor(private blogPostService: BlogPostService) {}

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  loadBlogPosts(page: number = 1, pageSize: number = 5) {
    this.blogPosts$ = this.blogPostService
      .getAllBlogPosts(page, pageSize)
      .pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
