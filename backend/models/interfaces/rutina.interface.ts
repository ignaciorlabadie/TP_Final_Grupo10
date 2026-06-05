import { Model, Optional } from 'sequelize';

export interface InterfaceRutina {
  id: number;
  nombre: string;
  descripcion?: string;
  duracion_minutos?: number;
}

export interface RutinaCreationAttributes
  extends Optional<InterfaceRutina, 'id'> {}

export interface RutinaInstance
  extends Model<InterfaceRutina, RutinaCreationAttributes>,
    InterfaceRutina {}
