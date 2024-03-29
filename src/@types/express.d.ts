interface IAuth {
    owner_id: string
    role: string
    activated: boolean
}

declare namespace Express {
    export interface Request {
        auth: IAuth
    }
}
