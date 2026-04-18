import Modal from 'react-modal'
import classNames from 'classnames'
import CloseButton from '../CloseButton'
import { motion } from 'framer-motion'
import { theme } from 'twin.macro'
import { useEffect, useRef } from 'react'
import useWindowSize from '../hooks/useWindowSize'
import type ReactModal from 'react-modal'
import type { MouseEvent } from 'react'

const DIALOG_ARROW_SCROLL_PX = 80

function isEditableKeyboardTarget(target: EventTarget | null): boolean {
    let el = target instanceof HTMLElement ? target : null
    while (el) {
        const tag = el.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
            return true
        }
        if (el.isContentEditable) {
            return true
        }
        el = el.parentElement
    }
    return false
}

/** First element in depth-first order that can scroll vertically (root or inner). */
function findVerticalScrollableElement(root: HTMLElement): HTMLElement | null {
    const isScrollable = (node: HTMLElement): boolean => {
        const { overflowY } = window.getComputedStyle(node)
        const oy =
            overflowY === 'auto' ||
            overflowY === 'scroll' ||
            overflowY === 'overlay'
        return oy && node.scrollHeight > node.clientHeight
    }

    if (isScrollable(root)) {
        return root
    }
    for (let i = 0; i < root.children.length; i++) {
        const found = findVerticalScrollableElement(
            root.children[i] as HTMLElement
        )
        if (found) {
            return found
        }
    }
    return null
}

export interface DialogProps extends ReactModal.Props {
    closable?: boolean
    contentClassName?: string
    height?: string | number
    onClose?: (e: MouseEvent<HTMLSpanElement>) => void
    width?: string | number
}

const Dialog = (props: DialogProps) => {
    const currentSize = useWindowSize()
    const dialogContentRef = useRef<HTMLDivElement>(null)

    const {
        bodyOpenClassName,
        children,
        className,
        closable = true,
        closeTimeoutMS = 150,
        contentClassName,
        height,
        isOpen,
        onClose,
        overlayClassName,
        portalClassName,
        style,
        width = 520,
        ...rest
    } = props

    useEffect(() => {
        if (!isOpen) {
            return
        }

        const previousBodyOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const handleWindowKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
                return
            }
            if (isEditableKeyboardTarget(e.target)) {
                return
            }

            const root = dialogContentRef.current
            if (!root) {
                e.preventDefault()
                return
            }

            const scrollEl = findVerticalScrollableElement(root)
            if (!scrollEl) {
                e.preventDefault()
                return
            }

            e.preventDefault()
            const delta =
                e.key === 'ArrowDown'
                    ? DIALOG_ARROW_SCROLL_PX
                    : -DIALOG_ARROW_SCROLL_PX
            scrollEl.scrollTop += delta
        }

        window.addEventListener('keydown', handleWindowKeyDown)

        return () => {
            document.body.style.overflow = previousBodyOverflow
            window.removeEventListener('keydown', handleWindowKeyDown)
        }
    }, [isOpen])

    const onCloseClick = (e: MouseEvent<HTMLSpanElement>) => {
        onClose?.(e)
    }

    const renderCloseButton = (
        <CloseButton
            absolute
            className="ltr:right-6 rtl:left-6"
            onClick={onCloseClick}
        />
    )

    const contentStyle = {
        content: {
            inset: 'unset',
        },
        ...style,
    }

    if (width !== undefined) {
        contentStyle.content.width = width

        if (
            typeof currentSize.width !== 'undefined' &&
            currentSize.width <=
                parseInt(theme`screens.sm`.split(/ /)[0].replace(/[^\d]/g, ''))
        ) {
            contentStyle.content.width = 'auto'
        }
    }
    if (height !== undefined) {
        contentStyle.content.height = height
    }

    const defaultDialogContentClass = 'dialog-content'

    const dialogClass = classNames(defaultDialogContentClass, contentClassName)

    return (
        <Modal
            className={{
                base: classNames('dialog', className as string),
                afterOpen: 'dialog-after-open',
                beforeClose: 'dialog-before-close',
            }}
            overlayClassName={{
                base: classNames('dialog-overlay', overlayClassName as string),
                afterOpen: 'dialog-overlay-after-open',
                beforeClose: 'dialog-overlay-before-close',
            }}
            portalClassName={classNames('dialog-portal', portalClassName)}
            bodyOpenClassName={classNames('dialog-open', bodyOpenClassName)}
            ariaHideApp={false}
            isOpen={isOpen}
            style={{ ...contentStyle }}
            closeTimeoutMS={closeTimeoutMS}
            {...rest}
        >
            <motion.div
                ref={dialogContentRef}
                className={dialogClass}
                initial={{ transform: 'scale(0.9)' }}
                animate={{
                    transform: isOpen ? 'scale(1)' : 'scale(0.9)',
                }}
            >
                {closable && renderCloseButton}
                {children}
            </motion.div>
        </Modal>
    )
}

Dialog.displayName = 'Dialog'

export default Dialog
