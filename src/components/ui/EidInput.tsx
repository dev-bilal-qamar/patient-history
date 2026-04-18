import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui'

interface EidInputProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
    name?: string
    disabled?: boolean
    error?: boolean
}

const EidInput: React.FC<EidInputProps> = ({
    value = '',
    onChange,
    placeholder = 'Enter Emirates ID',
    className = '',
    name,
    disabled = false,
    error = false,
}) => {
    const [displayValue, setDisplayValue] = useState('')

    // Format the EID number as user types
    const formatEidInput = (input: string): string => {
        // Remove all non-digit characters
        const digitsOnly = input.replace(/\D/g, '')

        // Limit to 15 digits
        const limitedDigits = digitsOnly.slice(0, 15)

        // Apply formatting based on length
        if (limitedDigits.length <= 3) {
            return limitedDigits
        } else if (limitedDigits.length <= 7) {
            return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`
        } else if (limitedDigits.length <= 14) {
            return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(
                3,
                7
            )}-${limitedDigits.slice(7)}`
        } else {
            return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(
                3,
                7
            )}-${limitedDigits.slice(7, 14)}-${limitedDigits.slice(14)}`
        }
    }

    // Get raw digits from formatted value
    const getRawValue = (formattedValue: string): string => {
        return formattedValue.replace(/\D/g, '')
    }

    // Update display value when prop value changes
    useEffect(() => {
        if (value !== undefined) {
            const formatted = formatEidInput(value)
            setDisplayValue(formatted)
        }
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        const formatted = formatEidInput(inputValue)
        const rawValue = getRawValue(formatted)

        setDisplayValue(formatted)

        if (onChange) {
            // Pass the raw digits to the parent component
            onChange(rawValue)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow backspace, delete, tab, escape, enter
        if (
            [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)
        ) {
            return
        }
        // Ensure that it is a number and stop the keypress
        if (
            (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
            (e.keyCode < 96 || e.keyCode > 105)
        ) {
            e.preventDefault()
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedText = e.clipboardData.getData('text')
        const formatted = formatEidInput(pastedText)
        const rawValue = getRawValue(formatted)

        setDisplayValue(formatted)

        if (onChange) {
            onChange(rawValue)
        }
    }

    return (
        <Input
            type="text"
            name={name}
            value={displayValue}
            placeholder={placeholder}
            className={`font-mono tracking-wider ${className} ${
                error ? 'border-red-500 focus:border-red-500' : ''
            }`}
            disabled={disabled}
            maxLength={18} // 15 digits + 3 dashes
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
        />
    )
}

export default EidInput
