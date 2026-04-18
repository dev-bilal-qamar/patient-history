import React, { useState } from 'react'

/**
 * StarRatingProps describes the props for our StarRating component.
 * - totalStars: How many stars to display (defaults to 5).
 * - initialRating: The initial rating value (defaults to 0).
 * - onRatingChange: Optional callback when user selects a rating.
 * - filledColor: The Tailwind (or custom) color class for filled stars.
 * - emptyColor: The Tailwind (or custom) color class for empty stars.
 */
interface StarRatingProps {
    totalStars?: number
    initialRating?: number
    onRatingChange?: (rating: number) => void
    filledColor?: string
    emptyColor?: string
    disabled?: boolean
}

const StarRating: React.FC<StarRatingProps> = ({
    totalStars = 5,
    initialRating = 0,
    onRatingChange,
    filledColor = 'text-yellow-500',
    emptyColor = 'text-gray-300',
    disabled = false,
}) => {
    // The current chosen rating in state
    const [rating, setRating] = useState<number>(initialRating)

    // The "hover" rating for preview before click
    const [hoverRating, setHoverRating] = useState<number>(0)

    // Handle click on a star (permanently set the rating)
    const handleClick = (value: number) => {
        if (disabled) return
        setRating(value)
        if (onRatingChange) {
            onRatingChange(value)
        }
    }

    // Handle mouse enter (hover effect)
    const handleMouseEnter = (value: number) => {
        if (disabled) return
        setHoverRating(value)
    }

    // Handle mouse leave (remove hover effect)
    const handleMouseLeave = () => {
        if (disabled) return
        setHoverRating(0)
    }

    return (
        <div className="flex items-center">
            {Array.from({ length: totalStars }, (_, i) => i + 1).map((star) => {
                // Determine if this star should appear filled
                const isFilled = hoverRating
                    ? star <= hoverRating
                    : star <= rating

                return (
                    <button
                        key={star}
                        type="button"
                        className="p-1 focus:outline-none"
                        aria-label={`Set rating to ${star} star${
                            star > 1 ? 's' : ''
                        }`}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => handleMouseEnter(star)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            className={`h-6 w-6 transition-colors ${
                                isFilled ? filledColor : emptyColor
                            }`}
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.116 3.43a1 1 0 00.95.69h3.646c.969 0 1.371 1.24.588 1.81l-2.95 2.15a1 1 0 00-.36 1.118l1.116 3.43c.3.92-.755 1.69-1.54 1.118L10 14.348l-2.94 2.126c-.784.57-1.839-.197-1.539-1.118l1.115-3.43a1 1 0 00-.36-1.118L4.326 8.857c-.783-.57-.38-1.81.588-1.81h3.646a1 1 0 00.951-.69l1.116-3.43z" />
                        </svg>
                    </button>
                )
            })}
        </div>
    )
}

export default StarRating
