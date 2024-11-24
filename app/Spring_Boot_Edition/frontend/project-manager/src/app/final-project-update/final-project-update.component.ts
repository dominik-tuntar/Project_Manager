import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Final_Project } from '../final_project';
import { Service } from '../service';

@Component({
  selector: 'app-final-project-update',
  templateUrl: './final-project-update.component.html',
  styleUrl: './final-project-update.component.css'
})
export class FinalProjectUpdateComponent implements OnInit {
  
  @Input() title: string = 'Create New Project';
  @Input() message: string = 'Fill in the details below to create a new project.';
  @Output() projectUpdated = new EventEmitter<Final_Project>();
  @Input() selectedProject: Final_Project | null = null;
  public titleError: string | null = null;
  public username: string = '';
  isDragging = false;
  mouseOffsetX = 0;
  mouseOffsetY = 0;
  @ViewChild('closeDiv') closeDiv!: ElementRef;
  @ViewChild('mainDiv') mainDiv!: ElementRef;

  isOpen: boolean = false;

  constructor(private service: Service, private el: ElementRef) {}
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
  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
  }

  public logActivity(username: string, db_action: string, db_object: string): void {
    this.service.logActivity(username, db_action, db_object)
    .subscribe(
      (response: any) => {
        
      },
      (error: any) => {
        alert(error);
      }
    );
  

}

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.titleError = null;
  }

  public updateFinalProject(title: string, description: string): void {
    if (this.selectedProject && this.selectedProject.ID_F_PROJECT) {
    const id_project = this.selectedProject.ID_F_PROJECT;
    this.service.updateFinalProject(id_project, title, description).subscribe(
      (response: Final_Project) => {
        this.projectUpdated.emit(response);
        this.close();
        this.logActivity(this.username, "updated a", 'final project');
      },
      (error: any) => {
        alert(error);
        this.titleError = 'Failed to create project. Please try again.';
      }
    );
  }}

}
