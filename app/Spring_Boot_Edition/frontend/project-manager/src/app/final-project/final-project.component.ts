import { Component, OnInit, ViewChild } from '@angular/core';
import { Service } from '../service';
import { Final_Project } from '../final_project';
import { HttpErrorResponse } from '@angular/common/http';
import { FinalProjectUpdateComponent } from '../final-project-update/final-project-update.component';

@Component({
  selector: 'app-final-project',
  templateUrl: './final-project.component.html',
  styleUrl: './final-project.component.css'
})
export class FinalProjectComponent implements OnInit {
  title = 'Fprojects';
  public fprojects: Final_Project[] = [];
  public selectedFprojectInfo: Final_Project | null = null;
  public selectedFprojectId: number | null = null;
  public selectedCattId: number | null = null;
  public isLoading: boolean = false;
  public searchTerm: string = '';
  public filteredFprojects: Final_Project[] = [];
  public isCreateFprojectOpen = false;
  public idEmployeeRole: number = 2;
  public username: string = '';

  constructor(private service: Service) { }

  ngOnInit() {
    this.idEmployeeRole = parseInt(localStorage.getItem('id_employee_role') || '0', 10);
    this.username = localStorage.getItem('username') || '';
    this.getAllFprojects();
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

  public getAllFprojects(): void {
    this.service.getAllFinalProjects().subscribe(
      (response: Final_Project[]) => {
        this.fprojects = response;
        this.filteredFprojects = [...this.fprojects];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getSelectedFprojectInfo(fproject: Final_Project): void {
    if (fproject && fproject.ID_F_PROJECT) {
      this.selectedFprojectId = fproject.ID_F_PROJECT;
      this.selectedFprojectInfo = { ...fproject };
    } else {
      alert('Error: ID_IREQUEST is undefined for the selected fproject');
    }
  }


  public deleteFproject(id_f_project: number | null): void {
    if (id_f_project !== null) {
      this.service.deleteFinalProject(id_f_project).subscribe(
        (response: any) => {
          const index = this.fprojects.findIndex(fproject => fproject.ID_F_PROJECT === id_f_project);
          if (index > -1) {
            this.fprojects.splice(index, 1);
            this.filteredFprojects = [...this.fprojects];
          }
          this.logActivity(this.username, "removed a", 'final project');
        },
        (error: any) => {
          alert(error);
        }
      );
    } else {
      alert('Invalid ID: id_fproject is null');
    }
  }

  public filterFprojects(): void {
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredFprojects = this.fprojects.filter(fproject =>
        fproject.TITLE.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredFprojects = [...this.fprojects];
    }
  }

  public disableFinalProject(id_f_project: number | null): void {
    if (id_f_project !== null) {
      this.service.disableFinalProject(id_f_project)
        .subscribe(
          (response: any) => {
            const project = this.fprojects.find(fproject => fproject.ID_F_PROJECT === id_f_project);
            if (project) {
              project.STATUS = 0;
              this.filteredFprojects = [...this.fprojects];
            }
            this.logActivity(this.username, "set a final project as", 'inactive');
          },
          (error: any) => {
            alert(error);
          }
        );
    } else {
      alert('Invalid ID: id_f_project is null');
    }
  }

  public enableFinalProject(id_f_project: number | null): void {
    if (id_f_project !== null) {
      this.service.enableFinalProject(id_f_project)
        .subscribe(
          (response: any) => {
            const project = this.fprojects.find(fproject => fproject.ID_F_PROJECT === id_f_project);
            if (project) {
              project.STATUS = 1;
              this.filteredFprojects = [...this.fprojects];
            }
            this.logActivity(this.username, "set a final project as", 'active');
          },
          (error: any) => {
            alert(error);
          }
        );
    } else {
      alert('Invalid ID: id_f_project is null');
    }
  }

  public deleteFinalProject(id_f_project: number | null): void {
    if (id_f_project !== null) {
      this.service.deleteFinalProject(id_f_project)
        .subscribe(
          (response: any) => {
            const project = this.fprojects.find(fproject => fproject.ID_F_PROJECT === id_f_project);
            if (project) {
              project.STATUS = 0;
              this.filteredFprojects = [...this.fprojects];
              this.getAllFprojects();
            }
            this.logActivity(this.username, "removed a", 'final project');
          },
          (error: any) => {
            alert(error);
          }
        );
    } else {
      alert('Invalid ID: id_f_project is null');
    }
  }

  public downloadFinalProject(id_f_project: number | null): void {
    if (id_f_project !== null) {
      this.service.downloadFinalProject(id_f_project).subscribe(
        blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'final_project.zip';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error => {
          console.error(error);
        }
      );
    } else {
      alert('Invalid ID: id_f_project is null');
    }
  }

  @ViewChild('popupUpdate') popupUpdate!: FinalProjectUpdateComponent;


  showUpdatePopup() {
    if (this.popupUpdate && this.selectedFprojectInfo) {
      this.popupUpdate.selectedProject = { ...this.selectedFprojectInfo };
      this.popupUpdate.open();
    } else {
      alert('Error: No fproject selected or popupUpdate component is not ready');
    }
  }

}
