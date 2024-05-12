import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { serverUrl } from 'src/environment';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() imageUrl: string = '';
  @Output() uploadCompleted = new EventEmitter<string>();
  private http: HttpClient = inject(HttpClient)
  isDragOver = false;
  isLoading = false;

  serverBaseUrl = serverUrl;
  errorMessage!: string;

  constructor() {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndUploadFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.validateAndUploadFile(file);
    }
  }

  validateAndUploadFile(file: File) {
    // Reset error message
    this.errorMessage = '';

    // Validate file type
    // if (!file?.type?.startsWith('image/')) {
    //   this.errorMessage = 'Only image files are allowed.';
    //   return;
    // }

    // Validate file size (< 10 MB)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      this.errorMessage = 'File must be less than 10MB.';
      return;
    }

    // Proceed with the upload
    this.uploadFile(file);
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const uploadUrl = '/file/upload/image'; // Change this to your upload URL
    this.isLoading = true;

    this.http.post(uploadUrl, formData).subscribe({
      next: (response: any) => {
        const { fileUrl } = response.data;
        this.imageUrl = fileUrl;
        this.isLoading = false;
        this.uploadCompleted.emit(this.imageUrl); // Emit the URL or response from the server
      },
      error: (error) => {
        this.isLoading = false;
        this.resetFileInput();
        console.error('Upload error:', error);
      }
    });
  }

  resetFileInput(): void {
    this.fileInput.nativeElement.value = ''; // Reset the file input
  }

  removeFile() {
    this.imageUrl = '';
    this.uploadCompleted.emit(this.imageUrl);
  }

  get completeUrl() {
    return !this.imageUrl ? '' : (this.imageUrl.indexOf('http') !== -1 ? '' : this.serverBaseUrl) + this.imageUrl;
  }
}
