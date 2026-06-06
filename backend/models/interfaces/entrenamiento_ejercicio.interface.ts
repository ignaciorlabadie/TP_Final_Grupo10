import { Model, Optional } from 'sequelize';

export interface InterfaceEntrenamientoEjercicio {
  id: number;
  entrenamiento_id: number;
  ejercicio_id: number;
  series_realizadas?: number;
  repeticiones_realizadas?: number;
  peso_usado?: number;
}

export interface EntrenamientoEjercicioCreationAttributes
  extends Optional<InterfaceEntrenamientoEjercicio, 'id'> {}

export interface EntrenamientoEjercicioInstance
  extends Model<InterfaceEntrenamientoEjercicio, EntrenamientoEjercicioCreationAttributes>,
    InterfaceEntrenamientoEjercicio {}
