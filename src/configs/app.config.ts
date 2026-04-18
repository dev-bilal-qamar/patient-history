export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
    enableMock: boolean
    /** Skip API; any email/password logs in as a dev user (turn off for production). */
    useHardcodedAuth: boolean
}

const appConfig: AppConfig = {
    apiPrefix: import.meta.env.VITE_BASE_URL,
    authenticatedEntryPath: '/dashboard',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/',
    locale: 'en',
    enableMock: false,
    useHardcodedAuth: true,
}

export default appConfig
