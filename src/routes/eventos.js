import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nome, ingressos_disponiveis FROM eventos
    `)

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: 'Erro no banco' })
  }
})

export default router