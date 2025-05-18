import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTareaDto {
    @IsString()
    @IsNotEmpty({ message: 'The title is required' })
    titulo: string;

    @IsString()
    @IsNotEmpty({ message: 'The content is required' })
    contenido: string;  

    @IsString()
    @IsNotEmpty({ message: 'The content is required' })
    completado: boolean;

    @IsString()
    @IsNotEmpty({ message: 'The content is required' })
    fecha_creado: Date;
}
