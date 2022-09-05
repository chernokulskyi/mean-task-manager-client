import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TaskService } from "../../task.service";
import { Task } from "../../models/task.model";
import { List } from "../../models/list.model";

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
  lists: List[] = [];
  tasks: Task[] | undefined = [];

  selectedListId: string = '';

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['listId']) {
        this.selectedListId = params['listId'];
        this.taskService
          .getTasks(params['listId'])
          // @ts-ignore
          .subscribe((tasks: Task[]) => {
            this.tasks = tasks;
          });
      } else {
        this.tasks = undefined;
      }
    })

    // @ts-ignore
    this.taskService.getLists().subscribe((lists: List[]) => {
      this.lists = lists;
    })
  }

  onClick(task: Task) {
    this.taskService.complete(task).subscribe(() => {
      task.completed = !task.completed;
    });
  }

  onTaskDelete(event: MouseEvent, taskId: string) {
    event.stopPropagation();

    this.taskService
      .deleteTask(this.selectedListId, taskId)
      .subscribe((res: any) => {
        this.tasks = this.tasks?.filter((task) => task._id !== taskId);
      });
  }

  onDeleteList() {
    this.taskService
      .deleteList(this.selectedListId)
      .subscribe((res: any) => {
        this.router.navigateByUrl('/lists');
      });
  }
}
