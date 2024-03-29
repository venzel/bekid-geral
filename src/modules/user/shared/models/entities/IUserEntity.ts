interface IUserEntity {
    id: string
    name: string
    email: string
    password: string
    role: string
    avatar: string
    allowed: boolean
    activated: boolean
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}

export { IUserEntity }
