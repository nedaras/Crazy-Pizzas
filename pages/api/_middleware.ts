import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const method = request.method.toUpperCase()

    if (method !== 'GET')
        return NextResponse.json({
            status: 400,
            message: `dont accept "${method}" requests`,
        })
}
