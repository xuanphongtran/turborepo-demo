/* eslint-disable no-unused-vars */
'use client'

import { cn } from '../utils/cn'
import intlTelInput from 'intl-tel-input'
import 'intl-tel-input/build/css/intlTelInput.css'
import 'intl-tel-input/build/js/utils.js'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { FieldValues, Path, UseControllerProps, UseFormSetError } from 'react-hook-form'
import { useController } from 'react-hook-form'
import './style.css'

enum validationError {
    IS_POSSIBLE = 0,
    INVALID_COUNTRY_CODE = 1,
    TOO_SHORT = 2,
    TOO_LONG = 3,
    NOT_A_NUMBER = 4
}

const validationErrorMapping: { [key: number]: string } = {
    [validationError.IS_POSSIBLE]: 'IS_POSSIBLE',
    [validationError.INVALID_COUNTRY_CODE]: 'INVALID_COUNTRY_CODE',
    [validationError.TOO_SHORT]: 'TOO_SHORT',
    [validationError.TOO_LONG]: 'TOO_LONG',
    [validationError.NOT_A_NUMBER]: 'NOT_A_NUMBER'
}

interface PhoneInputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
    classNameInput?: string
    name: string
    nameCode?: string
    namePrefix?: string
    nameLabel?: string
    classNameLabel?: string
    className?: string
    classSpace?: string
    id?: string
    defaultValue?: string
    countryCodeSelected?: string
    classNameError?: string
    classNameIcon?: string
    placeholder?: string
    isEdit?: boolean
    isIconPhone?: boolean
    phoneIcon?: ReactNode
    getCookie?: (key: string) => string | undefined
    cookieKey?: string
}

export const PhoneInputNumber = <T extends FieldValues>({
    id,
    className,
    control,
    setError,
    nameLabel,
    classNameInput = '',
    classSpace,
    countryCodeSelected,
    name,
    nameCode,
    namePrefix,
    classNameLabel,
    classNameError = 'absolute -bottom-5 left-0',
    placeholder,
    isEdit = false,
    isIconPhone,
    classNameIcon,
    phoneIcon,
    getCookie,
    cookieKey = 'COUNTRY',
    ...restParams
}: UseControllerProps<T> & {
    setError: UseFormSetError<T>
} & PhoneInputNumberProps) => {
    const phoneRef = useRef<intlTelInput.Plugin | null>(null)
    const phoneCountryCodeName = nameCode || 'phone_country_code'
    const phoneCountryPrefixName = namePrefix || 'phone_prefix'
    const { field: phoneField, fieldState: phoneFieldState } = useController({ name, control })
    const { field: codeField } = useController({ name: phoneCountryCodeName as Path<T>, control })
    const { field: prefixField } = useController({ name: phoneCountryPrefixName as Path<T>, control })

    const [countryCode, setCountryCode] = useState<string | undefined>(undefined)

    useEffect(() => {
        const input = document.querySelector<HTMLInputElement>(id ? `#${id}` : '#signup-phone')

        if (input) {
            const initialCountry =
                countryCode ||
                countryCodeSelected ||
                (getCookie && cookieKey ? getCookie(cookieKey)?.toLowerCase() : undefined)

            phoneRef.current = intlTelInput(input, {
                separateDialCode: true,
                initialCountry: initialCountry,
                preferredCountries: [
                    countryCodeSelected || (getCookie && cookieKey ? getCookie(cookieKey)?.toLowerCase() : undefined)
                ].filter(Boolean) as string[]
            })

            if (phoneField.value) {
                phoneRef.current.setNumber(phoneField.value)
                phoneField.onChange(phoneField.value)

                const dialCode = phoneRef.current?.getSelectedCountryData()?.dialCode || ''
                const iso2 = phoneRef.current?.getSelectedCountryData()?.iso2 || ''

                prefixField.onChange(`+${dialCode}`)
                codeField.onChange(iso2)
            }

            setCountryCode('')

            const handlePhoneNumber = () => {
                let inputNumber = phoneRef.current?.getNumber() || ''
                const dialCode = phoneRef.current?.getSelectedCountryData()?.dialCode || ''
                const iso2 = phoneRef.current?.getSelectedCountryData()?.iso2 || ''

                setCountryCode(iso2)

                if (inputNumber.startsWith(`+${dialCode}`)) {
                    inputNumber = inputNumber.replace(`+${dialCode}`, '')
                    phoneRef.current?.setNumber(inputNumber)
                    phoneField.onChange(`+${dialCode}${inputNumber}`)
                } else {
                    phoneField.onChange(inputNumber)
                }

                prefixField.onChange(`+${dialCode}`)
                codeField.onChange(iso2)

                const error = phoneRef?.current?.getValidationError()

                if (error !== validationError.IS_POSSIBLE) {
                    return setError(phoneField.name, {
                        type: validationErrorMapping[error || validationError.NOT_A_NUMBER],
                        message: 'Please enter a valid number.'
                    })
                }

                if (!inputNumber.match(/^(\+)?\d+$/)) {
                    return setError(phoneField.name, {
                        type: validationErrorMapping[validationError.NOT_A_NUMBER],
                        message: 'Please enter a valid number.'
                    })
                }
            }

            input.setAttribute('placeholder', placeholder || '')
            input.addEventListener('blur', handlePhoneNumber)
            input.addEventListener('change', handlePhoneNumber)

            return () => {
                phoneRef.current?.destroy()
                input.removeEventListener('blur', handlePhoneNumber)
                input.removeEventListener('change', handlePhoneNumber)
            }
        }
    }, [phoneField.value])

    return (
        <div className={`${className} text-14`} data-te-input-wrapper-init>
            <div className={cn('relative flex flex-col gap-2', classSpace)}>
                <label
                    htmlFor={id ? id : 'signup-phone'}
                    className={cn('font-semibold text-black', restParams.required && 'label-required', classNameLabel)}
                >
                    {nameLabel}
                </label>
                <input
                    className={cn(
                        'text-md text-black border-gray-6 h-13 rounded-xl border px-2.5 placeholder:text-md placeholder:text-placeholder w-full appearance-none focus:outline-none focus:ring-0',
                        phoneFieldState?.error && 'border-primary',
                        isEdit && 'bg-gray-22',
                        classNameInput
                    )}
                    id={id ? id : 'signup-phone'}
                    maxLength={20}
                    pattern='[0-9]*'
                    type='tel'
                    inputMode='numeric'
                    formNoValidate
                    onKeyPress={(event) => {
                        if (!/[0-9+]/.test(event.key)) {
                            event.preventDefault()
                        }
                    }}
                    onPaste={(event) => {
                        const paste = event.clipboardData?.getData('text') || ''
                        const pasteFormat = paste.replace(/\s+/g, '')

                        if (!/^\+?\d+$/.test(pasteFormat)) {
                            event.preventDefault()
                        }
                    }}
                    {...restParams}
                />
                {isIconPhone && phoneIcon && (
                    <div className={cn('absolute h-5 w-5 cursor-pointer right-2 top-10', classNameIcon)}>
                        {phoneIcon}
                    </div>
                )}
                {phoneFieldState?.error && (
                    <div
                        className={cn('text-primary', classNameError)}
                        dangerouslySetInnerHTML={{ __html: String(phoneFieldState?.error.message) }}
                    ></div>
                )}
            </div>
        </div>
    )
}
