/**
 * Formats EID number to the standard UAE format: XXX-XXXX-XXXXXXX-X
 * @param eidNumber - The raw EID number string
 * @returns Formatted EID number or original string if invalid format
 */
export const formatEidNumber = (
    eidNumber: string | undefined | null
): string => {
    if (!eidNumber) return ''

    // Remove any existing dashes and spaces
    const cleanNumber = eidNumber.replace(/[-\s]/g, '')

    // Check if it's a valid 15-digit EID number
    if (cleanNumber.length === 15 && /^\d{15}$/.test(cleanNumber)) {
        // Format as XXX-XXXX-XXXXXXX-X
        return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(
            3,
            7
        )}-${cleanNumber.slice(7, 14)}-${cleanNumber.slice(14)}`
    }

    // Return original if not a valid 15-digit number
    return eidNumber
}
