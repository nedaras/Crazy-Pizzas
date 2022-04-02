import type { ErrorResponse, Json } from '../@types'

const timeOutError: ErrorResponse = {
    status: 500,
    message: 'timed out',
}

export const getData = <T extends Json = Json>(url: string, auth?: string): Promise<T | ErrorResponse> =>
    new Promise(async (resolve) => {
        setTimeout(() => resolve(timeOutError), 30000)

        const request = await fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(auth ? { Authorization: auth } : {}),
            },
        })
        resolve(request.json())
    })

export const postData = <T extends Json = Json>(url: string, data: Json): Promise<T | ErrorResponse> =>
    new Promise(async (resolve) => {
        setTimeout(() => resolve(timeOutError), 3000)

        const request = await fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': `application/json`,
                Accept: 'application/json',
            },
        })

        resolve(request.json())
    })

export const isResponseAnError = (object: Json | ErrorResponse): object is ErrorResponse => (object as ErrorResponse).status != null
