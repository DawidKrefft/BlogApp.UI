import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { Category } from '../../category/models/category.model';
import { CategoryService } from '../../category/services/category.service';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

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
  categories$?: Observable<Category[]>;
  imageSelectorSubscription?: Subscription;

  constructor(
    private blogPostService: BlogPostService,
    private router: Router,
    private categoryService: CategoryService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

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