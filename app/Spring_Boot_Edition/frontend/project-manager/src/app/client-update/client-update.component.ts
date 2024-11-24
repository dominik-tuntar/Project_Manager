import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Client } from '../client';
import { Service } from '../service';

@Component({
  selector: 'app-client-update',
  templateUrl: './client-update.component.html',
  styleUrls: ['./client-update.component.css']
})
export class ClientUpdateComponent {
  @Input() selectedClient: Client | null = null;
  @Output() clientUpdated = new EventEmitter<Client>();
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
  }

  close() {
    this.isOpen = false;
  }

  updateClient(id_client: number, name: string, email: string): void {
    if (this.selectedClient && this.selectedClient.ID_CLIENT) {
      const id_client = this.selectedClient.ID_CLIENT;
      this.service.updateClient(id_client, name, email).subscribe(
        (response: any) => {
          if (this.selectedClient) {
            this.selectedClient.NAME_ = name;
            this.selectedClient.EMAIL = email;
            this.clientUpdated.emit(this.selectedClient);
            this.close();
          } else {
            alert('Error: selectedClient is null after update');
          }
        },
        (error: any) => {
          alert(error);
        }
      );
    } else {
      alert('Error: selectedClient or ID_CLIENT is undefined');
    }
  }
}
