import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Employee } from '../employee';
import { Service } from '../service';
import { Task } from '../task';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css'
})
export class TaskCreateComponent implements OnInit {
  isOpen: boolean = false;
  public employees_project_create: Employee[] = [];
  public selectedProject: number = 0;
  public username: string = '';
  @Output() taskCreated = new EventEmitter<Task>();
  isDragging = false;
  startMouseX = 0;
  startMouseY = 0;
  startTransformX = 0;
  startTransformY = 0;

  @ViewChild('closeDiv') closeDiv!: ElementRef;
  @ViewChild('mainDiv') mainDiv!: ElementRef;
  constructor(private service: Service, private el: ElementRef) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.closeDiv.nativeElement.contains(event.target)) {
      event.preventDefault();

      const rect = this.mainDiv.nativeElement.getBoundingClientRect();

      this.startMouseX = event.clientX;
      this.startMouseY = event.clientY;
      const transform = getComputedStyle(this.mainDiv.nativeElement).transform;
      const matrix = transform === 'none' ? [1, 0, 0, 1, 0, 0] : transform.split('(')[1].split(')')[0].split(',');

      this.startTransformX = parseFloat(matrix[4] as string);
      this.startTransformY = parseFloat(matrix[5] as string);

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

      const deltaX = event.clientX - this.startMouseX;
      const deltaY = event.clientY - this.startMouseY;

      const newTransformX = this.startTransformX + deltaX;
      const newTransformY = this.startTransformY + deltaY;

      this.mainDiv.nativeElement.style.transform = `translate(${newTransformX}px, ${newTransformY}px)`;
    }
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  public createTask(id_devproject: number, id_employee: number | null, description: string): void {
    this.service.createTask(id_devproject, id_employee, description).subscribe(
      (response: Task) => {
        this.taskCreated.emit();
        this.close();
        this.logActivity(this.username, "created a new", 'task');
      },
      (error: any) => {
        alert(error);
      }
    );
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

}
