import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'
import { CreateEmotionService } from './CreateEmotionService'
import { generateStatus } from '@shared/helpers/status'

class CreateEmotionController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { owner_id } = req.auth

        const { type, description } = req.body

        const service = container.resolve(CreateEmotionService)

        const emotion = await service.handle({ type, description, owner_id })

        const status = generateStatus(false, 201, 'Succesfully created emotion!')

        const doc = classToClass(emotion)

        return res.status(201).json({ status, doc })
    }
}

export { CreateEmotionController }
