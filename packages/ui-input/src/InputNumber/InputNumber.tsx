/* eslint-disable no-unused-vars */
'use client'

import { cn } from '../utils/cn'
import { formatNumber } from '../utils/formatNumber'
import { useEffect, useState, type ChangeEvent, type InputHTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import type { FieldValues, UseControllerProps } from 'react-hook-form'
import { useController } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    classNameInput?: string
    classNameError?: string
    id?: string
    nameLabel?: string
    classNameLabel?: string
    name: string
    onChangeValue?: (e: ChangeEvent<HTMLInputElement>) => void
    popupConfirm?: string
    numberConfirm?: number
    classNamePopup?: string
    t?: { txt_cancel: string; txt_confirm: string }
    tooltip?: ReactNode
    classNameTooltip?: string
    cancelButton?: ReactNode
    confirmButton?: ReactNode
    closeIcon?: ReactNode
}

export const InputNumber = <T extends FieldValues>({
    className,
    classNameInput,
    classNameError = 'absolute -bottom-5 left-0',
    id,
    placeholder,
    nameLabel,
    classNameLabel,
    name,
    control,
    onChangeValue,
    popupConfirm,
    numberConfirm,
    classNamePopup = 'min-w-[560px]',
    t,
    tooltip,
    classNameTooltip,
    defaultValue,
    cancelButton,
    confirmButton,
    closeIcon,
    ...restParams
}: UseControllerProps<T> & InputProps) => {
    const [openPopup, setOpenPopup] = useState(false)
    const [confirm, setConfirm] = useState(false)

    const {
        field: { onChange, value = '', ref },
        fieldState: { error }
    } = useController({ name, control, defaultValue: defaultValue })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '')
        const formattedValue = formatNumber(rawValue)

        if (!formattedValue) return onChange('')

        if (restParams?.min && Number(formattedValue) < Number(restParams?.min)) {
            return onChange(String(restParams?.min))
        }

        if (restParams?.max && Number(formattedValue) > Number(restParams?.max)) {
            return onChange(String(restParams?.max))
        }

        return onChange(formattedValue)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === '+' || e.key === '-') {
            e.preventDefault()
        }
    }

    const handleClosePopup = () => {
        setOpenPopup(false)
        onChange(restParams?.min)
    }

    useEffect(() => {
        if (Number(value) >= Number(numberConfirm) && !confirm && popupConfirm) {
            setOpenPopup(true)
        }
    }, [value])

    return (
        <div className={className}>
            <div className={`flex flex-col relative gap-2`}>
                {nameLabel && (
                    <div className='flex gap-1 w-fit'>
                        <label
                            htmlFor={id}
                            className={cn(
                                'font-semibold text-black text-14',
                                classNameLabel,
                                restParams.required && 'label-required'
                            )}
                            dangerouslySetInnerHTML={{ __html: nameLabel || '' }}
                        ></label>
                        {tooltip && <div className={classNameTooltip}>{tooltip}</div>}
                    </div>
                )}
                <input
                    onChange={(e) => {
                        handleChange(e)
                        onChangeValue && onChangeValue(e)
                    }}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        'text-md text-black border-gray-6 h-13 w-full appearance-none rounded-xl border px-2.5 placeholder:text-md placeholder:text-placeholder focus:outline-none focus:ring-0',
                        error && 'border-primary',
                        classNameInput
                    )}
                    placeholder={placeholder}
                    value={value}
                    type='number'
                    disabled={restParams.disabled || openPopup}
                    ref={ref}
                    {...restParams}
                />

                <style jsx>
                    {`
                        input::-webkit-outer-spin-button,
                        input::-webkit-inner-spin-button {
                            /* display: none; <- Crashes Chrome on hover */
                            -webkit-appearance: none;
                            margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
                        }

                        input[type='number'] {
                            -moz-appearance: textfield; /* Firefox */
                        }
                    `}
                </style>
                {error && (
                    <div
                        className={cn('text-primary text-sm', classNameError)}
                        dangerouslySetInnerHTML={{ __html: error?.message || '' }}
                    ></div>
                )}
            </div>
            {openPopup && popupConfirm && (
                <div className='fixed z-20 inset-0 w-dvw h-dvh'>
                    <div className='container flex justify-center items-center h-full'>
                        <div
                            className={`rounded-lg bg-white shadow-lg p-4 pt-6 lg:!p-6 lg:!pt-10 relative ${classNamePopup}`}
                        >
                            <div className='absolute top-2.5 right-2.5 cursor-pointer' onClick={handleClosePopup}>
                                {closeIcon || '×'}
                            </div>
                            <p className='text-16 leading-1-2 mb-4 lg:!mb-6'>
                                {popupConfirm.replace('|||value|||', value)}
                            </p>
                            <div className='flex justify-center gap-4 lg:!gap-6'>
                                {cancelButton ? (
                                    <div onClick={handleClosePopup}>{cancelButton}</div>
                                ) : (
                                    <button
                                        className='w-[120px] h-[40px] lg:!w-[160px] lg:!h-[48px] text-16 normal-case'
                                        onClick={handleClosePopup}
                                    >
                                        {t?.txt_cancel || 'Cancel'}
                                    </button>
                                )}
                                {confirmButton ? (
                                    <div
                                        onClick={() => {
                                            setOpenPopup(false)
                                            setConfirm(true)
                                        }}
                                    >
                                        {confirmButton}
                                    </div>
                                ) : (
                                    <button
                                        className='w-[120px] h-[40px] lg:!w-[160px] lg:!h-[48px] text-16 normal-case'
                                        onClick={() => {
                                            setOpenPopup(false)
                                            setConfirm(true)
                                        }}
                                    >
                                        {t?.txt_confirm || 'Confirm'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
