import { container } from 'tsyringe'
import { IGenerateIdProvider } from './model/IGenerateIdProvider'
import { UUIDGenerateIdProvider } from './services/UUIDGenerateIdProvider'
import { RandomGenerateIdProvider } from './services/RandomGenerateIdProvider'

class GererateIdProviderStrategy {
    private _strategies: any = {}

    constructor() {
        this._strategies['uuid'] = () => UUIDGenerateIdProvider
        this._strategies['random'] = () => RandomGenerateIdProvider
    }

    public setStrategy(service: string): void {
        const existsStrategy = this._strategies.hasOwnProperty(service)

        if (!existsStrategy) {
            throw new Error('Service provider not found in strategies!')
        }

        container.registerSingleton<IGenerateIdProvider>(
            'GenerateIdProvider',
            this._strategies[service]()
        )
    }
}

export { GererateIdProviderStrategy }
