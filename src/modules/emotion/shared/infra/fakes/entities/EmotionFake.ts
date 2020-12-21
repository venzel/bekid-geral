import { IEmotion } from '@modules/emotion/shared/entities/IEmotion'
import { IUser } from '@modules/user/shared/entities/IUser'

class EmotionFake implements IEmotion {
    public id: string
    public owner_id: string
    public owner: IUser
    public emotion: string
    public description: string
    public created_at: Date
    public updated_at: Date
    public deleted_at: Date | null
}

export { EmotionFake }
