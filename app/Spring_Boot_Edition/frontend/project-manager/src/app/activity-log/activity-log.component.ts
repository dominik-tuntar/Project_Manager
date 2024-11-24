import { Component, OnInit } from '@angular/core';
import { Service } from '../service';
import { Activity } from '../activity';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.css'
})
export class ActivityLogComponent implements OnInit {
  public activity: Activity[] = [];
  ngOnInit(): void {
    this.getActivityLog();
  }
  constructor(private service: Service) { }
  public getActivityLog(): void {
    this.service.getActivityLog().subscribe(
      (response: Activity[]) => {
        this.activity = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
}
