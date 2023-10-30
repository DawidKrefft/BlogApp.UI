import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageService } from './image.service';
import { Observable } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';
import { NgForm } from '@angular/forms';
import { PaginatedResult } from 'src/app/shared/models/PaginatedResult';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css'],
})
export class ImageSelectorComponent implements OnInit {
  private file?: File;
  fileName: string = '';
  title: string = '';
  images$?: Observable<PaginatedResult<BlogImage>>;
  paginatedResult?: PaginatedResult<BlogImage>;

  @ViewChild('form', { static: false }) imageUploadForm?: NgForm;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.loadImages();
  }

  onFileUploadChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0];
  }

  uploadImage(): void {
    const hasFile = this.file !== undefined;
    const hasFileName = this.fileName !== '';
    const hasTitle = this.title !== '';

    if (hasFile && hasFileName && hasTitle) {
      // Call the image service to upload the image
      this.imageService
        .uploadImage(this.file, this.fileName, this.title)
        .subscribe({
          next: (response) => {
            this.imageUploadForm?.resetForm();
            this.resetValues();
            this.loadImages();
          },
        });
    }
  }

  private resetValues(): void {
    this.file = undefined;
    this.fileName = '';
    this.title = '';
  }

  selectImage(image: BlogImage): void {
    this.imageService.selectImage(image);
  }

  loadImages(page: number = 1, pageSize: number = 5) {
    this.images$ = this.imageService.getAllImages(page, pageSize);
    this.images$.subscribe((result) => {
      this.paginatedResult = result;
    });
  }
}
