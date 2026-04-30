import * as authService from './auth.service.js';

export const login = async (req, res) => {
    try {
        const data = await authService.login(req.body);
        res.json(data);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};


export const refresh = async (req, res) => {
    try {
        const data = await authService.refresh(req.body.token);
        res.json(data);
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        const data = await authService.logout(req.body.token);
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};