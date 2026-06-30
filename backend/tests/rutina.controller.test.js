jest.mock('../models/rutina.model', () => ({
  RutinaModel: {
    findAllRutinas: jest.fn(),
    findById: jest.fn(),
    createRutina: jest.fn(),
    updateRutina: jest.fn(),
    deleteRutina: jest.fn(),
  }
}));

jest.mock('../models/rutina_ejercicio.model', () => ({
  RutinaEjercicioModel: { bulkCreate: jest.fn(), destroy: jest.fn() }
}));

jest.mock('../models/ejercicio.model', () => ({
  EjercicioModel: { findAll: jest.fn() }
}));

jest.mock('../models/entrenamiento.model', () => ({
  EntrenamientoModel: { count: jest.fn() }
}));

const { getAllRutinas, getRutinaById, postNewRutina, updateRutina, deleteRutina } = require('../controllers/rutina.controller');
const { RutinaModel } = require('../models/rutina.model');
const { RutinaEjercicioModel } = require('../models/rutina_ejercicio.model');
const { EjercicioModel } = require('../models/ejercicio.model');
const { EntrenamientoModel } = require('../models/entrenamiento.model');

const mockRes = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

describe('getAllRutinas', () => {
  test('responde 200 con rutinas', async () => {
    RutinaModel.findAllRutinas.mockResolvedValue([{ id: 1, nombre: 'Full body' }]);
    const res = mockRes();
    await getAllRutinas({ user: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('responde 404 si no hay rutinas', async () => {
    RutinaModel.findAllRutinas.mockResolvedValue([]);
    const res = mockRes();
    await getAllRutinas({ user: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('getRutinaById', () => {
  test('responde 200 si existe', async () => {
    RutinaModel.findById.mockResolvedValue({ id: 1, nombre: 'Full body' });
    const res = mockRes();
    await getRutinaById({ params: { id: 1 }, user: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('responde 404 si no existe', async () => {
    RutinaModel.findById.mockResolvedValue(null);
    const res = mockRes();
    await getRutinaById({ params: { id: 999 }, user: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('postNewRutina', () => {
  test('responde 201 al crear', async () => {
    EjercicioModel.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    RutinaModel.createRutina.mockResolvedValue({ id: 1, nombre: 'Full body' });
    RutinaModel.findById.mockResolvedValue({ id: 1, nombre: 'Full body', ejercicios: [] });
    const req = { user: { id: 1 }, body: { nombre: 'Full body', ejercicios: [{ ejercicio_id: 1 }, { ejercicio_id: 2 }] } };
    const res = mockRes();
    await postNewRutina(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('responde 400 si hay ids de ejercicio inválidos', async () => {
    EjercicioModel.findAll.mockResolvedValue([{ id: 1 }]);
    const req = { user: { id: 1 }, body: { nombre: 'Full body', ejercicios: [{ ejercicio_id: 1 }, { ejercicio_id: 999 }] } };
    const res = mockRes();
    await postNewRutina(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('updateRutina', () => {
  test('responde 200 al actualizar', async () => {
    RutinaModel.updateRutina.mockResolvedValue({ id: 1, nombre: 'Full body' });
    EjercicioModel.findAll.mockResolvedValue([{ id: 1 }]);
    RutinaModel.findById.mockResolvedValue({ id: 1, nombre: 'Full body actualizado' });
    const req = { params: { id: 1 }, user: { id: 1 }, body: { nombre: 'Full body actualizado', ejercicios: [{ ejercicio_id: 1 }] } };
    const res = mockRes();
    await updateRutina(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('responde 404 si no existe', async () => {
    RutinaModel.updateRutina.mockResolvedValue(null);
    const req = { params: { id: 999 }, user: { id: 1 }, body: { nombre: 'X' } };
    const res = mockRes();
    await updateRutina(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('deleteRutina', () => {
  test('responde 200 si se elimina', async () => {
    EntrenamientoModel.count.mockResolvedValue(0);
    RutinaModel.deleteRutina.mockResolvedValue(true);
    const res = mockRes();
    await deleteRutina({ params: { id: 1 }, user: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('responde 400 si tiene entrenamientos', async () => {
    EntrenamientoModel.count.mockResolvedValue(1);
    const res = mockRes();
    await deleteRutina({ params: { id: 1 }, user: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
