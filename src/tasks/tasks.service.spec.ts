import { TaskStatus } from './task-status.enum';
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './task.repository';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'Test user',
  id: 'Test id',
  password: 'Test password',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls tasksRepository.getTasks() and returns its result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls tasksRepository.getTaskById() and returns its result', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test description',
        id: 'Test id',
        status: TaskStatus.OPEN,
      };
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('Test id', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('throws an error as task is not found', () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('Test id', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
