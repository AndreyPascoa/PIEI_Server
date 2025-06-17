import { Router, Request, Response } from "express";
import { db } from "../controllers/database";

const router = Router();

router.post('/notion', async (req: any, res: any) => {
    const { user } = req.body;

    if (user === undefined || user === null) {
        return res.status(400).json({ error: "User is required" });
    }

    if (isNaN(Number(user))) {
        return res.status(400).json({ error: "User must be a number" });
    }

    try {
        const [rows] = await db.query(
            `
            SELECT 
                n.id AS id_notion,
                n.name AS nome_notion,
                c.id_categoria,
                n.content AS content_notion,
                n.date AS date_notion,
                c.nome AS nome_categoria,
                c.status,
                c.color_text,
                c.color_background,
                c.id_user
            FROM Categoria_Notion cn
            JOIN Notion n ON cn.id_notion = n.id
            JOIN Categoria_Projeto c ON cn.id_categoria = c.id_categoria
            WHERE c.id_user = ?
            ORDER BY n.id, c.id_categoria;
            `,
            [user]
        );


        return res.status(200).json({ notions: rows });
    } catch (error) {
        console.error("Erro ao buscar notions:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
