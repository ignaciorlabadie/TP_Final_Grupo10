jest.mock('../models/entrenamiento.model', () => ({
  EntrenamientoModel: {
    countEntrenamientos: jest.fn(),
    sum: jest.fn(),
    findOne: jest.fn(),
  }
}));

jest.mock('../models/entrenamiento_ejercicio.model', () => ({
  EntrenamientoEjercicioModel: { findEjercicioMasFrecuente: jest.fn() }
}));

jest.mock('../models', () => ({
  sequelize: { fn: jest.fn(), col: jest.fn(), query: jest.fn().mockResolvedValue([]) }
}));

jest.mock('sequelize', () => ({
  QueryTypes: { SELECT: 'SELECT' }
}));

const { getEstadisticas } = require('../controllers/estadisticas.controller');
const { EntrenamientoModel } = require('../models/entrenamiento.model');
const { EntrenamientoEjercicioModel } = require('../models/entrenamiento_ejercicio.model');

const mockRes = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

describe('getEstadisticas', () => {
  test('responde 200 con todas las estadísticas', async () => {
    EntrenamientoModel.countEntrenamientos.mockResolvedValue(10);
    EntrenamientoModel.sum.mockResolvedValue(450);
    EntrenamientoModel.findOne.mockResolvedValue({ promedio: '45.5' });
    EntrenamientoEjercicioModel.findEjercicioMasFrecuente.mockResolvedValue({ nombre: 'Press banca', count: '5' });
    const req = { user: { id: 1 } };
    const res = mockRes();
    await getEstadisticas(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      total_entrenamientos: 10,
      tiempo_total_minutos: 450,
      promedio_duracion_minutos: 46,
    }));
  });
});
