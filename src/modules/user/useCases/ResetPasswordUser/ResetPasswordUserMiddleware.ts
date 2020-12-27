import { Router } from 'express'
import { ResetPasswordUserValidator } from './ResetPasswordUserValidator'
import { ResetPasswordUserController } from './ResetPasswordUserController'

class ResetPasswordUserMiddleware {
    public register(router: Router, path: string): void {
        const { validator } = new ResetPasswordUserValidator()
        const { handle } = new ResetPasswordUserController()

        router.patch(path, validator, handle)
    }
}

export { ResetPasswordUserMiddleware }
