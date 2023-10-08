import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  selectedImage: BehaviorSubject<BlogImage> = new BehaviorSubject<BlogImage>({
    id: '',
    fileExtension: '',
    fileName: '',
    title: '',
    url: '',
  });

  private readonly baseUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAllImages(): Observable<BlogImage[]> {
    const url: string = `${this.baseUrl}/api/images`;
    return this.http.get<BlogImage[]>(url);
  }

  uploadImage(
    file: File | undefined,
    fileName: string,
    title: string
  ): Observable<BlogImage> {
    if (!file) {
      return new Observable<BlogImage>((observer) => {
        observer.error('File is not provided.');
        observer.complete();
      });
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('title', title);

    const url: string = `${this.baseUrl}/api/images`;
    return this.http.post<BlogImage>(url, formData);
  }

  selectImage(image: BlogImage): void {
    this.selectedImage.next(image);
  }

  onSelectImage(): Observable<BlogImage> {
    return this.selectedImage.asObservable();
  }
}
