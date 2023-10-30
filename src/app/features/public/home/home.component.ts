import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable, Subject } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { PaginatedResult } from 'src/app/shared/models/PaginatedResult';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  blogs$?: Observable<PaginatedResult<BlogPost>>;
  paginatedResult?: PaginatedResult<BlogPost>;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private blogPostService: BlogPostService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(page: number = 1, pageSize: number = 5) {
    this.blogs$ = this.blogPostService.getAllBlogPosts(page, pageSize);
    this.blogs$.pipe(takeUntil(this.destroy$)).subscribe((result) => {
      this.paginatedResult = result;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
