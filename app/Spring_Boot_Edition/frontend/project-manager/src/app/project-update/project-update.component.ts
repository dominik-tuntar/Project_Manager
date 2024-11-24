import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Devproject } from '../devproject'; // Assuming Devproject interface is defined
import { Service } from '../service';

@Component({
  selector: 'app-project-update',
  templateUrl: './project-update.component.html',
  styleUrls: ['./project-update.component.css']
})
export class ProjectUpdateComponent {
  @Input() selectedProject: Devproject | null = null;
  @Output() projectUpdated = new EventEmitter<Devproject>();
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

  updateProject(id_project: number, title: string, description: string): void {
    if (this.selectedProject && this.selectedProject.ID_DEVPROJECT) {
      const id_project = this.selectedProject.ID_DEVPROJECT;
      this.service.updateProject(id_project, title, description).subscribe(
        (response: any) => {
          if (this.selectedProject) {
            this.selectedProject.TITLE = title;
            this.selectedProject.DESCRIPTION_ = description;
            this.projectUpdated.emit(this.selectedProject);
            this.close();
          } else {
            alert('Error: selectedProject is null after update');
          }
        },
        (error: any) => {
          alert(error);
        }
      );
    } else {
      alert('Error: selectedProject or ID_DEVPROJECT is undefined');
    }
  }
}

