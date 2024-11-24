import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Service } from '../service';
import { Custom_Attribute } from '../custom_attribute';
import { Client } from '../client';
import { Employee } from '../employee';
import { InboundRequest } from '../inbound_request';
import { Devproject } from '../devproject';

@Component({
  selector: 'app-cattribute-create',
  templateUrl: './cattribute-create.component.html',
  styleUrls: ['./cattribute-create.component.css']
})
export class CattributeCreateComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() selectedClient: Client | null = null;
  @Input() selectedUser: Employee | null = null;
  @Input() selectedIrequest: InboundRequest | null = null;
  @Input() selectedProject: Devproject | null = null;
  @Output() customAttributeCreated = new EventEmitter<Custom_Attribute>();
  isDragging = false;
  mouseOffsetX = 0;
  mouseOffsetY = 0;
  @ViewChild('closeDiv') closeDiv!: ElementRef;
  @ViewChild('mainDiv') mainDiv!: ElementRef;

  isOpen: boolean = false;
  currentContext: 'CLIENT' | 'EMPLOYEE' | 'IREQUEST' | 'DEVPROJECT' | 'DEFAULT' = 'DEFAULT';

  constructor(private service: Service, private el: ElementRef) { }

  open() {
    this.isOpen = true;
  }

  close() {
    this.title = '';
    this.content = '';
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

  public createCustomAttribute(): void {
    const [table_name, table_row] = this.getCreateParameters();
    if ((this.selectedClient || this.selectedUser || this.selectedIrequest || this.selectedProject && this.title && this.content)) {
      this.service.createCustomAttribute(table_name, table_row, this.title, this.content)
        .subscribe(
          (response: any) => {
            this.customAttributeCreated.emit(response);
            this.title = '';
            this.content = '';
            this.close();
          },
          (error: any) => {
            alert(error);
          }
        );
    }
  }

  public getCreateParameters(): [string, number] {
    if (this.currentContext === 'CLIENT' && this.selectedClient) {
      return ['CLIENT', this.selectedClient.ID_CLIENT];
    } else if (this.currentContext === 'EMPLOYEE' && this.selectedUser) {
      return ['EMPLOYEE', this.selectedUser.ID_EMPLOYEE];
    } else if (this.currentContext === 'IREQUEST' && this.selectedIrequest) {
      return ['IREQUEST', this.selectedIrequest.ID_I_REQUEST];
    } else if (this.currentContext === 'DEVPROJECT' && this.selectedProject) {
      return ['DEVPROJECT', this.selectedProject.ID_DEVPROJECT];
    } else {
      return ['DEFAULT', 0];
    }
  }
}
