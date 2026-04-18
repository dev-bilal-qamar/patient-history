import { cn } from '@/utils/cn'
import React, { HTMLAttributes, forwardRef } from 'react'

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
    element: 'tb' | 'th'
}

const TableRowComponent = forwardRef<HTMLTableRowElement, TableRowProps>(
    ({ className, element, ...props }, ref) => {
        if (element === 'th') {
            return (
                <tr
                    ref={ref}
                    className={cn(
                        'max-w-full h-14 border-b-[1.5px] border-black flex-grow text-left text-sm text-black bg-transparent',
                        className
                    )}
                    {...props}
                />
            )
        }
        return (
            <tr
                ref={ref}
                className={cn(
                    'max-w-full flex-grow border-b border-black/[12%] text-left text-sm text-black last:border-none bg-transparent h-[60px]',
                    className
                )}
                {...props}
            />
        )
    }
)

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
    element: 'td' | 'th'
}

export const TableCell: React.FC<TableCellProps> = ({
    element,
    className,
    ...props
}) => {
    if (element === 'th') {
        return (
            <th
                className={cn(
                    'min-w-[200px] flex-shrink-0 px-8 py-4 font-medium',
                    className
                )}
                {...props}
            />
        )
    }
    return (
        <td
            className={cn(
                'min-w-[200px] flex-shrink-0 px-8 py-2 font-medium text-black/[0.87]',
                className
            )}
            {...props}
        />
    )
}

TableRowComponent.displayName = 'TableRow'
export const TableRow = TableRowComponent
