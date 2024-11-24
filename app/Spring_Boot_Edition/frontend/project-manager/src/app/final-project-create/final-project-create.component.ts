import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Service } from '../service';
import { Devproject } from '../devproject';

@Component({
  selector: 'app-final-project-create',
  templateUrl: './final-project-create.component.html',
  styleUrl: './final-project-create.component.css'
})
export class FinalProjectCreateComponent {
  @Input() title: string = 'Create New Project';
  @Input() message: string = 'Fill in the details below to create a new project.';
  @Output() projectFinalized = new EventEmitter<Devproject>();
  @Input() selectedProject: Devproject | null = null;
  public titleError: string | null = null;
  isDragging = false;
  mouseOffsetX = 0;
  mouseOffsetY = 0;
  @ViewChild('closeDiv') closeDiv!: ElementRef;
  @ViewChild('mainDiv') mainDiv!: ElementRef;

  isOpen: boolean = false;

  constructor(private service: Service, private el: ElementRef) { }
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

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.titleError = null;
  }

  public createFinalProject(title: string, description: string): void {
    if (this.selectedProject && this.selectedProject.ID_DEVPROJECT) {
      const id_project = this.selectedProject.ID_DEVPROJECT;
      this.service.createFinalProject(id_project, title, description).subscribe(
        (response: Devproject) => {
          this.projectFinalized.emit(response);
          this.close();
        },
        (error: any) => {
          alert(error);
          this.titleError = 'Failed to create project. Please try again.';
        }
      );
    }
  }

}
