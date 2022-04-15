import type { ErrorResponse, Json } from '../@types'

const timeOutError: ErrorResponse = {
    error: 'Request timed out',
}

export const getData = <T extends Json = Json>(url: string, auth?: string): Promise<T> =>
    new Promise(async (resolve, reject) => {
        setTimeout(() => reject(timeOutError), 30000)

        const request = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(auth ? { Authorization: auth } : {}),
            },
        })
        request.ok ? resolve(request.json()) : reject(request.json())
    })

export const postData = <T extends Json = Json>(url: string, data: Json): Promise<T> =>
    new Promise(async (resolve, reject) => {
        setTimeout(() => reject(timeOutError), 30000)

        const request = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': `application/json`,
                Accept: 'application/json',
            },
        })
        request.ok ? resolve(request.json()) : reject(request.json())
    })
