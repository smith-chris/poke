const env = process.env.NODE_ENV

export const isDev = env === 'dev' || env === 'development' || env === undefined
export const isTest = env === 'test'
