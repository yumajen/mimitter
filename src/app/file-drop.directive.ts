import { Directive, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appFileDrop]'
})
export class FileDropDirective {

  @Output() dropFile = new EventEmitter<File[]>();

  @HostBinding('style.background-color') private background = '#ddffc2';
  @HostBinding('style.opacity') private opacity = '1';

  @HostListener('dragover', ['$event']) onDragOver(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.opacity = '0.7';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.opacity = '1';
  }

  @HostListener('drop', ['$event']) onDrop(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.opacity = '1';
    this.dropFile.emit(event.dataTransfer.files);
  }

  constructor() { }

}
