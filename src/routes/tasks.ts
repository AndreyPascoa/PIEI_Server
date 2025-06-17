import { Router } from "express";
import { db } from "../controllers/database";

const router = Router();

router.post("/tasks", async (req: any, res: any) => {
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
        nome, 
        color_text, 
        color_background, 
        status 
      FROM Categoria_Projeto 
      WHERE id_user = ?
      `,
      [user]
    );

    return res.status(200).json({ tasks: rows });
  } catch (error) {
    console.error("Erro ao buscar tasks:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
