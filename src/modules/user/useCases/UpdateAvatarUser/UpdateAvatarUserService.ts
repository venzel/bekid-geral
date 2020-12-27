import { injectable, inject } from 'tsyringe'
import { IUserRepository } from '@modules/user/shared/repositories/IUserRepository'
import { IStorageProvider } from '@shared/providers/StorageProvider/models/IStorageProvider'
import { IUpdateAvatarUserDTO } from './IUpdateAvatarUserDTO'
import { IUser } from '@modules/user/shared/entities/IUser'
import { AppException } from '@shared/exceptions/AppException'

@injectable()
class UpdateAvatarUserService {
    constructor(
        @inject('UserRepository') private _userRepository: IUserRepository,
        @inject('StorageProvider') private _storageProvider: IStorageProvider
    ) {}

    public async execute(data: IUpdateAvatarUserDTO): Promise<IUser> {
        const { filename, owner_id } = data

        const existsUserWithId = await this._userRepository.findOneById(owner_id)

        if (!existsUserWithId) throw new AppException('User not exists!', 404)

        const { avatar } = existsUserWithId

        if (avatar) await this._storageProvider.deleteFile(avatar)

        const nameFileSaved: string = await this._storageProvider.saveFile(filename)

        /* Update data */

        existsUserWithId.avatar = nameFileSaved

        /* End update data */

        const savedUser = await this._userRepository.save(existsUserWithId)

        return savedUser
    }
}

export { UpdateAvatarUserService }
