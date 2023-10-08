import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPost } from '../models/blog-post.model';
import { UpdateBlogPost } from './../models/update-blog-post.model';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private readonly baseUrl: string = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getAllBlogPosts(): Observable<BlogPost[]> {
    const url: string = `${this.baseUrl}/api/blogposts`;
    return this.http.get<BlogPost[]>(url);
  }

  getBlogPostById(id: string): Observable<BlogPost> {
    const url: string = `${this.baseUrl}/api/blogposts/${id}`;
    return this.http.get<BlogPost>(url);
  }

  getBlogPostByUrlHandle(urlHandle: string): Observable<BlogPost> {
    const url: string = `${this.baseUrl}/api/blogposts/${urlHandle}`;
    return this.http.get<BlogPost>(url);
  }

  createBlogPost(blogPostData: AddBlogPost): Observable<BlogPost> {
    const url: string = `${this.baseUrl}/api/blogposts?addAuth=true`;
    return this.http.post<BlogPost>(url, blogPostData);
  }

  updateBlogPost(
    id: string,
    updatedBlogPost: UpdateBlogPost
  ): Observable<BlogPost> {
    const url: string = `${this.baseUrl}/api/blogposts/${id}?addAuth=true`;
    return this.http.put<BlogPost>(url, updatedBlogPost);
  }

  deleteBlogPost(id: string): Observable<BlogPost> {
    const url: string = `${this.baseUrl}/api/blogposts/${id}?addAuth=true`;
    return this.http.delete<BlogPost>(url);
  }
}
