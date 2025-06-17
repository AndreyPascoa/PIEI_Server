import dotenv from 'dotenv';
import { Router } from 'express';
import { db } from '../controllers/database';
import bcrypt from "bcrypt";

const router = Router();

dotenv.config()

router.post('/register', async (req: any, res: any) => {
    const {nome, cargo, setor, password} = req.body;

    if(!nome || !cargo || !setor || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    try{
        await db.query(
            "INSERT INTO Usuario (nome, cargo, setor, password) VALUES (?, ?, ?, ?)",
            [nome, cargo, setor, password_hash]
        );
        res.status(201).json({ message: "User registered successfully" });
    }catch (error) {
        throw new Error(`Interval server error: ${error}`);
    }
})

export default router;