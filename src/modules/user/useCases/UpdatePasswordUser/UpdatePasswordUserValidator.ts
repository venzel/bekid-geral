import { Request, Response, NextFunction } from 'express'
import { isPasswordValid } from '@shared/libs/regex'
import { AppException } from '@shared/exceptions/AppException'

class UpdatePasswordUserValidator {
    public validate(req: Request, res: Response, next: NextFunction): any {
        const { current_password, new_password } = req.body

        if (!current_password || !isPasswordValid(current_password)) {
            throw new AppException('Current passoword invalid!', 400)
        }

        if (!new_password || !isPasswordValid(new_password)) {
            throw new AppException('New password invalid!', 400)
        }

        if (current_password === new_password) {
            throw new AppException('It is not possible to change to the same password!', 400)
        }

        return next()
    }
}

export { UpdatePasswordUserValidator }
