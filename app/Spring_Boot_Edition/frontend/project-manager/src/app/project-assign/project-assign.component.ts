import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Service } from '../service';
import { Devproject } from '../devproject';
import { Employee } from '../employee';

@Component({
  selector: 'app-project-assign',
  templateUrl: './project-assign.component.html',
  styleUrls: ['./project-assign.component.css']
})
export class ProjectAssignComponent {
  @Input() title: string = 'Create New Project';
  @Input() message: string = 'Fill in the details below to create a new project.';
  @Input() selectedProject: Devproject | null = null;
  @Output() onClose = new EventEmitter<void>();
  public employees: Employee[] = [];
  public employees_project: Employee[] = [];
  public selectedUserInfo: Employee | null = null;
  public selectedUserId: number | null = null;
  public selectedProjUserInfo: Employee | null = null;
  public selectedProjUserId: number | null = null;
  leadEmployeeId: number | null = null;
  public initialEmployeesProject: Employee[] = [];
  isOpen: boolean = false;
  isDragging = false;
  mouseOffsetX = 0;
  mouseOffsetY = 0;
  @ViewChild('closeDiv') closeDiv!: ElementRef;
  @ViewChild('mainDiv') mainDiv!: ElementRef;

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
    if (this.selectedProject) {
      const projectId = this.selectedProject.ID_DEVPROJECT;
      this.getEligibleProjectUsers(projectId);
      this.getProjectUsers(projectId);
      this.getProjectLead(projectId);

      this.service.getProjectUsers(projectId)
        .subscribe(
          (response: Employee[]) => {
            this.employees_project = response;
            this.initialEmployeesProject = [...response];
          },
          (error: any) => alert(error)
        );
    }
  }


  close() {
    this.isOpen = false;
    this.selectedUserId = null;
    this.selectedUserInfo = null;
    this.onClose.emit();
  }

  private getEligibleProjectUsers(id_devproject: number): void {
    this.service.getEligibleProjectUsers(id_devproject)
      .subscribe(
        (response: Employee[]) => {
          this.employees = response;
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  public getSelectedUserInfo(employee: Employee): void {
    if (employee && employee.ID_EMPLOYEE) {
      this.selectedUserId = employee.ID_EMPLOYEE;
      this.selectedUserInfo = { ...employee };
    } else {
      alert('Error: ID_EMPLOYEE is undefined for the selected user');
    }
  }

  public getSelectedProjUserInfo(employees_project: Employee): void {
    if (employees_project && employees_project.ID_EMPLOYEE) {
      this.selectedProjUserId = employees_project.ID_EMPLOYEE;
      this.selectedProjUserInfo = { ...employees_project };
    } else {
      alert('Error: ID_EMPLOYEE is undefined for the selected user');
    }
  }

  private getProjectUsers(id_devproject: number): void {
    this.service.getProjectUsers(id_devproject)
      .subscribe(
        (response: Employee[]) => {
          this.employees_project = response;
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  private getProjectLead(id_devproject: number): void {
    this.service.getProjectLead(id_devproject)
      .subscribe(
        (response: Employee[]) => {
          if (response && response.length > 0) {
            this.leadEmployeeId = response[0].ID_EMPLOYEE;
          } else {
            this.leadEmployeeId = null;
          }
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  public addUser(): void {
    if (this.selectedUserInfo) {
      this.employees_project.push(this.selectedUserInfo);
      this.employees = this.employees.filter(emp => emp.ID_EMPLOYEE !== this.selectedUserInfo?.ID_EMPLOYEE);
      this.selectedUserInfo = null;
    }
  }

  public removeUser(): void {
    if (this.selectedProjUserInfo) {
      this.employees.push(this.selectedProjUserInfo);
      this.employees_project = this.employees_project.filter(emp => emp.ID_EMPLOYEE !== this.selectedProjUserInfo?.ID_EMPLOYEE);

      if (this.leadEmployeeId === this.selectedProjUserInfo.ID_EMPLOYEE) {
        this.leadEmployeeId = null;
      }

      this.selectedProjUserInfo = null;

      this.onClose.emit();
    }
  }

  selectLead(selectedId: number, isChecked: boolean) {
    if (isChecked) {
      this.leadEmployeeId = selectedId;
    } else if (this.leadEmployeeId === selectedId) {
      this.leadEmployeeId = null;
    }
  }

  public saveChanges(): void {
    if (!this.selectedProject) return;

    const projectId = this.selectedProject.ID_DEVPROJECT;

    const newUsers = this.employees_project.filter(
      user => !this.initialEmployeesProject.some(initUser => initUser.ID_EMPLOYEE === user.ID_EMPLOYEE)
    );

    const removedUsers = this.initialEmployeesProject.filter(
      initUser => !this.employees_project.some(user => user.ID_EMPLOYEE === initUser.ID_EMPLOYEE)
    );

    newUsers.forEach(user => {
      this.service.createProjectUser(user.ID_EMPLOYEE, projectId)
        .subscribe(
          response => this.onClose.emit(),
          error => alert(error)
        );
    });

    removedUsers.forEach(user => {
      this.service.deleteProjectUser(user.ID_EMPLOYEE, projectId)
        .subscribe(
          response => this.onClose.emit(),
          error => alert(error)
        );
    });

    if (this.leadEmployeeId !== null) {
      this.service.updateLead(this.leadEmployeeId, projectId)
        .subscribe(

      );
    } else {
      this.service.deleteLead(projectId)
        .subscribe(

      );
    }
    this.close();
  }


}

