import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Service } from '../service';
import { Employee } from '../employee';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  @Input() title: string = 'Default Title';
  @Input() message: string = 'Default message.';
  @Output() userCreated = new EventEmitter<Employee>();
  public passwordMatch: number | null = null;
  isDragging = false;
  mouseOffsetX = 0;
  mouseOffsetY = 0;


  isOpen: boolean = false;
  @ViewChild('closeDiv') closeDiv!: ElementRef;
  @ViewChild('mainDiv') mainDiv!: ElementRef;
  constructor(private service: Service, private el: ElementRef) { }

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

  public createUser(fullname: string, username: string, pass_word: string, pass_word2: string): void {
    if (pass_word == pass_word2) {
      this.service.createUser(fullname, username, pass_word)
      .subscribe(
        (response: any) => {
          this.passwordMatch = null;

          
          this.userCreated.emit();
          this.close();
        },
        (error: any) => {
          alert(error);
        }
      );
    } else {
      this.passwordMatch = 0;
    }
    
  }
}
