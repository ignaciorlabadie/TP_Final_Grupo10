import { Model, Optional } from 'sequelize';

export interface InterfaceRutinaEjercicio {
  id: number;
  rutina_id: number;
  ejercicio_id: number;
  orden?: number;
  series?: number;
  repeticiones?: number;
  descanso_segundos?: number;
}

export interface RutinaEjercicioCreationAttributes
  extends Optional<InterfaceRutinaEjercicio, 'id'> {}

export interface RutinaEjercicioInstance
  extends Model<InterfaceRutinaEjercicio, RutinaEjercicioCreationAttributes>,
    InterfaceRutinaEjercicio {}
