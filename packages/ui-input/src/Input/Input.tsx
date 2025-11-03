'use client'

import { cn } from '../utils/cn'
import { formatNumber } from '../utils/formatNumber'
import classNames from 'classnames'
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    errorMessage?: string | Record<string, unknown>
    classNameInput?: string
    classNameError?: string
    classNameIcon?: string
    id?: string
    nameLabel?: string
    classNameLabel?: string
    isEmail?: boolean
    isFullName?: boolean
    tooltip?: ReactNode
    classNameTooltip?: string
    emailIcon?: ReactNode
    fullNameIcon?: ReactNode
    viewIcon?: ReactNode
    hideIcon?: ReactNode
    // glbvisa props
    register?: UseFormRegister<Record<string, unknown>>
    rules?: RegisterOptions
    autocomplete?: string
    showCvvToolTips?: boolean
    inputIcon?: string | ReactNode
    cvvTooltip?: ReactNode
    variant?: '1ibc' | 'glbvisa'
}

enum INPUT_TYPES {
    text = 'text',
    password = 'password',
    email = 'email',
    number = 'number',
    tel = 'tel'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    {
        errorMessage,
        className,
        classNameInput,
        classNameError,
        classNameIcon = 'absolute top-10 right-3 cursor-pointer',
        id,
        placeholder,
        nameLabel,
        classNameLabel,
        isEmail,
        isFullName,
        tooltip,
        classNameTooltip,
        emailIcon,
        fullNameIcon,
        viewIcon,
        hideIcon,
        type,
        name,
        register,
        rules,
        autocomplete,
        showCvvToolTips,
        inputIcon,
        cvvTooltip,
        variant = '1ibc',
        ...restParams
    }: InputProps,
    ref
) {
    const [visible, setVisible] = useState(false)
    const registerResult = register && name ? register(name, rules) : null

    const toggleVisible = () => {
        setVisible((prev) => !prev)
    }

    const handleType = () => {
        if (type === INPUT_TYPES.password) {
            return visible ? INPUT_TYPES.text : INPUT_TYPES.password
        }

        return type
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/ {2,}/g, ' ')
        const formattedValue = formatNumber(rawValue)
        e.target.value = type === 'number' || type === 'tel' ? formattedValue : rawValue
    }

    // 1ibc variant
    if (variant === '1ibc') {
        const defaultClassNameError = classNameError || 'absolute -bottom-5 left-0'
        return (
            <div className={`${className} text-14`}>
                <div className='flex flex-col relative gap-2'>
                    {nameLabel && (
                        <div className='flex gap-1 w-fit'>
                            <label
                                htmlFor={id}
                                className={cn(
                                    'font-semibold text-black',
                                    classNameLabel,
                                    restParams.required && 'label-required'
                                )}
                                dangerouslySetInnerHTML={{ __html: nameLabel || '' }}
                            ></label>
                            {tooltip && <div className={classNameTooltip}>{tooltip}</div>}
                        </div>
                    )}
                    <input
                        ref={ref}
                        onChange={(e) => {
                            handleChange(e)
                            restParams?.onChange?.(e)
                        }}
                        type={handleType()}
                        className={cn(
                            'text-md text-black border-gray-6 h-13 w-full appearance-none rounded-xl border px-2.5 placeholder:text-md placeholder:text-placeholder focus:outline-none focus:ring-0',
                            (isEmail || isFullName) && 'pr-8',
                            errorMessage && 'border-primary',
                            classNameInput
                        )}
                        placeholder={placeholder}
                        {...restParams}
                    />

                    {/* eslint-disable-next-line react/no-unknown-property */}
                    <style jsx={true}>
                        {`
                            input::-webkit-outer-spin-button,
                            input::-webkit-inner-spin-button {
                                -webkit-appearance: none;
                                margin: 0;
                            }

                            input[type='number'] {
                                -moz-appearance: textfield;
                            }
                        `}
                    </style>
                    {errorMessage && (
                        <div
                            className={cn('text-primary', defaultClassNameError)}
                            dangerouslySetInnerHTML={{ __html: errorMessage }}
                        ></div>
                    )}
                    {type === INPUT_TYPES.password &&
                        (visible ? (
                            viewIcon ? (
                                <div onClick={toggleVisible} className={classNameIcon}>
                                    {viewIcon}
                                </div>
                            ) : null
                        ) : hideIcon ? (
                            <div onClick={toggleVisible} className={classNameIcon}>
                                {hideIcon}
                            </div>
                        ) : null)}
                </div>

                {isEmail && emailIcon && (
                    <div className='absolute right-2 h-5 w-5 cursor-pointer top-10'>{emailIcon}</div>
                )}

                {isFullName && fullNameIcon && (
                    <div className='absolute right-2 h-5 w-5 cursor-pointer top-10'>{fullNameIcon}</div>
                )}
            </div>
        )
    }

    // glbvisa variant
    return (
        <div className={className} data-te-input-wrapper-init>
            {nameLabel && (
                <div className='flex gap-[15px]'>
                    <label
                        htmlFor={id}
                        className={classNames('label-primary mb-2', classNameLabel, {
                            'label-required': restParams?.required
                        })}
                    >
                        {nameLabel}
                    </label>
                    {showCvvToolTips && cvvTooltip && (
                        <div className='relative'>{cvvTooltip}</div>
                    )}
                </div>
            )}
            <div className='relative'>
                <input
                    className={classNames('input-primary placeholder:text-gray-4', classNameInput, {
                        '!border-red-1': errorMessage,
                        '!pr-11': inputIcon,
                        'cursor-no-drop appearance-none !border-gray-11 bg-gray-7 !text-gray-5 outline-none': restParams.disabled
                    })}
                    {...registerResult}
                    {...restParams}
                    id={id}
                    type={handleType()}
                    placeholder={placeholder ? placeholder : ' '}
                    autoComplete={autocomplete}
                    disabled={restParams.disabled}
                    ref={registerResult?.ref || ref}
                    onChange={(e) => {
                        handleChange(e)
                        restParams?.onChange?.(e)
                    }}
                />
                {inputIcon && (
                    <div
                        className='absolute bottom-0 right-0 top-0 flex w-11 items-center justify-center'
                        dangerouslySetInnerHTML={
                            typeof inputIcon === 'string' ? { __html: inputIcon ?? '' } : undefined
                        }
                    >
                        {typeof inputIcon !== 'string' && inputIcon}
                    </div>
                )}
                {restParams.type === 'password' && visible && (
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer md:right-4'
                        onClick={toggleVisible}
                    >
                        <g id='Property 1=View'>
                            <path
                                id='Vector (Stroke)'
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M3.14663 11.5543C3.04928 11.6889 3 11.8444 3 12C3 12.1556 3.04928 12.3111 3.14663 12.4457C3.83003 13.3766 5.00157 14.7839 6.54301 15.951C8.08682 17.12 9.93661 18 12 18C14.0634 18 15.9132 17.12 17.457 15.951C18.9984 14.7839 20.17 13.3766 20.8534 12.4457C20.9507 12.3111 21 12.1556 21 12C21 11.8444 20.9507 11.6889 20.8534 11.5543C20.17 10.6234 18.9984 9.21609 17.457 8.04895C15.9132 6.88003 14.0634 6 12 6C9.93661 6 8.08682 6.88003 6.54301 8.04895C5.00157 9.21608 3.83003 10.6234 3.14663 11.5543ZM5.33571 6.45445C7.08746 5.12809 9.35325 4 12 4C14.6468 4 16.9125 5.12809 18.6643 6.45445C20.4172 7.78168 21.7205 9.35551 22.4674 10.3732L22.4702 10.377C22.8131 10.8489 23 11.4155 23 12C23 12.5845 22.8131 13.1511 22.4702 13.623L22.4674 13.6268C21.7205 14.6445 20.4172 16.2183 18.6643 17.5455C16.9125 18.8719 14.6468 20 12 20C9.35325 20 7.08746 18.8719 5.33571 17.5455C3.58283 16.2183 2.27948 14.6445 1.5326 13.6268L1.52984 13.623L1.52985 13.623C1.18689 13.1511 1 12.5845 1 12C1 11.4155 1.18689 10.8489 1.52985 10.377L1.53259 10.3732L1.5326 10.3732C2.27948 9.35551 3.58283 7.78168 5.33571 6.45445ZM12.0001 9.5C10.5076 9.5 9.36359 10.655 9.36359 12C9.36359 13.345 10.5076 14.5 12.0001 14.5C13.4925 14.5 14.6365 13.345 14.6365 12C14.6365 10.655 13.4925 9.5 12.0001 9.5ZM7.36359 12C7.36359 9.47901 9.47581 7.5 12.0001 7.5C14.5243 7.5 16.6365 9.47901 16.6365 12C16.6365 14.521 14.5243 16.5 12.0001 16.5C9.47581 16.5 7.36359 14.521 7.36359 12Z'
                                fill='#D4D4D4'
                            />
                        </g>
                    </svg>
                )}

                {restParams.type === 'password' && !visible && (
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer md:right-4'
                        onClick={toggleVisible}
                    >
                        <path
                            d='M21.0555 9.48249C19.0866 7.12249 15.9283 4.30249 12.0104 4.30249C11.2609 4.30249 10.4913 4.41249 9.73168 4.62249C9.20197 4.77249 8.89213 5.32249 9.04205 5.85249C9.19197 6.38249 9.74169 6.69249 10.2714 6.54249C10.8511 6.38249 11.4408 6.29249 12.0104 6.29249C15.3086 6.29249 18.1271 9.08249 19.5164 10.7525C20.146 11.5125 20.156 12.5825 19.5463 13.3425C19.3065 13.6425 19.0366 13.9525 18.7368 14.2725C18.357 14.6725 18.377 15.3125 18.7768 15.6825C18.9667 15.8625 19.2165 15.9525 19.4664 15.9525C19.7362 15.9525 19.9961 15.8425 20.196 15.6425C20.5358 15.2825 20.8356 14.9325 21.1055 14.6025C22.3148 13.1125 22.2948 10.9525 21.0655 9.47249L21.0555 9.48249Z'
                            fill='#D4D4D4'
                        />
                        <path
                            d='M8.05246 6.6425C8.02247 6.5625 8.00247 6.4825 7.9525 6.4025C7.82257 6.2125 7.64267 6.1025 7.45277 6.0325L5.71373 4.2925C5.32394 3.9025 4.68429 3.9025 4.3045 4.2925C3.91471 4.6825 3.91471 5.3125 4.3045 5.7025L5.52383 6.92249C4.64431 7.63249 3.79478 8.4725 2.96523 9.4525C1.71591 10.9325 1.67593 13.0225 2.86528 14.5425C4.37446 16.4625 7.56272 19.6925 11.9703 19.6925C13.6394 19.6925 15.2785 19.2125 16.8677 18.3025L18.2669 19.7125C18.4668 19.9125 18.7166 20.0025 18.9765 20.0025C19.2364 20.0025 19.4862 19.9025 19.6861 19.7125C20.0759 19.3225 20.0759 18.6925 19.6861 18.3025L8.06244 6.6525L8.05246 6.6425ZM10.0714 11.5025L12.5 13.9325C12.3401 13.9725 12.1702 14.0025 12.0003 14.0025C10.9009 14.0025 10.0014 13.1025 10.0014 12.0025C10.0014 11.8325 10.0314 11.6625 10.0714 11.5025ZM11.9603 17.7025C8.40227 17.7025 5.71373 14.9525 4.42443 13.3125C3.82476 12.5525 3.84475 11.4925 4.47441 10.7525C5.26398 9.8125 6.08353 9.0125 6.92307 8.3625L8.56217 10.0025C8.20236 10.6125 7.99249 11.2925 7.99249 12.0125C7.99249 14.2225 9.78152 16.0125 11.9903 16.0125C12.6999 16.0125 13.3896 15.8025 13.9892 15.4525L15.3785 16.8525C14.2491 17.4225 13.0997 17.7125 11.9503 17.7125L11.9603 17.7025Z'
                            fill='#D4D4D4'
                        />
                    </svg>
                )}
            </div>

            {errorMessage && (
                <div
                    className={`input-error ${classNameError ? classNameError : ''}`}
                    dangerouslySetInnerHTML={{ __html: errorMessage }}
                />
            )}
        </div>
    )
})
