import React, { useState } from 'react'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa6'

interface CustomPaginationProps {
    totalPages: number
    onNext: () => void
    onBack: () => void
    index: number
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    totalPages,
    onNext,
    onBack,
    index,
}) => {
    const [currentPage, setCurrentPage] = useState(index + 1)

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1)
            onNext()
        }
    }

    const handleBack = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1)
            onBack()
        }
    }

    return (
        <div className="flex items-center justify-center space-x-4 py-4">
            <button
                className="flex items-center justify-center bg-primary-text/70 text-white font-semibold shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 size-10 rounded-full hover:bg-primary-text"
                disabled={currentPage === 1}
                onClick={handleBack}
            >
                <FaChevronLeft />
            </button>

            <div className="px-6 py-2 text-primary-text bg-gray-100 border border-primary-text rounded-lg shadow-sm font-medium">
                Page {currentPage} of {totalPages}
            </div>

            <button
                className="flex items-center justify-center bg-primary-text/70 text-white font-semibold shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 size-10 hover:bg-primary-text rounded-full"
                disabled={currentPage === totalPages}
                onClick={handleNext}
            >
                <FaChevronRight />
            </button>
        </div>
    )
}

export default CustomPagination
