import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Task} from 'src/app/task.model';
import {TasksService} from '../../tasks.service';

@Component({
  selector: 'app-create-edit-task',
  templateUrl: './create-edit-task.component.html',
  styleUrls: ['./create-edit-task.component.scss']
})
export class CreateEditTaskComponent implements OnInit {
  public taskForm: FormGroup;
  public users = [];
  public task: Task | any;
  public readMode = false;

  constructor(public dialogRef: MatDialogRef<CreateEditTaskComponent>,
              public tasksService: TasksService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.task = data.task;
    this.readMode = data.readMode;
    this.taskForm = new FormGroup({
      title: new FormControl(this.task.title),
      dueDate: new FormControl(this.task.dueDate),
      priority: new FormControl(this.task.priority),
      assignedTo: new FormControl(this.task.assignedTo),
    });
    this.users = this.tasksService.users;
  }

  ngOnInit(): void {
    this.tasksService.usersFetchSubject.subscribe(() => {
      this.users = this.tasksService.users;
    });
  }

  onSubmit(): any {
    this.dialogRef.close(this.taskForm.value);
  }

}
