import React from 'react'

interface CustomNumberInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    refocusOnScroll?: boolean
}

export const CustomNumberInput = React.forwardRef<
    HTMLInputElement,
    CustomNumberInputProps
>(({ refocusOnScroll = false, onChange, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow: backspace, delete, tab, escape, enter, home, end, left, right arrows
        if (
            [8, 9, 27, 13, 46, 35, 36, 37, 39].indexOf(e.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)
        ) {
            return
        }

        // Allow decimal point (keyCode 190 for period, 110 for numpad decimal)
        if (e.keyCode === 190 || e.keyCode === 110) {
            // Only allow decimal point if there isn't one already
            const currentValue = (e.target as HTMLInputElement).value
            if (currentValue.indexOf('.') === -1) {
                return // Allow the decimal point
            } else {
                e.preventDefault() // Prevent multiple decimal points
                return
            }
        }

        // Ensure that it is a number and stop the keypress if not
        if (
            (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
            (e.keyCode < 96 || e.keyCode > 105)
        ) {
            e.preventDefault()
        }

        // Call the original onKeyDown if provided
        if (onKeyDown) {
            onKeyDown(e)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow numbers and decimal point, but ensure only one decimal point
        let numericValue = e.target.value.replace(/[^0-9.]/g, '')

        // Ensure only one decimal point
        const parts = numericValue.split('.')
        if (parts.length > 2) {
            numericValue = parts[0] + '.' + parts.slice(1).join('')
        }

        // Create a new event with the cleaned value, preserving all target properties including 'name'
        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                value: numericValue,
                name: e.target.name, // Explicitly preserve the name attribute
            },
        }

        // Call the original onChange if provided
        if (onChange) {
            onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
        }
    }

    return (
        <input
            {...props}
            ref={ref}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onWheel={(e) => {
                const input = e.currentTarget
                // Prevent the input value change
                input.blur()

                // Prevent the page/container scrolling
                e.stopPropagation()

                // Refocus immediately, on the next tick (after the current function is done)
                if (refocusOnScroll) {
                    setTimeout(() => {
                        input?.focus()
                    }, 0)
                }
            }}
        />
    )
})
CustomNumberInput.displayName = 'CustomNumberInput'
