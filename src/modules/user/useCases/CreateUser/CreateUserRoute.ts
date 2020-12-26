import { Router } from 'express'
import { CreateUserValidator } from './CreateUserValidator'
import { CreateUserController } from './CreateUserController'

class CreateUserRoute {
    public register(router: Router, path: string): void {
        const { validator } = new CreateUserValidator()
        const { handle } = new CreateUserController()

        router.post(path, validator, handle)
    }
}

export { CreateUserRoute }
