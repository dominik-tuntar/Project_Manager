import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from '../employee';
import { Service } from '../service';
import { UserUpdateComponent } from '../user-update/user-update.component';
import { Custom_Attribute } from '../custom_attribute';
import { UserCreateComponent } from '../user-create/user-create.component';
import { CattributeCreateComponent } from '../cattribute-create/cattribute-create.component';
import { CattributeUpdateComponent } from '../cattribute-update/cattribute-update.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  title = 'Users';
  public employees: Employee[] = [];
  public custom_attributes: Custom_Attribute[] = [];
  public selectedUserInfo: Employee | null = null;
  public selectedCattInfo: Custom_Attribute | null = null;
  public filteredAttributes: any[] = [];
  public selectedUserId: number | null = null;
  public selectedCattId: number | null = null;
  public isLoading: boolean = false;
  public searchTerm: string = '';
  public filteredUsers: Employee[] = [];
  public idEmployeeRole: number = 2;
  public username: string = '';


  constructor(private service: Service) { }

  ngOnInit() {
    this.getAllUsers();
    this.idEmployeeRole = parseInt(localStorage.getItem('id_employee_role') || '0', 10);
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

  public getAllUsers(): void {
    this.service.getAllUsers().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        this.filteredUsers = [...this.employees];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getSelectedUserInfo(employee: Employee): void {
    if (employee && employee.ID_EMPLOYEE) {
      this.selectedUserId = employee.ID_EMPLOYEE;
      this.selectedUserInfo = { ...employee };
      this.getCustomAttributes('EMPLOYEE', employee.ID_EMPLOYEE);
    } else {
      alert('Error: ID_EMPLOYEE is undefined for the selected user');
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

  public disableUser(id_employee: number | null): void {
    if (id_employee !== null) {
      this.service.disableUser(id_employee)
        .subscribe(
          (response: any) => {
            const index = this.employees.findIndex(emp => emp.ID_EMPLOYEE === id_employee);
            if (index > -1) {
              this.employees[index].STATUS = 0;
              this.filteredUsers = [...this.employees];
            }
            this.logActivity(this.username, "set a user's status to", 'inactive');
          },
          (error: any) => {
            alert(error);
          }
        );
    } else {
      alert('Invalid ID: id_employee is null');
    }
  }

  public enableUser(id_employee: number | null): void {
    if (id_employee !== null) {
      this.service.enableUser(id_employee)
        .subscribe(
          (response: any) => {
            const index = this.employees.findIndex(emp => emp.ID_EMPLOYEE === id_employee);
            if (index > -1) {
              this.employees[index].STATUS = 1;
              this.filteredUsers = [...this.employees];
            }
            this.logActivity(this.username, "set a user's status to", 'active');
          },
          (error: any) => {
            alert(error);
          }
        );
    } else {
      alert('Invalid ID: id_employee is null');
    }
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
            this.logActivity(this.username, "removed a custom atribute from a", 'user');
          },
          (error: any) => {
            alert(error);
          }
        );
    } else {
      alert('Invalid ID: id_employee is null');
    }
  }

  private filterAttributes(): void {
    this.filteredAttributes = this.custom_attributes.filter(attribute =>
      attribute.TABLE_NAME === 'EMPLOYEE' && attribute.TABLE_ROW === this.selectedUserId
    );
  }

  public filterUsers(): void {
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredUsers = this.employees.filter(employee =>
        employee.USERNAME.toLowerCase().includes(searchTermLower) ||
        employee.FULLNAME.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredUsers = [...this.employees];
    }
  }


  @ViewChild('popupUpdate') popupUpdate!: UserUpdateComponent;
  @ViewChild('popupCreate') popupCreate!: UserCreateComponent;
  @ViewChild('popupCattUpdate') popupCattUpdate!: CattributeUpdateComponent;
  @ViewChild('popupCattCreate') popupCattCreate!: CattributeCreateComponent;

  showUpdatePopup() {
    if (this.popupUpdate && this.selectedUserInfo) {
      this.popupUpdate.selectedUser = { ...this.selectedUserInfo };
      this.popupUpdate.open();
    } else {
      alert('Error: No user selected or popupUpdate component is not ready');
    }
  }

  showCattCreatePopup() {
    if (this.popupCattCreate && this.selectedUserInfo) {
      this.popupCattCreate.currentContext = 'EMPLOYEE';
      this.popupCattCreate.selectedUser = { ...this.selectedUserInfo };
      this.popupCattCreate.open();
    } else {
      alert('Error: No user selected or popupCattCreate component is not ready');
    }
  }

  showCattUpdatePopup() {
    if (this.popupCattUpdate && this.selectedCattInfo) {
      this.popupCattUpdate.selectedCatt = { ... this.selectedCattInfo };
      this.popupCattUpdate.open();
    }
  }

  showCreatePopup() {
    if (this.popupCreate) {
      this.popupCreate.open();
    }
  }

  public onUserUpdated(updatedUser: Employee): void {
    const index = this.employees.findIndex(emp => emp.ID_EMPLOYEE === updatedUser.ID_EMPLOYEE);
    if (index > -1) {
      this.employees[index] = updatedUser;
      this.filteredUsers = [...this.employees];
    }
    this.logActivity(this.username, "updated a", 'user');
  }

  public onUserCreated(): void {
    this.getAllUsers();
    this.logActivity(this.username, "added a", 'user');
  }

  public onCustomAttributeUpdated(updatedCatt: Custom_Attribute): void {
    const index = this.custom_attributes.findIndex(catt => catt.ID_C_ATTRIBUTE === updatedCatt.ID_C_ATTRIBUTE);
    if (index !== -1) {
      this.custom_attributes[index] = updatedCatt;
      this.getCustomAttributes('EMPLOYEE', this.selectedUserId!);
    }
    this.logActivity(this.username, "updated a custom attribute for a", 'user');
  }

  public onCustomAttributeCreated(): void {
    this.getCustomAttributes('EMPLOYEE', this.selectedUserId!);
    this.logActivity(this.username, "created a custom attribute for a", 'user');
  }
}
