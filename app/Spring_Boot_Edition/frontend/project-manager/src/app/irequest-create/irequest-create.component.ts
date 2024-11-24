import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Service } from '../service';
import { InboundRequest } from '../inbound_request';

@Component({
  selector: 'app-irequest-create',
  templateUrl: './irequest-create.component.html',
  styleUrls: ['./irequest-create.component.css']
})
export class IrequestCreateComponent {
  @Input() title: string = 'Default Title';
  @Input() message: string = 'Default message.';
  @Output() irequestCreated = new EventEmitter<InboundRequest>();
  public emailError: string | null = null;
  isDragging = false;
  mouseOffsetX = 0;
  mouseOffsetY = 0;
  @ViewChild('closeDiv') closeDiv!: ElementRef;
  @ViewChild('mainDiv') mainDiv!: ElementRef;
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

  isOpen: boolean = false;

  constructor(private service: Service, private el: ElementRef) { }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.emailError = null;
  }

  public createIrequest(title: string, sender_name: string, description: string): void {
    this.service.createInboundRequest(title, sender_name, description).subscribe(
      (response: any) => {
        this.irequestCreated.emit();
        this.close();
      },
      (error: any) => {
        alert(error);
      }
    );
  }
}
