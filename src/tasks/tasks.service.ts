import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/crate-task.dto';
import { TaskStatus } from './task-status.enum';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }

    return found;
  }
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const deleted = await this.taskRepository.delete({ id, userId: user.id });

    if (deleted.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }
  }

  async updateTask(updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.getTaskById(updateTaskDto.id, user);

    if (!task) {
      throw new NotFoundException(
        `Task with id ${updateTaskDto.id} not found!`,
      );
    }

    task.title = updateTaskDto.title;
    task.description = task.description;
    await task.save();

    return task;
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }

    task.status = status;
    await task.save();

    return task;
  }
}
