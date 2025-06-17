import { Router } from "express";
import { db } from "../controllers/database";

const router = Router();

router.post('/cards', async (req: any, res: any) => {
    const { user } = req.body;

    if (!user) return res.status(400).json({ error: "User is required" });

    try {
        const [rows] = await db.query(
            `SELECT 
                    c.id,
                    c.title,
                    u.nome AS nome_usuario,
                    p.priority AS prioridade,
                GROUP_CONCAT(cp.nome) AS tags,
                GROUP_CONCAT(cp.color_text) AS color_texts,
                GROUP_CONCAT(cp.color_background) AS color_backgrounds
                FROM Cards c
                INNER JOIN Usuario u ON c.id_user = u.id_user
                LEFT JOIN Cards_Priority p ON c.id_priority = p.id_priority
                LEFT JOIN Categoria_Projeto cp ON cp.id_user = c.id_user
                WHERE c.id_user = ?
                GROUP BY c.id, c.title, u.nome, p.priority`,
            [user]
        );

        res.status(200).json({ cards: rows })
    } catch (error) {

    }
});

export default router;