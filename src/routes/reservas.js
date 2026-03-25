import { Router } from 'express'
import { reservar } from '../controllers/reservasController.js'

const router = Router()

router.post('/', reservar)

export default router