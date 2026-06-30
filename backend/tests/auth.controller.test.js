jest.mock('../middleware/auth.middleware.js', () => ({
  generarToken: jest.fn(() => 'mock-token'),
}));

jest.mock('../models/user.model', () => ({
  UserModel: {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    findById: jest.fn(),
    findAllUsers: jest.fn(),
  }
}));

const { postRegister, postLogin, getPerfil, getAllUsers } = require('../controllers/auth.controller');
const { UserModel } = require('../models/user.model');

const mockRes = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

describe('postRegister', () => {
  test('crea usuario y responde 201', async () => {
    UserModel.findByEmail.mockResolvedValue(null);
    UserModel.createUser.mockResolvedValue({ id: 1, nombre: 'Test', email: 'test@test.com' });
    const req = { body: { nombre: 'Test', email: 'test@test.com', password: '123456' } };
    const res = mockRes();
    await postRegister(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('responde 400 si el email ya existe', async () => {
    UserModel.findByEmail.mockResolvedValue({ id: 1 });
    const req = { body: { nombre: 'Test', email: 'test@test.com', password: '123456' } };
    const res = mockRes();
    await postRegister(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'El email ya está registrado' });
  });
});

describe('postLogin', () => {
  test('login exitoso responde con message y token', async () => {
    UserModel.findByEmail.mockResolvedValue({ id: 1, nombre: 'Test', validatePassword: jest.fn().mockResolvedValue(true) });
    const req = { body: { email: 'test@test.com', password: '123456' } };
    const res = mockRes();
    await postLogin(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Login exitoso' }));
  });

  test('responde 401 si el usuario no existe', async () => {
    UserModel.findByEmail.mockResolvedValue(null);
    const req = { body: { email: 'no@existe.com', password: '123456' } };
    const res = mockRes();
    await postLogin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('responde 401 si la contraseña es inválida', async () => {
    UserModel.findByEmail.mockResolvedValue({ validatePassword: jest.fn().mockResolvedValue(false) });
    const req = { body: { email: 'test@test.com', password: 'wrong' } };
    const res = mockRes();
    await postLogin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('getPerfil', () => {
  test('responde con el usuario', async () => {
    UserModel.findById.mockResolvedValue({ id: 1, nombre: 'Test' });
    const req = { user: { id: 1 } };
    const res = mockRes();
    await getPerfil(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith({ user: { id: 1, nombre: 'Test' } });
  });

  test('responde 404 si no existe', async () => {
    UserModel.findById.mockResolvedValue(null);
    const req = { user: { id: 999 } };
    const res = mockRes();
    await getPerfil(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('getAllUsers', () => {
  test('responde 200 con la lista de usuarios', async () => {
    UserModel.findAllUsers.mockResolvedValue([{ id: 1, nombre: 'Test' }]);
    const req = {};
    const res = mockRes();
    await getAllUsers(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
