'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { TableCell } from '@/components/shared/table-component'
import CustomButton from '@/components/ui/Button/custom-button'

interface ApiKeyCellProps {
    apiKey: string
}

export function ApiKeyCell({ apiKey }: ApiKeyCellProps) {
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
    }

    const maskedKey = '•'.repeat(apiKey.length)

    return (
        <TableCell element="td" className="font-mono">
            <div className="flex items-center space-x-2">
                <span>{isVisible ? apiKey : maskedKey}</span>
                <CustomButton
                    size={'icon'}
                    variant="ghost"
                    aria-label={isVisible ? 'Hide API key' : 'Show API key'}
                    onClick={toggleVisibility}
                >
                    {isVisible ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </CustomButton>
            </div>
        </TableCell>
    )
}
