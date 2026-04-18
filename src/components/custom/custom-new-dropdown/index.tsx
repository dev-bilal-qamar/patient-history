'use client'
import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { useOnClickOutside } from 'usehooks-ts'
import { SlArrowUp, SlArrowDown } from 'react-icons/sl'
import { cn } from '@/utils/cn'
import { HiCheck } from 'react-icons/hi'

export type Props = {
    label: string
    value: string
    type: string
}

interface DropdownProps {
    options: Props[]
    selectedValue: string
    onSelect: (value: Props) => void
    error?: string
    placeholder: string
    outerClassName?: string
}

export const CustomNewDropdown: React.FC<DropdownProps> = ({
    options,
    selectedValue = null,
    onSelect,
    error,
    placeholder,
    outerClassName,
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    const handleOptionClick = (option: Props) => {
        onSelect(option)
        setIsOpen(false)
    }

    const selectedLabel = selectedValue ? selectedValue : ''

    useOnClickOutside(ref, () => setIsOpen(false))

    return (
        <div ref={ref} className="relative ">
            <div
                className={cn(
                    'w-full cursor-pointer rounded-lg border px-4 py-2 text-sm text-black focus:outline-none h-12 flex items-center bg-white',
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
                            selectedLabel === '' && 'text-black/20'
                        )}
                    >
                        {selectedLabel === '' ? (
                            <span className="uppercase">{placeholder}</span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span>{selectedLabel}</span>
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
                <div className="absolute top-11 z-[500] mt-2 w-full rounded-lg bg-white py-2 text-black border shadow-elevation-1 max-h-[400px] overflow-y-auto">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={clsx(
                                'word-break flex min-h-10 h-auto cursor-pointer items-center justify-between gap-3 px-4 hover:bg-[#302964]/[0.12] border-b last:border-b-0 py-2',
                                selectedValue === option.label &&
                                    'bg-gray-shade-11'
                            )}
                            onClick={() => handleOptionClick(option)}
                        >
                            <div className="w-full flex items-center gap-3 justify-between">
                                <p className="flex items-center tracking-tight leading-tight">
                                    {option.label}
                                </p>
                                {selectedValue === option.label && (
                                    <HiCheck className="text-primary-text text-xl" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
