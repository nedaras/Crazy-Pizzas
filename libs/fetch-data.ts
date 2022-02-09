import type { ErrorResponse, Json } from '../@types'

export async function getData<T extends Json = Json>(url: string, auth?: string): Promise<T> {
    const request = await fetch(url, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(auth ? { Authorization: auth } : {}),
        },
    })
    return request.json()
}

export async function postData<T extends Json = Json>(url: string, data: Json): Promise<T> {
    const request = await fetch(`${url}`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': `application/json`,
            Accept: 'application/json',
        },
    })

    return request.json()
}

export const isResponseAnError = (object: Json | ErrorResponse): object is ErrorResponse => (object as ErrorResponse).status != null
