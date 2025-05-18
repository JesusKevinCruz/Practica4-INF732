import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TareasModule } from './tareas/tareas.module';
import { Tarea } from './tareas/tarea.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'tareas_db',
      entities: [Tarea],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TareasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
