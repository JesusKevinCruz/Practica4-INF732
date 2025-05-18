import { Test, TestingModule } from '@nestjs/testing';
import { TareasService } from './tareas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tarea } from './tarea.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const tareaArray = [
  { id: 1, titulo: 'Tarea 1', contenido: 'Contenido 1', completado: false },
  { id: 2, titulo: 'Tarea 2', contenido: 'Contenido 2', completado: true },
];

describe('TareasService', () => {
  let service: TareasService;
  let repo: Repository<Tarea>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TareasService,
        {
          provide: getRepositoryToken(Tarea),
          useValue: {
            create: jest.fn().mockImplementation(dto => dto),
            save: jest.fn().mockImplementation(tarea => Promise.resolve({ id: 1, ...tarea })),
            find: jest.fn().mockResolvedValue(tareaArray),
            findOneBy: jest.fn().mockImplementation(({ id }) =>
              Promise.resolve(tareaArray.find(t => t.id === id) || null),
            ),
            preload: jest.fn().mockImplementation(dto =>
              Promise.resolve({ ...dto }),
            ),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<TareasService>(TareasService);
    repo = module.get<Repository<Tarea>>(getRepositoryToken(Tarea));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create() debería crear una tarea', async () => {
    const dto = { titulo: 'Nueva', descripcion: 'Descripción' };
    await expect(service.create(dto as any)).resolves.toEqual({
      id: 1,
      ...dto,
    });
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
  });

  it('findAll() debería devolver todas las tareas', async () => {
    await expect(service.findAll()).resolves.toEqual(tareaArray);
  });

  it('findOne() debería devolver una tarea por ID', async () => {
    await expect(service.findOne(1)).resolves.toEqual(tareaArray[0]);
  });

  it('findOne() lanza error si no existe la tarea', async () => {
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('update() debería actualizar una tarea existente', async () => {
    const dto = { titulo: 'Actualizada' };
    await expect(service.update(1, dto as any)).resolves.toEqual({ id: 1, ...dto });
  });

  it('update() lanza error si no encuentra la tarea', async () => {
    jest.spyOn(repo, 'preload').mockResolvedValue(undefined);
    await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
  });

  it('remove() debería eliminar una tarea existente', async () => {
    await expect(service.remove(1)).resolves.toBeUndefined();
  });

  it('remove() lanza error si no encuentra la tarea', async () => {
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);
    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
