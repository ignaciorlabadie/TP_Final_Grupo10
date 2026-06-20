const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_por_defecto';

function generarToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  // TODO: Extraer el token del header Authorization.
  // El formato es "Bearer <token>", hay que quedarse solo con la parte del token.
  // Pista: usar split(' ')
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  try {
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;  // Guardar los datos del usuario para el controlador
  next();  // Dejar pasar la petición
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { generarToken, verificarToken };
