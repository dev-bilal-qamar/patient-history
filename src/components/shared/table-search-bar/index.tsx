import InputGroup from '@/components/ui/InputGroup'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { HiOutlineSearch } from 'react-icons/hi'
import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface TableSearchbarProps {
    children?: ReactNode
    className?: string
}

const TableSearchbar: React.FC<TableSearchbarProps> = ({
    children,
    className,
}) => {
    return (
        <div className={cn(className)}>
            <div className="w-full flex items-center gap-3">
                <InputGroup>
                    <Input placeholder="Input text to search" />
                    <Button icon={<HiOutlineSearch className="text-xl" />} />
                </InputGroup>
            </div>
            {children}
        </div>
    )
}

export default TableSearchbar
