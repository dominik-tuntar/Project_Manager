import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { InboundRequest } from '../inbound_request';
import { Service } from '../service';
import { Custom_Attribute } from '../custom_attribute';
import { IrequestCreateComponent } from '../irequest-create/irequest-create.component';
import { IrequestUpdateComponent } from '../irequest-update/irequest-update.component';
import { CattributeCreateComponent } from '../cattribute-create/cattribute-create.component';
import { CattributeUpdateComponent } from '../cattribute-update/cattribute-update.component';

@Component({
  selector: 'app-irequest',
  templateUrl: './irequest.component.html',
  styleUrls: ['./irequest.component.css']
})
export class IrequestComponent implements OnInit {
  title = 'Irequests';
  public irequests: InboundRequest[] = [];
  public custom_attributes: Custom_Attribute[] = [];
  public selectedIrequestInfo: InboundRequest | null = null;
  public selectedCattInfo: Custom_Attribute | null = null;
  public filteredAttributes: Custom_Attribute[] = [];
  public selectedIrequestId: number | null = null;
  public selectedCattId: number | null = null;
  public isLoading: boolean = false;
  public searchTerm: string = '';
  public filteredIrequests: InboundRequest[] = [];
  public isCreateIrequestOpen = false;
  public idEmployeeRole: number = 2;
  public username: string = '';

  constructor(private service: Service) { }

  ngOnInit() {
    this.idEmployeeRole = parseInt(localStorage.getItem('id_employee_role') || '0', 10);
    this.username = localStorage.getItem('username') || '';
    this.getAllIrequests();
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

  public getAllIrequests(): void {
    this.service.getAllInboundRequests().subscribe(
      (response: InboundRequest[]) => {
        this.irequests = response;
        this.filteredIrequests = [...this.irequests];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getSelectedIrequestInfo(irequest: InboundRequest): void {
    if (irequest && irequest.ID_I_REQUEST) {
      this.selectedIrequestId = irequest.ID_I_REQUEST;
      this.selectedIrequestInfo = { ...irequest };
      this.getCustomAttributes('IREQUEST', irequest.ID_I_REQUEST);
    } else {
      alert('Error: ID_IREQUEST is undefined for the selected irequest');
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
            this.logActivity(this.username, "deleted a custom attribute from an", 'inbound request');
          },
          (error: any) => {
            alert(error);
          }
        );
    } else {
      alert('Invalid ID: id_c_attribute is null');
    }
  }

  public deleteIrequest(id_i_request: number | null): void {
    if (id_i_request !== null) {
      this.service.deleteInboundRequest(id_i_request).subscribe(
        (response: any) => {
          const index = this.irequests.findIndex(irequest => irequest.ID_I_REQUEST === id_i_request);
          if (index > -1) {
            this.irequests.splice(index, 1);
            this.filteredIrequests = [...this.irequests];
          }
          this.logActivity(this.username, "deleted an", 'inbound request');
        },
        (error: any) => {
          alert(error);
        }
      );
    } else {
      alert('Invalid ID: id_irequest is null');
    }
  }

  private filterAttributes(): void {
    this.filteredAttributes = this.custom_attributes.filter(attribute =>
      attribute.TABLE_NAME === 'IREQUEST' && attribute.TABLE_ROW === this.selectedIrequestId
    );
  }

  public filterIrequests(): void {
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredIrequests = this.irequests.filter(irequest =>
        irequest.TITLE.toLowerCase().includes(searchTermLower) ||
        irequest.SENDER_NAME.toLowerCase().includes(searchTermLower) ||
        irequest.DESCRIPTION_.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredIrequests = [...this.irequests];
    }
  }

  @ViewChild('popupCreate') popupCreate!: IrequestCreateComponent;
  @ViewChild('popupUpdate') popupUpdate!: IrequestUpdateComponent;
  @ViewChild('popupCattCreate') popupCattCreate!: CattributeCreateComponent;
  @ViewChild('popupCattUpdate') popupCattUpdate!: CattributeUpdateComponent;
  showCreatePopup() {
    if (this.popupCreate) {
      this.popupCreate.open();
    }
  }

  public onIrequestCreated(): void {
    this.getAllIrequests();
    this.logActivity(this.username, "created an", 'inbound request');
  }

  showUpdatePopup() {
    if (this.popupUpdate && this.selectedIrequestInfo) {
      this.popupUpdate.selectedIrequest = { ...this.selectedIrequestInfo };
      this.popupUpdate.open();
    } else {
      alert('Error: No irequest selected or popupUpdate component is not ready');
    }
  }

  public onIrequestUpdated(updatedIrequest: InboundRequest): void {
    const index = this.irequests.findIndex(i => i.ID_I_REQUEST === updatedIrequest.ID_I_REQUEST);
    if (index > -1) {
      this.irequests[index] = updatedIrequest;
      this.filteredIrequests = [...this.irequests];
    }
    this.logActivity(this.username, "updated an", 'inbound request');
  }

  showCattCreatePopup() {
    if (this.popupCattCreate && this.selectedIrequestInfo) {
      this.popupCattCreate.currentContext = 'IREQUEST';
      this.popupCattCreate.selectedIrequest = { ...this.selectedIrequestInfo };
      this.popupCattCreate.open();
    } else {
      alert('Error: No irequest selected or popupCattCreate component is not ready');
    }
  }

  public onCustomAttributeCreated(): void {
    this.getCustomAttributes('IREQUEST', this.selectedIrequestId!);
    this.logActivity(this.username, "created a custom attribute for an", 'inbound request');
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
      this.getCustomAttributes('IREQUEST', this.selectedIrequestId!);
      this.logActivity(this.username, "updated a custom attribute for an", 'inbound request');
    }
  }
}
