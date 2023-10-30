import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { Category } from '../../category/models/category.model';
import { CategoryService } from '../../category/services/category.service';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';
import { PaginatedResult } from 'src/app/shared/models/PaginatedResult';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css'],
})
export class AddBlogpostComponent implements OnInit, OnDestroy {
  model: AddBlogPost = {
    title: '',
    shortDescription: '',
    urlHandle: '',
    content: '',
    featuredImageUrl: '',
    author: '',
    isVisible: true,
    publishedDate: new Date(),
    categories: [],
  };

  isImageSelectorVisible = false;
  categories$: Observable<PaginatedResult<Category>> | null = null; // Initialize to null
  imageSelectorSubscription?: Subscription;

  constructor(
    private blogPostService: BlogPostService,
    private router: Router,
    private categoryService: CategoryService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.loadCategories(); // Load the initial set of categories

    this.imageSelectorSubscription = this.imageService
      .onSelectImage()
      .subscribe({
        next: (selectedImage) => {
          this.model.featuredImageUrl = selectedImage.url;
          this.closeImageSelector();
        },
      });
  }

  onFormSubmit(): void {
    console.log(this.model);
    this.blogPostService.createBlogPost(this.model).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/admin/blogposts');
      },
    });
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
    this.imageSelectorSubscription?.unsubscribe();
  }
}
