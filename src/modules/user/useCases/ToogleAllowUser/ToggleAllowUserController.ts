import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'
import { ToggleAllowUserService } from './ToggleAllowUserService'
import { generateStatus } from '@shared/helpers/status'

class ToggleAllowUserController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const query_user_id = String(req.query.id)

        const service = container.resolve(ToggleAllowUserService)

        const user = await service.execute(query_user_id)

        const status = generateStatus(false, 200, 'Succesfully toggle allow user!')

        const doc = classToClass(user)

        return res.status(200).json({ status, doc })
    }
}

export { ToggleAllowUserController }
