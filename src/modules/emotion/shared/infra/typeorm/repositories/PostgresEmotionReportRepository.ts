import { MongoRepository, getMongoRepository } from 'typeorm'
import { IEmotionReport } from '@modules/emotion/shared/entities/IEmotionReport'
import { PostgresEmotionReport } from '../entities/PostgresEmotionReport'
import { IEmotionReportRepository } from '@modules/emotion/shared/repositories/IEmotionReportRepository'
import { ICreateEmotionReportDTO } from '@modules/emotion/shared/dtos/ICreateEmotionReportDTO'

class PostgresEmotionReportRepository implements IEmotionReportRepository {
    private _repository: MongoRepository<IEmotionReport>

    constructor() {
        this._repository = getMongoRepository(PostgresEmotionReport, 'mongo')
    }

    public async filterByOwnerId(owner_id: string): Promise<IEmotionReport[]> {
        return await this._repository.find({ owner_id, deleted_at: null })
    }

    public async create(data: ICreateEmotionReportDTO): Promise<IEmotionReport> {
        const { emotion_id, owner_id } = data

        const emotionReportCreated = this._repository.create({ emotion_id, owner_id })

        await this._repository.save(emotionReportCreated)

        return emotionReportCreated
    }

    public async save(emotionReport: IEmotionReport): Promise<IEmotionReport> {
        await this._repository.save(emotionReport)

        return emotionReport
    }

    public async delete(emotionReport: IEmotionReport): Promise<IEmotionReport> {
        const currentDate = new Date()

        emotionReport.deleted_at = currentDate

        await this._repository.save(emotionReport)

        return emotionReport
    }

    public async list(): Promise<IEmotionReport[]> {
        return this._repository.find()
    }
}

export { PostgresEmotionReportRepository }
