import React from 'react'
import { Select } from '@/components/ui'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input'
import { cn } from '@/utils/cn'

interface CountryOption {
    value: string
    label: string
    callingCode: string
}

interface SearchableCountrySelectProps {
    value?: string
    onChange: (country: string) => void
    placeholder?: string
    className?: string
}

const SearchableCountrySelect: React.FC<SearchableCountrySelectProps> = ({
    value,
    onChange,
    placeholder = 'Select country',
    className,
}) => {
    // Get all countries and create options with UAE prioritized at the top
    const countryOptions: CountryOption[] = React.useMemo(() => {
        const countries = getCountries()
        const allOptions = countries.map((country) => {
            const callingCode = getCountryCallingCode(country)
            return {
                value: country,
                label: `${country} (+${callingCode})`,
                callingCode: `+${callingCode}`,
            }
        })

        // Find UAE and move it to the top
        const uaeIndex = allOptions.findIndex((option) => option.value === 'AE')
        if (uaeIndex > -1) {
            const uaeOption = allOptions.splice(uaeIndex, 1)[0]
            return [uaeOption, ...allOptions]
        }

        return allOptions
    }, [])

    // Find the selected option
    const selectedOption = countryOptions.find(
        (option) => option.value === value
    )

    const handleChange = (selectedOption: CountryOption | null) => {
        if (selectedOption) {
            onChange(selectedOption.value)
        }
    }

    return (
        <div className={cn(className, 'searchable-country-select')}>
            <Select
                isSearchable
                value={selectedOption}
                options={countryOptions}
                placeholder={placeholder}
                styles={{
                    control: (provided) => ({
                        ...provided,
                        border: 'none',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        minHeight: 'auto',
                        '&:hover': {
                            border: 'none',
                        },
                    }),
                    indicatorSeparator: () => ({
                        display: 'none',
                    }),
                    dropdownIndicator: (provided) => ({
                        ...provided,
                        padding: '4px',
                    }),
                }}
                isClearable={false}
                onChange={handleChange}
            />
        </div>
    )
}

export default SearchableCountrySelect
