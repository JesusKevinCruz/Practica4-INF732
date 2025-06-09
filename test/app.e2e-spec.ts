import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('TareasController (e2e)', () => {
  let app: INestApplication;
  let createdId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const dataSource = app.get(getDataSourceToken());
    await dataSource.destroy(); // cierra conexión a la base de datos
    await app.close(); // cierra app
  });

  it('/tareas (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/tareas')
      .send({
        titulo: 'Tarea E2E',
        contenido: 'Contenido E2E',
        completado: false,
        fecha_creado: new Date(),
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.titulo).toBe('Tarea E2E');
    createdId = response.body.id;
  });

  it('/tareas (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/tareas').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/tareas/:id (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/tareas/${createdId}`).expect(200);
    expect(response.body).toHaveProperty('id', createdId);
  });

  it('/tareas/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/tareas/${createdId}`)
      .send({
        titulo: 'Tarea E2E Actualizada',
        contenido: 'Contenido actualizado',
        completado: true,
        fecha_creado: new Date(),
      })
      .expect(200);

    expect(response.body.titulo).toBe('Tarea E2E Actualizada');
  });

  it('/tareas/:id (DELETE)', async () => {
    await request(app.getHttpServer()).delete(`/tareas/${createdId}`).expect(200);
  });
});