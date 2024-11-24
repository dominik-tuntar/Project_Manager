import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { InboundRequest } from '../inbound_request';
import { Service } from '../service';

@Component({
  selector: 'app-irequest-update',
  templateUrl: './irequest-update.component.html',
  styleUrls: ['./irequest-update.component.css']
})
export class IrequestUpdateComponent {
  @Input() selectedIrequest: InboundRequest | null = null;
  @Output() irequestUpdated = new EventEmitter<InboundRequest>();
  isOpen: boolean = false;
  isDragging = false;
  mouseOffsetX = 0;
  mouseOffsetY = 0;
  @ViewChild('closeDiv') closeDiv!: ElementRef;
  @ViewChild('mainDiv') mainDiv!: ElementRef;

  constructor(private service: Service, private el: ElementRef) {}

  open() {
    this.isOpen = true;
  }

  close() {
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

  updateIrequest(id_i_request: number, title: string, sender_name: string, description: string): void {
    if(this.selectedIrequest && this.selectedIrequest.ID_I_REQUEST) {
      const id_i_request = this.selectedIrequest.ID_I_REQUEST;
      this.service.updateInboundRequest(id_i_request, title, sender_name, description).subscribe(
        (response: any) => {
          if(this.selectedIrequest) {
            this.selectedIrequest.TITLE = title;
            this.selectedIrequest.SENDER_NAME = sender_name;
            this.selectedIrequest.DESCRIPTION_ = description;
            this.irequestUpdated.emit(this.selectedIrequest);
            this.close();
          } else {
            alert('Error: selectedIrequest is null after update');
          }
        },
        (error: any) => {
          alert(error);
        }
      );
    } else {
      alert('Error: selectedIrequest or ID_CLIENT is undefined');
    }   
  }
}

