import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'
import { UpdateEmotionService } from './UpdateEmotionService'
import { generateStatus } from '@shared/libs/utils'

class UpdateEmotionController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { owner_id } = req.auth

        const { emotion_id, description } = req.body

        const updateEmotionService = container.resolve(UpdateEmotionService)

        const emotion = await updateEmotionService.execute({ emotion_id, description, owner_id })

        const status = generateStatus(false, 201, 'Succesfully created emotion!')

        const doc = classToClass(emotion)

        return res.status(200).json({ status, doc })
    }
}

export { UpdateEmotionController }
