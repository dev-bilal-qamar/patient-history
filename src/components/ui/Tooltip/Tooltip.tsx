import { useState, useCallback, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { Popper, Reference, Manager } from 'react-popper'
import { motion, AnimatePresence } from 'framer-motion'
import Arrow from './Arrow'
import { Portal } from 'react-portal'
import { useConfig } from '../ConfigProvider'
import { theme } from 'twin.macro'
import type { CommonProps } from '../@types/common'
import type { ArrowPlacement } from './Arrow'
import type { State as PopperJsState } from '@popperjs/core'
import type { ReactNode } from 'react'

export interface TooltipProps extends CommonProps {
    isOpen?: boolean
    placement?: ArrowPlacement
    title: string | ReactNode
    wrapperClass?: string
}

const PopperElement = (props: {
    title: string | ReactNode
    open: boolean
    forceUpdate: () => Partial<PopperJsState>
}) => {
    const { title, forceUpdate, open } = props
    useEffect(() => {
        if (open) {
            forceUpdate()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])
    return <span>{title}</span>
}

const Tooltip = (props: TooltipProps) => {
    const {
        className,
        children,
        isOpen = false,
        placement = 'top',
        title,
        wrapperClass,
        ...rest
    } = props

    const [tooltipOpen, setTooltipOpen] = useState<boolean>(isOpen)
    const tooltipNode = useRef()
    const { themeColor, primaryColorLevel } = useConfig()
    const twColor = theme`colors` as Record<string, Record<string, string>>

    const tooltipBackground = `${themeColor}-${primaryColorLevel}`
    const tooltipDarkBackground = `${themeColor}-400`
    const themeHexColor =
        twColor?.[themeColor]?.[primaryColorLevel] || '#8b5cf6'

    const defaultTooltipClass =
        'tooltip rounded-2xl px-5 py-2 bg-white/18 dark:bg-white/12 backdrop-blur-3xl [backdrop-filter:saturate(160%)_blur(18px)] border border-white/35 text-primary-text dark:text-white shadow-[0_10px_28px_rgba(139,92,246,0.28),inset_0_1px_0_rgba(255,255,255,0.45)] font-semibold tracking-wide'

    const toggleTooltip = useCallback(
        (bool: boolean) => {
            if (!isOpen) {
                setTooltipOpen(bool)
            }
        },
        [isOpen]
    )

    return (
        <Manager>
            <Reference>
                {({ ref }) => (
                    <span
                        ref={ref}
                        className={classNames('tooltip-wrapper', wrapperClass)}
                        onMouseEnter={() => toggleTooltip(true)}
                        onMouseLeave={() => toggleTooltip(false)}
                    >
                        {children}
                    </span>
                )}
            </Reference>
            {tooltipOpen && (
                <Portal>
                    <Popper
                        placement={placement}
                        innerRef={(node) => (tooltipNode.current = node)}
                        modifiers={[
                            {
                                name: 'arrow',
                                options: {
                                    element: Arrow as unknown as HTMLElement,
                                },
                            },
                            { name: 'offset', options: { offset: [0, 7] } },
                        ]}
                        strategy={'fixed'}
                    >
                        {({ ref, style, ...popperProps }) => (
                            <AnimatePresence>
                                <motion.div
                                    ref={ref}
                                    className={classNames(
                                        defaultTooltipClass,
                                        className
                                    )}
                                    style={{
                                        ...style,
                                        boxShadow: `0 8px 28px ${themeHexColor}59, inset 0 1px 0 rgba(255,255,255,0.25)`,
                                    }}
                                    initial={{
                                        opacity: 0,
                                        visibility: 'hidden',
                                    }}
                                    animate={
                                        tooltipOpen
                                            ? {
                                                  opacity: 1,
                                                  visibility: 'visible',
                                              }
                                            : {
                                                  opacity: 0,
                                                  visibility: 'hidden',
                                              }
                                    }
                                    transition={{
                                        duration: 0.15,
                                        type: 'tween',
                                    }}
                                >
                                    <PopperElement
                                        open={tooltipOpen}
                                        title={title}
                                        {...rest}
                                        {...popperProps}
                                    />
                                    <Arrow
                                        placement={placement}
                                        color={tooltipBackground}
                                        colorDark={tooltipDarkBackground}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </Popper>
                </Portal>
            )}
        </Manager>
    )
}

Tooltip.displayName = 'Tooltip'

export default Tooltip
