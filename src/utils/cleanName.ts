/**
 * Cleans up name strings by removing multiple commas and replacing them with single spaces
 * @param name - The name string to clean
 * @returns Cleaned name string with commas replaced by spaces and extra spaces trimmed
 */
export const cleanName = (name: string | undefined | null): string => {
    if (!name) return ''

    return name
        .replace(/,+/g, ' ') // Replace one or more commas with a single space
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .trim() // Remove leading and trailing spaces
}
