import CustomBaseModal from '@/components/custom/base-modal'
import clsx from 'clsx'
import React from 'react'
import { motion } from 'framer-motion'

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
            modalContentClassName="min-h-[450px] h-auto flex items-center relative max-w-[480px] mt-14 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 rounded-[2.5rem]"
            onClose={() => console.log('close')}
        >
            <div className="w-full max-w-[400px] mx-auto flex h-full flex-col justify-center py-4 px-2">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-6"
                >
                    <h1
                        className={clsx(
                            'mb-2 text-primary-text font-extrabold text-5xl font-comfortaa capitalize tracking-tight'
                        )}
                    >
                        Login
                    </h1>
                </motion.div>
                <div className="w-full">{children}</div>
            </div>
        </CustomBaseModal>
    )
}

export default CustomAuthLayout
