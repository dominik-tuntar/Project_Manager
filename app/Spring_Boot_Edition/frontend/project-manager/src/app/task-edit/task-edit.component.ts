import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Service } from '../service';
import { TaskCreateComponent } from '../task-create/task-create.component';
import { Employee } from '../employee';
import { TaskUpdateComponent } from '../task-update/task-update.component';
import { Task } from '../task';


@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.css'
})
export class TaskEditComponent implements OnInit {
  isOpen: boolean = false;
  popupTaskCreateVisible: boolean = false;
  popupTaskUpdateVisible: boolean = false;
  @Input() selectedProject: number = 0;
  @Input() selectedTitle: string | null = null;
  @Input() selectedIdEmployee: number = 0;
  @Input() selectedDescription: string = '';
  @Input() task_data: any;
  public employees_project_create: Employee[] = [];
  public employees_project_update: Employee[] = [];
  public username: string = '';
  isDragging = false;
  mouseOffsetX = 0;
  mouseOffsetY = 0;
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
    this.popupTaskCreateVisible = false;
  }

  @ViewChild('popupTaskCreate') popupTaskCreate!: TaskCreateComponent;
  @ViewChild('popupTaskUpdate') popupTaskUpdate!: TaskUpdateComponent;

  private getProjectUsers(id_devproject: number): void {
    this.service.getProjectUsers(id_devproject)
      .subscribe(
        (response: Employee[]) => {
          this.employees_project_create = response;
          this.popupTaskCreate.employees_project_create = this.employees_project_create;
          this.popupTaskCreate.selectedProject = id_devproject;
          this.popupTaskCreate.open();
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  private getProjectUsersForTaskUpdate(id_devproject: number, id_task: number, description: string, id_employee: number | null, username: string): void {
    this.service.getProjectUsers(id_devproject)
      .subscribe(
        (response: any[]) => {
          this.employees_project_update = response;
          this.popupTaskUpdate.employees_project_update = this.employees_project_update;
          this.popupTaskUpdate.selectedProject = id_devproject;
          this.popupTaskUpdate.selectedTask = id_task;
          this.popupTaskUpdate.selectedDescription = description;
          this.popupTaskUpdate.selectedIdEmployee = id_employee;
          this.popupTaskUpdate.selectedUsername = username;
          this.popupTaskUpdate.open();
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  public deleteTask(id_task: number): void {
    this.service.deleteTask(id_task)
      .subscribe(
        (response: any) => {
          this.getProjectTasks(this.selectedProject);
          this.logActivity(this.username, "deleted a", 'task');
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  public showTaskCreatePopup() {
    this.popupTaskCreateVisible = true;

    if (this.popupTaskCreate) {
      this.getProjectUsers(this.selectedProject);
    } else {
      setTimeout(() => {
        if (this.popupTaskCreate) {
          this.getProjectUsers(this.selectedProject);
        }
      });
    }
  }

  public showTaskUpdatePopup(id_task: number, description: string, id_employee: number | null, username: string) {
    this.popupTaskUpdateVisible = true;

    if (this.popupTaskUpdate) {
      this.getProjectUsersForTaskUpdate(this.selectedProject, id_task, description, id_employee, username);
    } else {
      setTimeout(() => {
        if (this.popupTaskUpdate) {
          this.getProjectUsersForTaskUpdate(this.selectedProject, id_task, description, id_employee, username);
        }
      });
    }
  }

  public updateTaskStatus(id_task: number, status: number): void {
    this.service.updateTaskStatus(id_task, status).subscribe(
      (response: Task) => {
        this.getProjectTasks(this.selectedProject);
      },
      (error: any) => {
        alert(error);
      }
    );
  }

  private getProjectTasks(id_devproject: number): void {
    this.service.getProjectTasks(id_devproject)
      .subscribe(
        (response: any[]) => {
          this.task_data = response;
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  public onTaskCreated(): void {
    this.getProjectTasks(this.selectedProject);
  }

  public onTaskUpdated(): void {
    this.getProjectTasks(this.selectedProject);
  }

  public downloadFiles(id_task: number): void {
    this.service.getFolderPath(id_task).subscribe(
      (folderPath: string) => {
        const normalizedPath = folderPath.replace(/\\\\/g, '/').replace(/\\/g, '/');
        this.downloadFolder(normalizedPath);
      },
      (err) => {
        alert(err);
      }
    );
  }

  private downloadFolder(absolutePath: string): void {
    this.service.downloadFolder(absolutePath).subscribe({
      next: (response) => {
        const blob = response as Blob;
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'files.zip';
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
      },
      error: (err) => {
        alert(err);
      }
    });
  }

}
