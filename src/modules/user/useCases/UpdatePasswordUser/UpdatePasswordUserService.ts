import { injectable, inject } from 'tsyringe'
import { IHashProvider } from '@modules/user/shared/providers/HashProvider/models/IHashProvider'
import { IUserRepository } from '@modules/user/shared/repositories/IUserRepository'
import { IUserTokenRepository } from '@modules/user/shared/repositories/IUserTokenRepository'
import { IUserEntity } from '@modules/user/shared/models/entities/IUserEntity'
import { AppException } from '@shared/exceptions/AppException'
import { IUpdatePasswordDTO } from './IUpdatePasswordDTO'

@injectable()
class UpdatePasswordUserService {
    constructor(
        @inject('UserRepository') private _userRepository: IUserRepository,
        @inject('UserTokenRepository') private _userTokenRepository: IUserTokenRepository,
        @inject('HashProvider') private _hashProvider: IHashProvider
    ) {}

    public async execute(data: IUpdatePasswordDTO): Promise<IUserEntity> {
        const { current_password, new_password, owner_id } = data

        const existsUser = await this._userRepository.findOneById(owner_id)

        if (!existsUser) {
            throw new AppException('User not exists!', 404)
        }

        const userDataPassword = existsUser.password

        const isPasswordEquals: boolean = await this._hashProvider.compareHash(
            current_password,
            userDataPassword
        )

        if (!isPasswordEquals) {
            throw new AppException('Password different from registered user!', 400)
        }

        const generatedHashPassword: string = await this._hashProvider.gererateHash(new_password)

        /* Data updated */

        existsUser.password = generatedHashPassword

        /* End data updated */

        const savedUser = await this._userRepository.save(existsUser)

        /* Delete all tokens */

        await this._userTokenRepository.deleteTokensByOwnerId(owner_id)

        /* End delete all tokens */

        return savedUser
    }
}

export { UpdatePasswordUserService }
