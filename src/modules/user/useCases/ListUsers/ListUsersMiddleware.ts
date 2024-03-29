import { Router } from 'express'
import { AuthenticateUserMiddleware } from '@modules/user/shared/middlewares/AuthenticateUserMiddleware'
import { RoleUserMiddleware } from '@modules/user/shared/middlewares/RoleUserMiddleware'
import { ListUsersValidator } from './ListUsersValidator'
import { ListUsersController } from './ListUsersController'

class ListUsersMiddleware {
    public register(router: Router, path: string): void {
        const { authenticate } = new AuthenticateUserMiddleware()
        const { role } = new RoleUserMiddleware()
        const { validate } = new ListUsersValidator()
        const { handle } = new ListUsersController()

        router.get(path, authenticate, role(['ADMIN']), validate, handle)
    }
}

export { ListUsersMiddleware }
