export interface InterfaceEntrenamiento {
  id: number;
  rutina_id: number;
  user_id: number;
  fecha: Date;
  duracion_real?: number;
  notas?: string;
}
