export function numberToWords(num: number): string {
    if (num === 0) return 'zero'

    const belowTwenty = [
        '',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen',
    ]
    const tens = [
        '',
        '',
        'twenty',
        'thirty',
        'forty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety',
    ]
    const thousands = ['', 'thousand', 'million', 'billion', 'trillion']

    let words = ''
    let groupIndex = 0

    while (num > 0) {
        let chunk = num % 1000
        if (chunk !== 0) {
            let chunkWords = ''

            // Handle hundreds
            if (chunk >= 100) {
                chunkWords += belowTwenty[Math.floor(chunk / 100)] + ' hundred '
                chunk %= 100
            }

            // Handle tens and ones
            if (chunk >= 20) {
                chunkWords += tens[Math.floor(chunk / 10)] + ' '
                chunk %= 10
            } else if (chunk >= 10) {
                // for numbers between 10 and 19
                chunkWords += belowTwenty[chunk] + ' '
                chunk = 0
            }
            if (chunk > 0) {
                chunkWords += belowTwenty[chunk] + ' '
            }

            words = chunkWords + thousands[groupIndex] + ' ' + words
        }
        num = Math.floor(num / 1000)
        groupIndex++
    }

    return words.trim()
}
