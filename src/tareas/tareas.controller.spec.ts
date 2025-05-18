import { Test, TestingModule } from '@nestjs/testing';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';
import { Tarea } from './tarea.entity';

describe('TareasController', () => {
  let controller: TareasController;
  let service: TareasService;

  const mockTarea: Tarea = {
    id: 1,
    titulo: 'Test Tarea',
    contenido: 'Contenido de prueba',
    completado: false,
    fecha_creado: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockTarea),
    findAll: jest.fn().mockResolvedValue([mockTarea]),
    findOne: jest.fn().mockResolvedValue(mockTarea),
    update: jest.fn().mockResolvedValue(mockTarea),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TareasController],
      providers: [
        {
          provide: TareasService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TareasController>(TareasController);
    service = module.get<TareasService>(TareasService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create() debería crear una nueva tarea', async () => {
    const dto = { titulo: 'Test Tarea', contenido: 'Contenido de prueba' };
    const result = await controller.create(dto as any);
    expect(result).toEqual(mockTarea);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('findAll() debería devolver todas las tareas', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockTarea]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne() debería devolver una tarea por ID', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockTarea);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('update() debería actualizar una tarea', async () => {
    const dto = { titulo: 'Actualizado', contenido: 'Nuevo contenido', completado: true };
    const result = await controller.update('1', dto as any);
    expect(result).toEqual(mockTarea);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('remove() debería eliminar una tarea', async () => {
    const result = await controller.remove('1');
    expect(result).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
