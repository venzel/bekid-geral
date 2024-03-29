import { injectable, inject } from 'tsyringe'
import { formatDate } from '@shared/helpers/date'
import { IEmotionEntity } from '@modules/emotion/shared/models/entities/IEmotionEntity'
import { IEmotionRepository } from '@modules/emotion/shared/repositories/IEmotionRepository'
import { IEmotionReportRepository } from '@modules/emotion/shared/repositories/IEmotionReportRepository'
import { IGenerateIdProvider } from '@shared/providers/generateIdProvider/model/IGenerateIdProvider'
import { ICreateEmotionDTO } from '@modules/emotion/shared/dtos/ICreateEmotionDTO'
import { INotificationRepository } from '@modules/notification/shared/repositories/INotificationRepository'

@injectable()
class CreateEmotionService {
    constructor(
        @inject('EmotionRepository') private _emotionRepository: IEmotionRepository,
        @inject('EmotionReportRepository') private _emotionReportRepository: IEmotionReportRepository,
        @inject('NotificationRepository') private _notificationRepository: INotificationRepository,
        @inject('GenerateIdProvider') private _generateIdProvider: IGenerateIdProvider
    ) {}

    public async handle(data: ICreateEmotionDTO): Promise<IEmotionEntity> {
        const { type, description, owner_id } = data

        /* Generate emotion id provider */

        const generateEmotionId = this._generateIdProvider.generateId()

        /* End generate emotion id provider */

        const createdEmotion = await this._emotionRepository.create({
            emotion_id: generateEmotionId,
            type,
            description,
            owner_id,
        })

        const emotion_id = createdEmotion.id

        /* Create data report */

        await this._emotionReportRepository.create({ emotion_id, owner_id })

        /* Create notification */

        const content = `New emotion created in ${formatDate(new Date())}`

        console.log(content)

        await this._notificationRepository.create({ owner_id, content })

        /* Return the emotion created */

        return createdEmotion
    }
}

export { CreateEmotionService }
