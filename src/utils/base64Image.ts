/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * getBase64FromImageUrl
 *
 * @param {string} url - The URL of the image
 * @returns {Promise<string>} A promise that resolves to the Base64 data URL of the image
 */
export async function getBase64FromImageUrl(url: string): Promise<string> {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`)
        }

        // Detect MIME type from response headers
        const contentType = response.headers.get('content-type') || 'image/png'

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const base64String = buffer.toString('base64')

        // return a complete data URI
        return `data:${contentType};base64,${base64String}`
    } catch (error) {
        // Check if it's a CORS error
        if (error instanceof TypeError && error.message.includes('CORS')) {
            throw new Error(
                `CORS error: Unable to fetch image from ${url}. Please check CORS configuration.`
            )
        }
        throw error
    }
}

/**
 * getBase64FromImageUrlWithProxy - Alternative method for CORS-blocked images
 * Uses a CORS proxy service as fallback
 *
 * @param {string} url - The URL of the image
 * @param {boolean} useProxy - Whether to use proxy for CORS-blocked requests
 * @returns {Promise<string>} A promise that resolves to the Base64 data URL of the image
 */
export async function getBase64FromImageUrlWithProxy(
    url: string,
    useProxy = false
): Promise<string> {
    try {
        // First try direct fetch
        return await getBase64FromImageUrl(url)
    } catch (error) {
        if (useProxy && (error as Error).message.includes('CORS')) {
            console.warn(
                'Direct fetch failed due to CORS, trying with proxy...'
            )
            // Use a CORS proxy service (you can replace with your own proxy endpoint)
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
                url
            )}`
            return await getBase64FromImageUrl(proxyUrl)
        }
        throw error
    }
}

/**
 * getBase64FromImageUrlViaCanvas - Alternative method using Canvas (works for same-origin or CORS-enabled images)
 * This method loads the image in a canvas and extracts base64 data
 *
 * @param {string} url - The URL of the image
 * @returns {Promise<string>} A promise that resolves to the Base64 data URL of the image
 */
export async function getBase64FromImageUrlViaCanvas(
    url: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous' // This is important for CORS

        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            if (!ctx) {
                reject(new Error('Unable to get canvas context'))
                return
            }

            canvas.width = img.width
            canvas.height = img.height

            ctx.drawImage(img, 0, 0)

            try {
                // Extract base64 data (default is PNG)
                const dataUrl = canvas.toDataURL('image/png')
                resolve(dataUrl)
            } catch (error) {
                reject(
                    new Error(`Canvas tainted by cross-origin data: ${error}`)
                )
            }
        }

        img.onerror = () => {
            reject(new Error(`Failed to load image from ${url}`))
        }

        img.src = url
    })
}

/**
 * debugImageAccess - Test function to diagnose CORS and image access issues
 *
 * @param {string} url - The URL of the image to test
 * @returns {Promise<object>} A promise that resolves to diagnostic information
 */
export async function debugImageAccess(url: string): Promise<{
    fetchTest: {
        success: boolean
        error?: string
        headers?: Record<string, string>
    }
    imageTest: { success: boolean; error?: string }
    corsHeaders: Record<string, string | null>
}> {
    const result = {
        fetchTest: { success: false } as any,
        imageTest: { success: false } as any,
        corsHeaders: {} as Record<string, string | null>,
    }

    // Test 1: Direct fetch
    try {
        const response = await fetch(url, { method: 'HEAD' })
        result.fetchTest.success = response.ok

        // Collect CORS-related headers
        result.corsHeaders = {
            'access-control-allow-origin': response.headers.get(
                'access-control-allow-origin'
            ),
            'access-control-allow-methods': response.headers.get(
                'access-control-allow-methods'
            ),
            'access-control-allow-headers': response.headers.get(
                'access-control-allow-headers'
            ),
            'content-type': response.headers.get('content-type'),
        }

        const headers: Record<string, string> = {}
        response.headers.forEach((value, key) => {
            headers[key] = value
        })
        result.fetchTest.headers = headers
    } catch (error) {
        result.fetchTest.success = false
        result.fetchTest.error = (error as Error).message
    }

    // Test 2: Image element test
    return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'

        img.onload = () => {
            result.imageTest.success = true
            resolve(result)
        }

        img.onerror = () => {
            result.imageTest.success = false
            result.imageTest.error = 'Image failed to load'
            resolve(result)
        }

        img.src = url

        // Timeout after 10 seconds
        setTimeout(() => {
            if (
                !Object.prototype.hasOwnProperty.call(
                    result.imageTest,
                    'success'
                )
            ) {
                result.imageTest.success = false
                result.imageTest.error = 'Image load timeout'
                resolve(result)
            }
        }, 10000)
    })
}
