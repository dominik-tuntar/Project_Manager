import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Service } from '../service';
import { Custom_Attribute } from '../custom_attribute';

@Component({
  selector: 'app-cattribute-update',
  templateUrl: './cattribute-update.component.html',
  styleUrl: './cattribute-update.component.css'
})
export class CattributeUpdateComponent {
  @Input() title: string = 'Default Title';
  @Input() message: string = 'Default message.';
  @Input() selectedCatt: Custom_Attribute | null = null;
  @Output() customAttributeUpdated = new EventEmitter<Custom_Attribute>();
  isOpen: boolean = false;
  isDragging = false;
  mouseOffsetX = 0;
  mouseOffsetY = 0;
  @ViewChild('closeDiv') closeDiv!: ElementRef;
  @ViewChild('mainDiv') mainDiv!: ElementRef;
  constructor(private service: Service, private el: ElementRef) { }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.closeDiv.nativeElement.contains(event.target)) {
      event.preventDefault();

      const rect = this.mainDiv.nativeElement.getBoundingClientRect();

      this.mouseOffsetX = event.clientX - rect.left;
      this.mouseOffsetY = event.clientY - rect.top;

      this.isDragging = true;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      event.preventDefault();

      const newLeft = event.clientX - this.mouseOffsetX;
      const newTop = event.clientY - this.mouseOffsetY;

      const element = this.mainDiv.nativeElement;
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
    }
  }

  public updateCustomAttribute(id_c_attribute: number, title: string, content: string): void {
    if (this.selectedCatt && this.selectedCatt.ID_C_ATTRIBUTE) {
      const id_c_attribute = this.selectedCatt.ID_C_ATTRIBUTE;
      this.service.updateCustomAttribute(id_c_attribute, title, content)
        .subscribe(
          (response: any) => {
            if (this.selectedCatt) {
              this.selectedCatt.TITLE = title;
              this.selectedCatt.CONTENT_ = content;
              this.customAttributeUpdated.emit(this.selectedCatt);
              this.close();
            } else {
              alert('Error: selected detail is null after update');
            }
          },
          (error: any) => {
            alert(error);
          }
        );
    }
  }
}
