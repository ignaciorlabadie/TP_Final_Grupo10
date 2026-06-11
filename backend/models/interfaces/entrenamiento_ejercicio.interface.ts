export interface InterfaceEntrenamientoEjercicio {
  id: number;
  entrenamiento_id: number;
  ejercicio_id: number;
  series_realizadas?: number;
  repeticiones_realizadas?: number;
  peso_usado?: number;
}