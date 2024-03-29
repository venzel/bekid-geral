import { Express } from 'express'
import { typeormConnect } from '@shared/infra/typeorm'

class Connection {
    public async use(app: Express): Promise<void> {
        await typeormConnect(app)
    }
}

const connection = new Connection()

export { connection }
