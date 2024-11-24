import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Service } from '../service';
import { Devproject } from '../devproject';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css']
})
export class ProjectCreateComponent {
  @Input() title: string = 'Create New Project';
  @Input() message: string = 'Fill in the details below to create a new project.';
  @Output() projectCreated = new EventEmitter<Devproject>();
  public titleError: string | null = null;
  isDragging = false;
  mouseOffsetX = 0;
  mouseOffsetY = 0;
  @ViewChild('closeDiv') closeDiv!: ElementRef;
  @ViewChild('mainDiv') mainDiv!: ElementRef;

  isOpen: boolean = false;

  constructor(private service: Service, private el: ElementRef) { }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.titleError = null;
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

  public createProject(title: string, description: string): void {
    this.service.createProject(title, description).subscribe(
      (response: Devproject) => {
        this.projectCreated.emit(response);
        this.close();
      },
      (error: any) => {
        alert(error);
        this.titleError = 'Failed to create project. Please try again.';
      }
    );
  }
}

