import React, { useEffect, useRef } from 'react'
import { useEventListener, useScreen, useOnClickOutside } from 'usehooks-ts'
import { cn } from '@/utils/cn'
import { ModalPortal } from './modal-portal'

interface Props {
    children?: React.ReactNode
    modalId: string
    isOpen: boolean
    onClose: () => void

    shouldCloseOnOverlayClick?: boolean
    shouldCloseOnEsc?: boolean

    modalClassName?: string
    modalContentClassName?: string
}

const CustomBaseModal: React.FC<Props> = ({
    modalId,
    isOpen,
    onClose,
    children,
    shouldCloseOnOverlayClick = true,
    shouldCloseOnEsc = true,
    modalClassName,
    modalContentClassName,
}) => {
    const htmlBodyRef = useRef<HTMLBodyElement | null>(null)
    const modalContentRef = useRef<HTMLDivElement>(null)
    const screen = useScreen()

    useEffect(() => {
        htmlBodyRef.current = document.body as HTMLBodyElement
    }, [])

    useEventListener(
        'keydown',
        (event: KeyboardEvent) => {
            if (event.key === 'Escape' && shouldCloseOnEsc) {
                onClose()
            }
        },
        htmlBodyRef
    )

    useEffect(() => {
        if (!htmlBodyRef.current) return
        if (isOpen) {
            htmlBodyRef.current.style.overflow = 'hidden'
        } else {
            htmlBodyRef.current.style.overflow = 'auto'
        }
    }, [isOpen])

    useOnClickOutside(modalContentRef, () => {
        if (!shouldCloseOnOverlayClick) return
        onClose()
    })

    if (!isOpen) return null

    return (
        <ModalPortal wrapperId={modalId}>
            <div
                className={cn(
                    'fixed inset-0 z-[1000] flex justify-center overflow-y-auto overflow-x-hidden font-outfit outline-none items-center',
                    modalClassName
                )}
            >
                <div
                    ref={modalContentRef}
                    className={cn(
                        'relative mx-2 flex-grow overflow-y-auto rounded-3xl bg-background px-6 py-4 max-w-[548px] bg-white shadow-card',
                        modalContentClassName
                    )}
                >
                    {children}
                </div>
            </div>
        </ModalPortal>
    )
}

export default CustomBaseModal
