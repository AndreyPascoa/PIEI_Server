import { Router } from "express";
import { db } from "../controllers/database";

const router = Router();

router.post('/projeto', async (req: any, res: any) => {
    const { user } = req.body;

    if (!user) return res.status(400).json({ error: "User is required" });

    try {
        const [rows] = await db.query(
            `SELECT Projeto.name AS projeto, Categoria_Projeto.nome AS categoria
       FROM Projeto
       INNER JOIN Usuario ON Projeto.id_user = Usuario.id_user
       INNER JOIN Categoria_Projeto ON Projeto.categoria = Categoria_Projeto.id_categoria
       WHERE Usuario.id_user = ?`,
            [user]
        );

        res.status(200).json({ projetos: rows });
    } catch (error) {

    }
});

export default router;