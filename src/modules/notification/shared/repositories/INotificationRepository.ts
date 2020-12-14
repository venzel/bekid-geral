import { ICreateNotificationDTO } from '../dtos/ICreateNotificationDTO'
import { INotification } from '../entities/INotification'

interface INotificationRepository {
    findById(notificationId: string): Promise<INotification | undefined>
    create(data: ICreateNotificationDTO): Promise<INotification>
    save(notification: INotification): Promise<INotification>
    markAsRead(notification: INotification): Promise<INotification>
    list(): Promise<INotification[]>
}

export { INotificationRepository }