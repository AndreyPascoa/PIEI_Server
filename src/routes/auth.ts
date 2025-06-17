import dotenv from 'dotenv';
import { Router } from 'express';
import { db } from '../controllers/database';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

dotenv.config();

router.post('/auth', async (req: any, res: any) => {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    try {
        const [rows]: any = await db.query("SELECT * FROM Usuario WHERE nome = ?", [user]);
        const dbUser = rows[0];

        if (!dbUser) {
            return res.status(401).json({ error: 'User not found' });
        }

        const match = await bcrypt.compare(password, dbUser.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        await db.query("UPDATE Usuario SET last_login = NOW() WHERE id_user = ?", [dbUser.id_user]);

        const token = jwt.sign(
            { id: dbUser.id_user, nome: dbUser.nome },
            process.env.JWT_SECRET as string,
            { expiresIn: '2h' }
        );

        const { password: dbPassword, ...safeUser } = dbUser;

        return res.status(200).json({
            message: "Login successful",
            token,
            user: safeUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
