import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/crate-task.dto';
import { TaskStatus } from './task-status.enum';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilter(filterDto: GetTasksFilterDto) {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter(task => task.status == status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       task =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }

    return found;
  }
  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: number): Promise<void> {    
    const deleted = await this.taskRepository.delete(id);        

    if(deleted.affected === 0){
      throw new NotFoundException(`Task with id ${id} not found!`);
    }
  }

  async updateTask(updateTaskDto: UpdateTaskDto): Promise<Task> {    
    const task = await this.getTaskById(updateTaskDto.id);

    if (!task) {
      throw new NotFoundException(`Task with id ${updateTaskDto.id} not found!`);
    }

    task.title = updateTaskDto.title;
    task.description = task.description;
    await task.save();

    return task;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }

    task.status = status;
    await task.save();
    
    return task;
  }
}
