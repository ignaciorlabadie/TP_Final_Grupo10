jest.mock('../models/entrenamiento.model', () => ({
  EntrenamientoModel: {
    findAllEntrenamientos: jest.fn(),
    findById: jest.fn(),
    createEntrenamiento: jest.fn(),
    deleteEntrenamiento: jest.fn(),
  }
}));

jest.mock('../models/entrenamiento_ejercicio.model', () => ({
  EntrenamientoEjercicioModel: { bulkCreate: jest.fn(), destroy: jest.fn() }
}));

jest.mock('../models/ejercicio.model', () => ({
  EjercicioModel: { findAll: jest.fn() }
}));

jest.mock('../models/rutina.model', () => ({
  RutinaModel: { findByPk: jest.fn() }
}));

const { getAllEntrenamientos, getEntrenamientoById, postNewEntrenamiento, deleteEntrenamiento } = require('../controllers/entrenamiento.controller');
const { EntrenamientoModel } = require('../models/entrenamiento.model');
const { RutinaModel } = require('../models/rutina.model');
const { EjercicioModel } = require('../models/ejercicio.model');

const mockRes = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

describe('getAllEntrenamientos', () => {
  test('responde 200 con entrenamientos', async () => {
    EntrenamientoModel.findAllEntrenamientos.mockResolvedValue([{ id: 1, fecha: '2024-01-01' }]);
    const res = mockRes();
    await getAllEntrenamientos({ user: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('responde 404 si no hay entrenamientos', async () => {
    EntrenamientoModel.findAllEntrenamientos.mockResolvedValue([]);
    const res = mockRes();
    await getAllEntrenamientos({ user: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('getEntrenamientoById', () => {
  test('responde 200 si existe', async () => {
    EntrenamientoModel.findById.mockResolvedValue({ id: 1, fecha: '2024-01-01' });
    const res = mockRes();
    await getEntrenamientoById({ params: { id: 1 }, user: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('responde 404 si no existe', async () => {
    EntrenamientoModel.findById.mockResolvedValue(null);
    const res = mockRes();
    await getEntrenamientoById({ params: { id: 999 }, user: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('postNewEntrenamiento', () => {
  test('responde 201 al crear', async () => {
    RutinaModel.findByPk.mockResolvedValue({ id: 1, nombre: 'Full body' });
    EntrenamientoModel.createEntrenamiento.mockResolvedValue({ id: 1 });
    EjercicioModel.findAll.mockResolvedValue([{ id: 1 }]);
    EntrenamientoModel.findById.mockResolvedValue({ id: 1, fecha: '2024-01-01' });
    const req = { user: { id: 1 }, body: { rutina_id: 1, ejercicios: [{ ejercicio_id: 1 }] } };
    const res = mockRes();
    await postNewEntrenamiento(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('responde 404 si la rutina no existe', async () => {
    RutinaModel.findByPk.mockResolvedValue(null);
    const req = { user: { id: 1 }, body: { rutina_id: 999, ejercicios: [] } };
    const res = mockRes();
    await postNewEntrenamiento(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('deleteEntrenamiento', () => {
  test('responde 200 si se elimina', async () => {
    EntrenamientoModel.deleteEntrenamiento.mockResolvedValue(true);
    const res = mockRes();
    await deleteEntrenamiento({ params: { id: 1 }, user: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('responde 404 si no existe', async () => {
    EntrenamientoModel.deleteEntrenamiento.mockResolvedValue(null);
    const res = mockRes();
    await deleteEntrenamiento({ params: { id: 999 }, user: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
