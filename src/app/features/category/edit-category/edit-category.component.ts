import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { UpdateCategoryRequest } from './../models/update-category-request.model';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css'],
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  id: string | null = null;
  paramsSubscription?: Subscription;
  editCategorySubscription?: Subscription;
  category?: Category;
  validationErrors: string[] = [];
  validationErrorsName: string = '';
  validationErrorsUrlHandle: string = '';

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');

        if (this.id) {
          // get the data from the API for this category Id
          this.categoryService.getCategoryById(this.id).subscribe({
            next: (response) => {
              this.category = response;
            },
          });
        }
      },
    });
  }

  onFormSubmit(): void {
    const UpdateCategoryRequest: UpdateCategoryRequest = {
      name: this.category?.name ?? '',
      urlHandle: this.category?.urlHandle ?? '',
    };

    // pass this object to service
    if (this.id) {
      this.editCategorySubscription = this.categoryService
        .updateCategory(this.id, UpdateCategoryRequest)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/categories');
          },
          error: (error: any) => {
            if (error.status === 500) {
              // Handle validation errors
              if (error.error.detail) {
                const errorDetail = error.error.detail;

                // Check if error message for "Name"
                if (errorDetail.includes('Name')) {
                  this.validationErrorsName =
                    'Name: ' + this.extractErrorMessage(errorDetail, 'Name');
                } else {
                  this.validationErrorsName = '';
                }

                // Check if error message for "URL Handle"
                if (errorDetail.includes('URL handle')) {
                  this.validationErrorsUrlHandle =
                    'URL Handle: ' +
                    this.extractErrorMessage(errorDetail, 'URL handle');
                } else {
                  this.validationErrorsUrlHandle = '';
                }
              }
            } else {
              console.error(error);
            }
          },
        });
    }
  }

  onDelete(): void {
    if (this.id) {
      this.categoryService.deleteCategory(this.id).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/categories');
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editCategorySubscription?.unsubscribe();
  }

  private extractErrorMessage(errorDetail: string, field: string): string {
    const errorMessages = errorDetail.split(', ');
    const fieldError = errorMessages.find((msg) => msg.includes(field));
    return fieldError ? fieldError : '';
  }
}
