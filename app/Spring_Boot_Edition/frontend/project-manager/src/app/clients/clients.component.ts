import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from '../client';
import { Service } from '../service';
import { Custom_Attribute } from '../custom_attribute';
import { ClientCreateComponent } from '../client-create/client-create.component';
import { ClientUpdateComponent } from '../client-update/client-update.component';
import { CattributeCreateComponent } from '../cattribute-create/cattribute-create.component';
import { CattributeUpdateComponent } from '../cattribute-update/cattribute-update.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  title = 'Clients';
  public clients: Client[] = [];
  public custom_attributes: Custom_Attribute[] = [];
  public selectedClientInfo: Client | null = null;
  public selectedCattInfo: Custom_Attribute | null = null;
  public filteredAttributes: any[] = [];
  public selectedClientId: number | null = null;
  public selectedCattId: number | null = null;
  public isLoading: boolean = false;
  public searchTerm: string = '';
  public filteredClients: Client[] = [];
  public isCreateClientOpen = false;
  public idEmployeeRole: number = 2;
  public username: string = '';

  constructor(private service: Service) { }

  ngOnInit() {
    this.idEmployeeRole = parseInt(localStorage.getItem('id_employee_role') || '0', 10);
    this.username = localStorage.getItem('username') || '';
    this.getAllClients();
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

  public getAllClients(): void {
    this.service.getAllClients().subscribe(
      (response: Client[]) => {
        this.clients = response;
        this.filteredClients = [...this.clients];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getSelectedClientInfo(client: Client): void {
    if (client && client.ID_CLIENT) {
      this.selectedClientId = client.ID_CLIENT;
      this.selectedClientInfo = { ...client };
      this.getCustomAttributes('CLIENT', client.ID_CLIENT);
    } else {
      alert('Error: ID_CLIENT is undefined for the selected client');
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
            this.logActivity(this.username, "removed a custom atribute from a", 'client');
          },
          (error: any) => {
            alert(error);
          }
        );
    } else {
      alert('Invalid ID: id_c_attribute is null');
    }
  }

  public deleteClient(id_client: number | null): void {
    if (id_client !== null) {
      this.service.deleteClient(id_client).subscribe(
        (response: any) => {
          const index = this.clients.findIndex(client => client.ID_CLIENT === id_client);
          if (index > -1) {
            this.clients.splice(index, 1);
            this.filteredClients = [...this.clients];
          }
          this.logActivity(this.username, "removed a", 'client');
        },
        (error: any) => {
          alert(error);
        }
      );
    } else {
      alert('Invalid ID: id_client is null');
    }
  }

  private filterAttributes(): void {
    this.filteredAttributes = this.custom_attributes.filter(attribute =>
      attribute.TABLE_NAME === 'CLIENT' && attribute.TABLE_ROW === this.selectedClientId
    );
  }

  public filterClients(): void {
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredClients = this.clients.filter(client =>
        client.NAME_.toLowerCase().includes(searchTermLower) ||
        client.EMAIL.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredClients = [...this.clients];
    }
  }

  @ViewChild('popupCreate') popupCreate!: ClientCreateComponent;
  @ViewChild('popupUpdate') popupUpdate!: ClientUpdateComponent;
  @ViewChild('popupCattCreate') popupCattCreate!: CattributeCreateComponent;
  @ViewChild('popupCattUpdate') popupCattUpdate!: CattributeUpdateComponent;
  showCreatePopup() {
    if (this.popupCreate) {
      this.popupCreate.open();
    }
  }

  public onClientCreated(): void {
    this.getAllClients();
    this.logActivity(this.username, "added a", 'client');
  }

  showUpdatePopup() {
    if (this.popupUpdate && this.selectedClientInfo) {
      this.popupUpdate.selectedClient = { ...this.selectedClientInfo };
      this.popupUpdate.open();
    } else {
      alert('Error: No client selected or popupUpdate component is not ready');
    }
  }

  public onClientUpdated(updatedClient: Client): void {
    const index = this.clients.findIndex(c => c.ID_CLIENT === updatedClient.ID_CLIENT);
    if (index > -1) {
      this.clients[index] = updatedClient;
      this.filteredClients = [...this.clients];
    }
    this.logActivity(this.username, "updated a", 'client');
  }

  showCattCreatePopup() {
    if (this.popupCattCreate && this.selectedClientInfo) {
      this.popupCattCreate.currentContext = 'CLIENT';
      this.popupCattCreate.selectedClient = { ...this.selectedClientInfo };
      this.popupCattCreate.open();
    } else {
      alert('Error: No client selected or popupCattCreate component is not ready');
    }
  }

  public onCustomAttributeCreated(): void {
    this.getCustomAttributes('CLIENT', this.selectedClientId!);
    this.logActivity(this.username, "created a custom attribute for a", 'client');
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
      this.getCustomAttributes('CLIENT', this.selectedClientId!);
    }
    this.logActivity(this.username, "updated a custom attribute for a", 'client');
  }
}
