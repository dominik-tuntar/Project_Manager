import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Devproject } from '../devproject';
import { Service } from '../service';
import { Custom_Attribute } from '../custom_attribute';
import { ProjectCreateComponent } from '../project-create/project-create.component';
import { ProjectUpdateComponent } from '../project-update/project-update.component';
import { CattributeCreateComponent } from '../cattribute-create/cattribute-create.component';
import { CattributeUpdateComponent } from '../cattribute-update/cattribute-update.component';
import { ProjectAssignComponent } from '../project-assign/project-assign.component';
import { Employee } from '../employee';
import { FinalProjectCreateComponent } from '../final-project-create/final-project-create.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  title = 'Projects';
  public projects: Devproject[] = [];
  public allowed_projects: Devproject[] = [];
  public custom_attributes: Custom_Attribute[] = [];
  public selectedProjectInfo: Devproject | null = null;
  public selectedCattInfo: Custom_Attribute | null = null;
  public filteredAttributes: any[] = [];
  public selectedProjectId: number | null = null;
  public selectedCattId: number | null = null;
  public isLoading: boolean = false;
  public searchTerm: string = '';
  public filteredProjects: Devproject[] = [];
  public isCreateProjectOpen = false;
  public idEmployeeRole: number = 2;
  public idEmployee: number = 0;
  public isProjectAssignOpen = false;
  public employees_project: Employee[] = [];
  public projectUsers: Employee[] = [];
  public username: string = '';

  constructor(private service: Service) { }

  ngOnInit() {
    this.idEmployeeRole = parseInt(localStorage.getItem('id_employee_role') || '0', 10);
    this.idEmployee = parseInt(localStorage.getItem('id_employee') || '0', 10);
    this.username = localStorage.getItem('username') || '';
    this.getLeadProjects(this.idEmployee)
    this.getAllProjects();
    this.refreshProjectUsers();
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

  public getLeadProjects(idEmployee: number): void {

    this.service.getLeadProjects(idEmployee).subscribe(
      (response: Devproject[]) => {
        this.allowed_projects = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  public isProjectAllowed(): boolean {
    if (!this.selectedProjectInfo) {
      return false;
    }

    const selectedProjectId = this.selectedProjectInfo.ID_DEVPROJECT;

    return this.allowed_projects.some(
      project => project.ID_DEVPROJECT === selectedProjectId
    );
  }




  public getAllProjects(): void {
    this.service.getAllProjects().subscribe(
      (response: Devproject[]) => {
        this.projects = response;
        this.filteredProjects = [...this.projects];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getSelectedProjectInfo(project: Devproject): void {
    if (project && project.ID_DEVPROJECT) {
      this.selectedProjectId = project.ID_DEVPROJECT;
      this.selectedProjectInfo = { ...project };
      this.getCustomAttributes('PROJECT', project.ID_DEVPROJECT);
      this.getProjectUsers(project.ID_DEVPROJECT);
    } else {
      alert('Error: ID_DEVPROJECT is undefined for the selected project');
    }
  }

  public getSelectedCattInfo(custom_attribute: Custom_Attribute): void {
    this.selectedCattId = custom_attribute.ID_C_ATTRIBUTE;
    this.selectedCattInfo = { ...custom_attribute };
  }

  public getCustomAttributes(table_name: string, table_row: number): void {
    this.service.getCustomAttributes(table_name, table_row)
      .subscribe(
        (response: any) => {
          this.custom_attributes = response;
          this.filterAttributes();
        },
        (error: any) => {
          alert(error);
        }
      );
  }

  public deleteCustomAttribute(id_c_attribute: number | null): void {
    if (id_c_attribute !== null) {
      this.service.deleteCustomAttribute(id_c_attribute)
        .subscribe(
          (response: any) => {
            const index = this.custom_attributes.findIndex(attr => attr.ID_C_ATTRIBUTE === id_c_attribute);
            if (index > -1) {
              this.custom_attributes.splice(index, 1);
              this.filterAttributes();
            }
            this.logActivity(this.username, "removed a custom attribute from a", 'project');
          },
          (error: any) => {
            alert(error);
          }
        );
    } else {
      alert('Invalid ID: id_c_attribute is null');
    }
  }

  public deleteProject(id_devproject: number | null): void {
    if (id_devproject !== null) {
      this.service.deleteProject(id_devproject).subscribe(
        (response: any) => {
          const index = this.projects.findIndex(project => project.ID_DEVPROJECT === id_devproject);
          if (index > -1) {
            this.projects.splice(index, 1);
            this.filteredProjects = [...this.projects];
          }
          this.logActivity(this.username, "deleted a", 'project');
        },
        (error: any) => {
          alert(error);
        }
      );
    } else {
      alert('Invalid ID: id_devproject is null');
    }
  }

  private filterAttributes(): void {
    this.filteredAttributes = this.custom_attributes.filter(attribute =>
      attribute.TABLE_NAME === 'DEVPROJECT' && attribute.TABLE_ROW === this.selectedProjectId
    );
  }

  public filterProjects(): void {
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredProjects = this.projects.filter(project =>
        project.TITLE.toLowerCase().includes(searchTermLower) ||
        project.DESCRIPTION_.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredProjects = [...this.projects];
    }
  }

  @ViewChild('popupCreate') popupCreate!: ProjectCreateComponent;
  @ViewChild('popupUpdate') popupUpdate!: ProjectUpdateComponent;
  @ViewChild('popupFinalize') popupFinalize!: FinalProjectCreateComponent;
  @ViewChild('popupCattCreate') popupCattCreate!: CattributeCreateComponent;
  @ViewChild('popupCattUpdate') popupCattUpdate!: CattributeUpdateComponent;
  @ViewChild('popupProjectAssign', { static: false }) popupProjectAssign!: ProjectAssignComponent;

  showCreatePopup() {
    if (this.popupCreate) {
      this.popupCreate.open();
    }
  }

  showProjectAssignPopup() {
    if (this.popupProjectAssign && this.selectedProjectInfo) {
      this.popupProjectAssign.selectedProject = { ...this.selectedProjectInfo };
      this.popupProjectAssign.open();

      this.popupProjectAssign.onClose.subscribe(() => {
        this.refreshProjectUsers();
      });
    }
  }

  public onProjectCreated(): void {
    this.getAllProjects();
    this.logActivity(this.username, "created a", 'project');
  }

  public onProjectFinalized(): void {
    this.getAllProjects();
    this.logActivity(this.username, "finalized a", 'project');
  }

  showUpdatePopup() {
    if (this.popupUpdate && this.selectedProjectInfo) {
      this.popupUpdate.selectedProject = { ...this.selectedProjectInfo };
      this.popupUpdate.open();
    } else {
      alert('Error: No project selected or popupUpdate component is not ready');
    }
  }

  showFinalizePopup() {
    if (this.popupFinalize && this.selectedProjectInfo) {
      this.popupFinalize.selectedProject = { ...this.selectedProjectInfo };
      this.popupFinalize.open();
    } else {
      alert('Error: No project selected or popupFinalize component is not ready');
    }
  }

  public onProjectUpdated(updatedProject: Devproject): void {
    const index = this.projects.findIndex(p => p.ID_DEVPROJECT === updatedProject.ID_DEVPROJECT);
    if (index > -1) {
      this.projects[index] = updatedProject;
      this.filteredProjects = [...this.projects];
    }
    this.logActivity(this.username, "updated a", 'project');
  }

  refreshProjectUsers(): void {
    if (this.selectedProjectInfo) {
      this.service.getProjectUsers(this.selectedProjectInfo.ID_DEVPROJECT)
        .subscribe(
          (users: Employee[]) => {
            this.employees_project = users;
          },
          (error) => {
            alert(error);
          }
        );
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

  showCattCreatePopup() {
    if (this.popupCattCreate && this.selectedProjectInfo) {
      this.popupCattCreate.currentContext = 'DEVPROJECT';
      this.popupCattCreate.selectedProject = { ...this.selectedProjectInfo };
      this.popupCattCreate.open();
    } else {
      alert('Error: No project selected or popupCattCreate component is not ready');
    }
  }

  public onCustomAttributeCreated(): void {
    this.getCustomAttributes('DEVPROJECT', this.selectedProjectId!);
    this.logActivity(this.username, "added a custom attribute to a", 'project');
  }

  showCattUpdatePopup() {
    if (this.popupCattUpdate && this.selectedCattInfo) {
      this.popupCattUpdate.selectedCatt = { ...this.selectedCattInfo };
      this.popupCattUpdate.open();
    }
  }

  public onCustomAttributeUpdated(updatedCatt: Custom_Attribute): void {
    const index = this.custom_attributes.findIndex(catt => catt.ID_C_ATTRIBUTE === updatedCatt.ID_C_ATTRIBUTE);
    if (index !== -1) {
      this.custom_attributes[index] = updatedCatt;
      this.getCustomAttributes('DEVPROJECT', this.selectedProjectId!);
    }
    this.logActivity(this.username, "updated a custom attribute for a", 'project');
  }
}
