import { Injectable } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { environment } from 'src/environments/environment.development';
import { UpdateCategoryRequest } from './../models/update-category-request.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl: string = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    const url: string = `${this.baseUrl}/api/categories`;
    return this.http.get<Category[]>(url);
  }

  getCategoryById(id: string): Observable<Category> {
    const url: string = `${this.baseUrl}/api/categories/${id}`;
    return this.http.get<Category>(url);
  }

  addCategory(model: AddCategoryRequest): Observable<void> {
    const url: string = `${this.baseUrl}/api/categories?addAuth=true`;
    return this.http.post<void>(url, model);
  }

  updateCategory(
    id: string,
    updateCategoryRequest: UpdateCategoryRequest
  ): Observable<Category> {
    const url: string = `${this.baseUrl}/api/categories/${id}?addAuth=true`;
    return this.http.put<Category>(url, updateCategoryRequest);
  }

  deleteCategory(id: string): Observable<Category> {
    const url: string = `${this.baseUrl}/api/categories/${id}?addAuth=true`;
    return this.http.delete<Category>(url);
  }
}
