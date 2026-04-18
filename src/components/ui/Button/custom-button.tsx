import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import clsx from 'clsx'
import { CgSpinner } from 'react-icons/cg'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors  bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary-text text-white font-medium',
                destructive:
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline:
                    'relative cursor-pointer hover:bg-[#F9FAFB] border border-gray-300 bg-white text-gray-[#747474] transition group',
                white_bg:
                    'relative cursor-pointer border font-medium border-white/10 text-black transition duration-300 group overflow-hidden bg-white ',
                secondary:
                    'relative cursor-pointer border-2 font-medium border-primary-text text-primary-text transition duration-300 group overflow-hidden',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
    loading?: boolean
    iconinstart?: React.ReactNode
    iconinend?: React.ReactNode
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            loading = false,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                disabled={loading || props.disabled}
                {...props}
            >
                {loading ? (
                    <span className="flex items-center">
                        <CgSpinner className="h-5 w-5 animate-spin text-white" />
                    </span>
                ) : (
                    <>
                        {variant === 'secondary' ? (
                            <>
                                <span
                                    className={clsx(
                                        'absolute inset-0 h-full w-full origin-left scale-x-0 bg-primary-text transition-all duration-500 ease-out group-hover:scale-x-100'
                                    )}
                                ></span>
                                <span className="flex items-center">
                                    {props.iconinstart && (
                                        <span className="mr-2 z-10">
                                            {props.iconinstart}
                                        </span>
                                    )}
                                    <span className="relative transition duration-300 group-hover:text-white">
                                        {props.children}
                                    </span>
                                </span>
                            </>
                        ) : (
                            <span className="flex items-center">
                                {props.iconinstart && (
                                    <span className="mr-2">
                                        {props.iconinstart}
                                    </span>
                                )}
                                <span>{props.children}</span>
                            </span>
                        )}

                        {props.iconinend && (
                            <span className="ml-2">{props.iconinend}</span>
                        )}
                    </>
                )}
            </Comp>
        )
    }
)
CustomButton.displayName = 'Button'

export default CustomButton
