jest.mock('../models/ejercicio.model', () => ({
  EjercicioModel: {
    findAllEjercicios: jest.fn(),
    findById: jest.fn(),
    createEjercicio: jest.fn(),
    updateEjercicio: jest.fn(),
    deleteEjercicio: jest.fn(),
    findByTipo: jest.fn(),
    countEjercicios: jest.fn(),
  }
}));

jest.mock('../models/rutina_ejercicio.model', () => ({
  RutinaEjercicioModel: { count: jest.fn() }
}));

jest.mock('../models/entrenamiento_ejercicio.model', () => ({
  EntrenamientoEjercicioModel: { count: jest.fn(), findAll: jest.fn() }
}));

jest.mock('../models/entrenamiento.model', () => ({
  EntrenamientoModel: {}
}));

const { getAllEjercicios, getEjercicioById, postNewEjercicio, updateEjercicio, deleteEjercicio, getProgresoEjercicio, getEjerciciosByTipo, getCountEjercicios } = require('../controllers/ejercicio.controller');
const { EjercicioModel } = require('../models/ejercicio.model');
const { RutinaEjercicioModel } = require('../models/rutina_ejercicio.model');
const { EntrenamientoEjercicioModel } = require('../models/entrenamiento_ejercicio.model');

const mockRes = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

describe('getAllEjercicios', () => {
  test('responde 200 con ejercicios', async () => {
    EjercicioModel.findAllEjercicios.mockResolvedValue([{ id: 1, nombre: 'Press banca' }]);
    const res = mockRes();
    await getAllEjercicios({}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('responde 404 si no hay ejercicios', async () => {
    EjercicioModel.findAllEjercicios.mockResolvedValue([]);
    const res = mockRes();
    await getAllEjercicios({}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('getEjercicioById', () => {
  test('responde 200 si existe', async () => {
    EjercicioModel.findById.mockResolvedValue({ id: 1, nombre: 'Press banca' });
    const res = mockRes();
    await getEjercicioById({ params: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('responde 404 si no existe', async () => {
    EjercicioModel.findById.mockResolvedValue(null);
    const res = mockRes();
    await getEjercicioById({ params: { id: 999 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('postNewEjercicio', () => {
  test('responde 201 al crear', async () => {
    EjercicioModel.createEjercicio.mockResolvedValue({ id: 1, nombre: 'Press banca', tipo: 'fuerza' });
    const res = mockRes();
    await postNewEjercicio({ body: { nombre: 'Press banca', tipo: 'fuerza' } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('updateEjercicio', () => {
  test('responde 200 al actualizar', async () => {
    EjercicioModel.updateEjercicio.mockResolvedValue({ id: 1, nombre: 'Press banca', tipo: 'fuerza' });
    const res = mockRes();
    await updateEjercicio({ params: { id: 1 }, body: { nombre: 'Press banca', tipo: 'fuerza' } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('responde 404 si no existe', async () => {
    EjercicioModel.updateEjercicio.mockResolvedValue(null);
    const res = mockRes();
    await updateEjercicio({ params: { id: 999 }, body: { nombre: 'X', tipo: 'Y' } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('deleteEjercicio', () => {
  test('responde 200 si se elimina', async () => {
    RutinaEjercicioModel.count.mockResolvedValue(0);
    EntrenamientoEjercicioModel.count.mockResolvedValue(0);
    EjercicioModel.deleteEjercicio.mockResolvedValue(true);
    const res = mockRes();
    await deleteEjercicio({ params: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('responde 400 si está en uso', async () => {
    RutinaEjercicioModel.count.mockResolvedValue(1);
    const res = mockRes();
    await deleteEjercicio({ params: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('responde 404 si no existe', async () => {
    RutinaEjercicioModel.count.mockResolvedValue(0);
    EntrenamientoEjercicioModel.count.mockResolvedValue(0);
    EjercicioModel.deleteEjercicio.mockResolvedValue(null);
    const res = mockRes();
    await deleteEjercicio({ params: { id: 999 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('getProgresoEjercicio', () => {
  test('responde 200 con progreso', async () => {
    EjercicioModel.findById.mockResolvedValue({ id: 1, nombre: 'Press banca' });
    EntrenamientoEjercicioModel.findAll.mockResolvedValue([{ series_realizadas: 3 }]);
    const res = mockRes();
    await getProgresoEjercicio({ params: { id: 1 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('getEjerciciosByTipo', () => {
  test('responde 200 con ejercicios filtrados', async () => {
    EjercicioModel.findByTipo.mockResolvedValue([{ id: 1, nombre: 'Press banca', tipo: 'fuerza' }]);
    const res = mockRes();
    await getEjerciciosByTipo({ params: { tipo: 'fuerza' } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('getCountEjercicios', () => {
  test('responde 200 con el total', async () => {
    EjercicioModel.countEjercicios.mockResolvedValue(5);
    const res = mockRes();
    await getCountEjercicios({}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ total: 5 });
  });
});
