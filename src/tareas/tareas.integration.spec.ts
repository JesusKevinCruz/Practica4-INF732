// test/tareas/tareas.integration-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareasService } from '../../src/tareas/tareas.service';
import { TareasController } from '../../src/tareas/tareas.controller';
import { Tarea } from '../../src/tareas/tarea.entity';
import { CreateTareaDto } from '../../src/tareas/dto/create-tarea.dto';
import { UpdateTareaDto } from '../../src/tareas/dto/update-tarea.dto';

describe('TareasController + TareasService (Integración)', () => {
  let controller: TareasController;
  let service: TareasService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',         // o el usuario que uses en Laragon
          password: '',             // o tu contraseña
          database: 'tareas_test',  // el nombre de tu base de datos en Laragon
          entities: [Tarea],        // o tu ruta si usas glob, como __dirname + '/../**/*.entity{.ts,.js}'
          synchronize: true,        // ¡OJO! true solo para desarrollo/pruebas
        }),
        TypeOrmModule.forFeature([Tarea]),
      ],
      controllers: [TareasController],
      providers: [TareasService],
    }).compile();

    controller = moduleRef.get<TareasController>(TareasController);
    service = moduleRef.get<TareasService>(TareasService);
  });

  it('debe crear una tarea', async () => {
    const dto: CreateTareaDto = {
      titulo: 'Test',
      contenido: 'Contenido',
      completado: false,
      fecha_creado: new Date(),
    };

    const tarea = await controller.create(dto);
    expect(tarea).toHaveProperty('id');
    expect(tarea.titulo).toBe(dto.titulo);
  });

  it('debe retornar todas las tareas', async () => {
    const tareas = await controller.findAll();
    expect(Array.isArray(tareas)).toBe(true);
    expect(tareas.length).toBeGreaterThan(0);
  });

  it('debe actualizar una tarea', async () => {
    const tareas = await controller.findAll();
    const tareaId = tareas[0].id;

    const updateDto: UpdateTareaDto = {
      titulo: 'Actualizado',
      contenido: 'Nuevo contenido',
      completado: true,
      fecha_creado: new Date(),
    };

    const actualizada = await controller.update(tareaId.toString(), updateDto);
    expect(actualizada.titulo).toBe('Actualizado');
  });

  it('debe eliminar una tarea', async () => {
    const tareas = await controller.findAll();
    const tareaId = tareas[0].id;

    await controller.remove(tareaId.toString());

    await expect(controller.findOne(tareaId.toString())).rejects.toThrow();
  });
});
