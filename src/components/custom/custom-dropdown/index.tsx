'use client'
import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { useOnClickOutside } from 'usehooks-ts'
import { SlArrowUp, SlArrowDown } from 'react-icons/sl'
import { cn } from '@/utils/cn'

interface DropdownProps {
    options: {
        label: string
        value: string
    }[]
    selectedValue: string
    onSelect: (value: string) => void
    error?: string
    placeholder: string
    boxClassName?: string
    outerClassName?: string
    firstClassName?: string
}

export const CustomDropdown: React.FC<DropdownProps> = ({
    options,
    selectedValue = null,
    onSelect,
    error,
    placeholder,
    outerClassName,
    firstClassName,
    boxClassName,
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    const handleOptionClick = (option: string) => {
        onSelect(option)
        setIsOpen(false)
    }

    const selectedOption = options.find(
        (option) => option.value === selectedValue
    )
    const selectedLabel = selectedOption ? selectedOption.label : ''

    useOnClickOutside(ref, () => setIsOpen(false))

    return (
        <div ref={ref} className={cn('relative w-full', firstClassName)}>
            <div
                className={cn(
                    'w-full cursor-pointer rounded-lg border-[1.5px] px-4 py-2 text-sm text-black focus:outline-none h-12 flex items-center',
                    outerClassName,
                    isOpen ? 'border-primary-text' : 'border-gray-300',
                    error ? 'border-red-500' : ''
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between w-full">
                    <div
                        className={clsx(
                            'word-break',
                            selectedLabel === '' && 'text-[#a9a9a9]'
                        )}
                    >
                        {selectedLabel === '' ? (
                            <span className="capitalize">{placeholder}</span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span className="capitalize">
                                    {selectedLabel}
                                </span>
                            </span>
                        )}
                    </div>
                    {isOpen ? (
                        <SlArrowUp className="size-3 fill-primary-text" />
                    ) : (
                        <SlArrowDown className="size-3 fill-gray-400" />
                    )}
                </div>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
            {isOpen && (
                <div
                    className={cn(
                        'absolute top-11 z-[500] mt-2 w-full overflow-y-auto rounded-lg bg-white py-2 text-black border shadow-elevation-1',
                        boxClassName
                    )}
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={clsx(
                                'word-break flex h-10 cursor-pointer items-center justify-between gap-3 px-4 hover:bg-[#302964]/[0.12] border-b last:border-b-0',
                                selectedValue === option.value &&
                                    'bg-[#302964]/[0.12]'
                            )}
                            onClick={() => handleOptionClick(option.value)}
                        >
                            <p className="flex items-center">{option.label}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
