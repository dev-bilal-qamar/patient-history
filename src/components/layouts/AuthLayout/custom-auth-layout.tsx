import CustomBaseModal from '@/components/custom/base-modal'
import clsx from 'clsx'
import React from 'react'

interface Props {
    children: React.ReactNode
}

const CustomAuthLayout: React.FC<Props> = ({ children }) => {
    return (
        <CustomBaseModal
            modalId={'auth-modal'}
            isOpen={true}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={false}
            modalContentClassName="min-h-[380px] h-auto flex items-center relative max-w-[448px] mt-14"
            onClose={() => console.log('close')}
        >
            <div className="w-full max-w-[374px] mx-auto flex h-full flex-col justify-center">
                <h1
                    className={clsx(
                        'mb-6 text-primary-text font-bold text-5xl font-comfortaa capitalize'
                    )}
                >
                    Login
                </h1>
                <div className="w-full">{children}</div>
            </div>
        </CustomBaseModal>
    )
}

export default CustomAuthLayout
