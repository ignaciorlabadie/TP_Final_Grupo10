import { Model, Optional } from 'sequelize';

export interface InterfaceEntrenamiento {
  id: number;
  rutina_id: number;
  fecha: Date;
  duracion_real?: number;
  notas?: string;
}

export interface EntrenamientoCreationAttributes
  extends Optional<InterfaceEntrenamiento, 'id' | 'fecha'> {}

export interface EntrenamientoInstance
  extends Model<InterfaceEntrenamiento, EntrenamientoCreationAttributes>,
    InterfaceEntrenamiento {}
