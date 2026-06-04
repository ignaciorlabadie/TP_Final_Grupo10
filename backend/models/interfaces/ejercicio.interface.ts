import { Model, Optional } from 'sequelize';

export interface InterfaceEjercicio {
  id: number;
  nombre: string;
  tipo: string;
}

export interface EjercicioCreationAttributes
  extends Optional<InterfaceEjercicio, 'id'> {}

export interface EjercicioInstance
  extends Model<InterfaceEjercicio, EjercicioCreationAttributes>,
    InterfaceEjercicio {}
