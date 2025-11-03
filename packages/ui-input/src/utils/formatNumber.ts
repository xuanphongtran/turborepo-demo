/**
 * Format number.
 *
 * @param value - The string to format.
 * @returns The string after format.
 */
export const formatNumber = (value: string) => {
    return value.replace(/[^\d.]/g, '')
}
