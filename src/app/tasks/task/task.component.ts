import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TasksService} from '../../tasks.service';
import {CreateEditTaskComponent} from '../create-edit-task/create-edit-task.component';
import {ConfirmationComponent} from '../../confirmation/confirmation.component';
import {Task} from '../../task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  loading = false;
  @Input() item: Task;

  constructor(private tasksService: TasksService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  deleteTask(taskid): any {
    const dialogRef = this.dialog.open(ConfirmationComponent, {data: this.item.title});
    dialogRef.afterClosed().subscribe(shouldDelete => {
      if (shouldDelete) {
        this.loading = true;
        this.tasksService.deleteTask(taskid).subscribe(() => {
          const index = this.tasksService.tasks.findIndex(task => task.id === taskid);
          this.tasksService.tasks.splice(index, 1);
          this.tasksService.tasksFetchSubject.next();
          this.loading = false;
        });
      }
    });
  }

  editTask(currentTask): any {
    const dialogRef = this.dialog.open(CreateEditTaskComponent, {data: {task: currentTask, readMode: false}});
    dialogRef.afterClosed().subscribe(updatedTask => {
      if (updatedTask) {
        this.loading = true;
        this.tasksService.updateTask({...updatedTask, id: currentTask.id}).subscribe(response => {
          const index = this.tasksService.tasks.findIndex(task => task.id === currentTask.id);
          this.tasksService.tasks.splice(index, 1, {...updatedTask, id: currentTask.id});
          this.tasksService.tasksFetchSubject.next();
          this.loading = false;
        });
      }
    });
  }

  taskDetails(currentTask): any {
    if (this.dialog && this.dialog.openDialogs.length > 0) {
      return;
    }
    this.dialog.open(CreateEditTaskComponent, {data: {task: currentTask, readMode: true}});
  }

}
