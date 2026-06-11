export interface InterfaceRutinaEjercicio {
  id: number;
  rutina_id: number;
  ejercicio_id: number;
  orden?: number;
  series?: number;
  repeticiones?: number;
  descanso_segundos?: number;
}