import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Employee } from '../employee';
import { Service } from '../service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})

export class UserUpdateComponent {
  @Input() title: string = 'Default Title';
  @Input() message: string = 'Default message.';
  @Input() selectedUser: Employee | null = null;
  @Output() userUpdated = new EventEmitter<Employee>();
  isOpen: boolean = false;
  @ViewChild('closeDiv') closeDiv!: ElementRef;
  @ViewChild('mainDiv') mainDiv!: ElementRef;
  constructor(private service: Service, private el: ElementRef) { }
  public passwordMatch: number | null = null;
  isDragging = false;
  mouseOffsetX = 0;
  mouseOffsetY = 0;

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

  public updateUser(fullname: string, username: string, pass_word: string, pass_word2: string): void {
    if (this.selectedUser && this.selectedUser.ID_EMPLOYEE) {
      const id_employee = this.selectedUser.ID_EMPLOYEE;
      if (pass_word === pass_word2) {
        this.service.updateUser(id_employee, fullname, username, pass_word)
          .subscribe(
            (response: any) => {

              if (this.selectedUser) {
                this.passwordMatch = null;
                this.selectedUser.FULLNAME = fullname;
                this.selectedUser.USERNAME = username;
                this.selectedUser.PASS_WORD = pass_word;

                this.userUpdated.emit(this.selectedUser);
                this.close();
              } else {
                alert('Error: selectedUser is null after update');
              }
            },
            (error: any) => {
              alert(error);
            }
          );
      } else {
        this.passwordMatch = 0;
      }
    } else {
      alert('Error: selectedUser or ID_EMPLOYEE is undefined');
    }
  }
}
