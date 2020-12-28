import { getRepository, Repository } from 'typeorm'
import { ICreateEmotionDTO } from '@modules/emotion/shared/dtos/ICreateEmotionDTO'
import { IEmotion } from '@modules/emotion/shared/entities/IEmotion'
import { PostgresEmotion } from '../entities/PostgresEmotion'
import { IEmotionRepository } from '@modules/emotion/shared/repositories/IEmotionRepository'

class PostgresEmotionRepository implements IEmotionRepository {
    private _repository: Repository<IEmotion>

    constructor() {
        this._repository = getRepository(PostgresEmotion, 'default')
    }

    public async findOneById(emotionId: string): Promise<IEmotion | undefined> {
        return await this._repository.findOne({ where: { id: emotionId, deletedAt: null } })
    }

    public async create(data: ICreateEmotionDTO): Promise<IEmotion> {
        const { emotion_id: id, owner_id, type, description } = data

        const emotionCreated = this._repository.create({ id, owner_id, type, description })

        await this._repository.save(emotionCreated)

        return emotionCreated
    }

    public async save(emotion: IEmotion): Promise<IEmotion> {
        const currentDate = new Date()

        emotion.updated_at = currentDate

        await this._repository.save(emotion)

        return emotion
    }

    public async delete(emotion: IEmotion): Promise<IEmotion> {
        const currentDate = new Date()

        emotion.deleted_at = currentDate

        await this.save(emotion)

        return emotion
    }

    public async list(): Promise<IEmotion[]> {
        return await this._repository.find()
    }
}

export { PostgresEmotionRepository }
