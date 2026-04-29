const authService = require('./auth.service');

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const data = await authService.refresh(req.body.token);
    res.json(data);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const data = await authService.logout(req.body.token);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};