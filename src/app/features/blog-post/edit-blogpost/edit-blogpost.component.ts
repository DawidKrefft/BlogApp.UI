import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';
import { PaginatedResult } from 'src/app/shared/models/PaginatedResult';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css'],
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  id: string | null = null;
  model?: BlogPost;
  categories$: Observable<PaginatedResult<Category>> | null = null;
  selectedCategories?: string[];
  isImageSelectorVisible = false;

  routeSubscription?: Subscription;
  updateBlogPostSubscription?: Subscription;
  getBlogPostSubscription?: Subscription;
  deleteBlogPostSubscription?: Subscription;
  imageSelectSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private categoryService: CategoryService,
    private router: Router,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.routeSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');

        if (this.id) {
          this.getBlogPostSubscription = this.blogPostService
            .getBlogPostById(this.id)
            .subscribe({
              next: (response) => {
                this.model = response;
                this.selectedCategories = response.categories.map((x) => x.id);
              },
            });
        }

        this.imageSelectSubscription = this.imageService
          .onSelectImage()
          .subscribe({
            next: (response) => {
              if (this.model) {
                this.model.featuredImageUrl = response.url;
                this.isImageSelectorVisible = false;
              }
            },
          });
      },
    });
  }

  onFormSubmit(): void {
    if (this.model && this.id) {
      const updateBlogPost: UpdateBlogPost = {
        author: this.model.author,
        content: this.model.content,
        shortDescription: this.model.shortDescription,
        featuredImageUrl: this.model.featuredImageUrl,
        isVisible: this.model.isVisible,
        publishedDate: this.model.publishedDate,
        title: this.model.title,
        urlHandle: this.model.urlHandle,
        categories: this.selectedCategories ?? [],
      };

      this.updateBlogPostSubscription = this.blogPostService
        .updateBlogPost(this.id, updateBlogPost)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/blogposts');
          },
        });
    }
  }

  onDelete(): void {
    if (this.id) {
      this.deleteBlogPostSubscription = this.blogPostService
        .deleteBlogPost(this.id)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/blogposts');
          },
        });
    }
  }

  isSelected(categoryId: string): boolean {
    return !!this.selectedCategories?.includes(categoryId);
  }

  onCategorySelectionChange(event: boolean, categoryId: string) {
    if (event) {
      if (this.selectedCategories) {
        this.selectedCategories.push(categoryId);
      } else {
        this.selectedCategories = [categoryId];
      }
    } else {
      if (this.selectedCategories) {
        const index = this.selectedCategories.indexOf(categoryId);
        if (index > -1) {
          this.selectedCategories.splice(index, 1);
        }
      }
    }
  }

  loadCategories(page: number = 1, pageSize: number = 50) {
    this.categories$ = this.categoryService.getAllCategories(page, pageSize);
  }

  openImageSelector(): void {
    this.isImageSelectorVisible = true;
  }

  closeImageSelector(): void {
    this.isImageSelectorVisible = false;
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.deleteBlogPostSubscription?.unsubscribe();
    this.imageSelectSubscription?.unsubscribe();
  }
}
