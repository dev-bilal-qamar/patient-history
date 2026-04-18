import clsx from 'clsx'
import React from 'react'

interface Option {
    label: string
    value: number
}

interface CustomRadioButtonsProps {
    options: Option[]
    selectedValue: number
    onChange: (value: number) => void
}

const CustomRadioButtons: React.FC<CustomRadioButtonsProps> = ({
    options,
    selectedValue,
    onChange,
}) => {
    return (
        <div className="flex space-x-4">
            {options.map((option) => (
                <div
                    key={option.label}
                    className={clsx(
                        'flex items-center cursor-pointer p-2 rounded-md',
                        selectedValue === option.value
                            ? 'bg-primary-text text-white'
                            : 'bg-gray-200 text-gray-700'
                    )}
                    onClick={() => onChange(option.value)}
                >
                    <div
                        className={clsx(
                            'w-5 h-5 rounded-full mr-2 border-2',
                            selectedValue === option.value
                                ? 'bg-white border-primary-text'
                                : 'border-gray-400'
                        )}
                    ></div>
                    {option.label}
                </div>
            ))}
        </div>
    )
}

export default CustomRadioButtons
