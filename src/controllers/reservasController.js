import { pool } from "../db.js";

export async function reservar(req, res) {
  const { evento_id, usuario_id } = req.body;

  if (!evento_id || !usuario_id) {
    return res.status(400).json({ erro: "Dados inválidos" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `
      UPDATE eventos
      SET ingressos_disponiveis = ingressos_disponiveis - 1
      WHERE id = $1
      AND ingressos_disponiveis > 0
      RETURNING id
    `,
      [evento_id],
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(422).json({ erro: "Ingressos esgotados" });
    }

    await client.query(
      `
      INSERT INTO reservas (evento_id, usuario_id)
      VALUES ($1, $2)
    `,
      [evento_id, usuario_id],
    );

    await client.query("COMMIT");
    return res.status(201).json({ sucesso: true });
  } catch (err) {
    await client.query("ROLLBACK");
    return res.status(500).json({ erro: "Erro interno" });
  } finally {
    client.release();
  }
}
