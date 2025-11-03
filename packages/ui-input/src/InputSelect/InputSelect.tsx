/* eslint-disable no-unused-vars */
'use client'

import { useMounted } from '../hooks/useMounted'
import { cn } from '../utils/cn'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { FieldValues, UseControllerProps } from 'react-hook-form'
import { useController } from 'react-hook-form'
import type { DropdownIndicatorProps, GroupBase, InputProps, SelectInstance, StylesConfig } from 'react-select'
import { default as Select, components } from 'react-select'
import type { ReactNode } from 'react'

export interface SelectOptionProps {
    id?: string
    value: string | number
    label: string | number
    icon?: string
    state_count?: number
    source?: string | number
}

export type OptionType = SelectOptionProps

export interface GroupSelectOptions {
    label: string
    options: {
        label: string
        value: number
    }[]
}

type InputSelectOptions = SelectOptionProps[] | GroupSelectOptions[] | undefined

interface InputSelectProps {
    option: InputSelectOptions
    isSearchable?: boolean
    isDisabled?: boolean
    isLoading?: boolean
    isErrors?: boolean
    name: string
    nameLabel?: string
    className?: string
    classNamePrefix?: string
    onSelect?: (value: SelectOptionProps) => void
    classNameLabel?: string
    id: string
    isRequired?: boolean
    classNameError?: string
    placeholder?: string
    defaultValue?: {
        value: string
        label: string
    }
    isShowPlaceholder?: boolean
    controlStyle?: Record<string, unknown> | StylesConfig
    placeholderStyle?: Record<string, unknown>
    inputStyle?: Record<string, unknown>
    formatGroupLabel?: ({
        label,
        options
    }: {
        label: string
        options: { label: string; value: number }[]
    }) => React.ReactNode
    isLeadform?: boolean
    tooltip?: ReactNode
    classNameTooltip?: string
    variant?: '1ibc' | 'glbvisa'
    height?: string
    startIcon?: ReactNode
    filterOption?: (option: any, inputValue: string) => boolean
}

export const InputSelect = <T extends FieldValues>(props: UseControllerProps<T> & InputSelectProps) => {
    const selectInputRef = useRef<SelectInstance<InputSelectOptions, false, GroupBase<InputSelectOptions>>>(null)

    const {
        option,
        isLoading,
        isDisabled,
        isSearchable,
        isErrors,
        name,
        nameLabel,
        className,
        classNamePrefix,
        classNameLabel,
        id,
        isRequired,
        control,
        onSelect,
        placeholder,
        defaultValue,
        isShowPlaceholder = false,
        classNameError = 'absolute -bottom-5 left-0 whitespace-nowrap',
        controlStyle,
        placeholderStyle,
        inputStyle,
        isLeadform = false,
        tooltip,
        classNameTooltip,
        variant = '1ibc',
        height = '52px',
        startIcon,
        filterOption
    } = props

    const { field, fieldState } = useController({
        name: name,
        control,
        defaultValue: defaultValue
    })

    // Handle Hook Form Reset
    useEffect(() => {
        if (selectInputRef.current && field.value === undefined) {
            selectInputRef.current.clearValue()
        }
    }, [field.value])

    const loadIcon = (data: SelectOptionProps) => {
        if (!data.icon)
            return {
                margin: '0',
                padding: '0'
            }

        return {
            alignItems: 'center',
            display: 'flex',

            ':before': {
                background: `url(${data.icon}) no-repeat 0 0 / contain`,
                content: '" "',
                display: 'block',
                marginRight: 8,
                height: 18,
                width: 24,
                flexShrink: 0
            }
        }
    }

    const customStyles: StylesConfig = {
        control: (provided) => ({
            ...provided,
            width: '100%',
            height: variant === 'glbvisa' ? height : '52px',
            border:
                variant === 'glbvisa'
                    ? fieldState.error
                        ? '1px solid #e30a17'
                        : '1px solid #D4D4D4'
                    : isErrors || fieldState.error
                      ? '1px solid #C91F26'
                      : '1px solid #E0E0E0',
            ':hover': {
                border:
                    variant === 'glbvisa'
                        ? fieldState.error
                            ? '1px solid #e30a17'
                            : '1px solid #0061BD'
                        : isErrors || fieldState.error
                          ? '1px solid #C91F26'
                          : '1px solid #E0E0E0'
            },
            borderRadius: '12px',
            boxShadow: 'none',
            backgroundColor: isDisabled ? '#efefef4d' : 'white',
            ...(variant === 'glbvisa' && controlStyle ? controlStyle : controlStyle)
        }),
        dropdownIndicator: (provided, { selectProps }) =>
            variant === 'glbvisa'
                ? {
                      ...provided,
                      color: '#777777',
                      fill: '#777777'
                  }
                : {
                      ...provided,
                      transform: selectProps.menuIsOpen ? 'rotate(180deg)' : undefined,
                      transition: 'transform 0.2s ease-in-out',
                      color: '#3B3A3C',
                      fill: '#3B3A3C',
                      opacity: isDisabled ? 0 : 1,
                      padding: '12px'
                  },
        menu: (provided) => ({
            ...provided,
            margin: '0',
            boxShadow: variant === 'glbvisa' ? '0px 2px 10px 0px rgba(0, 0, 0, 0.10)' : '0px 2px 8px 0px rgba(0, 0, 0, 0.10)',
            zIndex: variant === 'glbvisa' ? 2 : 5,
            borderRadius: '12px'
        }),
        menuList: (provided) => ({
            ...provided,
            padding: variant === 'glbvisa' ? '4px 0' : '12px',
            overflowX: 'hidden',
            boxShadow: variant === 'glbvisa' ? undefined : '0px 2px 4px 0px rgba(0, 0, 0, 0.10)',
            borderRadius: '12px',
            fontSize: variant === 'glbvisa' ? '14px' : undefined,
            fontWeight: variant === 'glbvisa' ? '500' : undefined,
            ...(variant === 'glbvisa' && {
                '::-webkit-scrollbar': {
                    width: '8px'
                },
                '::-webkit-scrollbar-track': {
                    background: '#F4F5F7',
                    borderRadius: '12px'
                },
                '::-webkit-scrollbar-thumb': {
                    background: '#AFAFAF',
                    borderRadius: '12px'
                },
                '::-webkit-scrollbar-thumb:hover': {
                    background: '#acacac'
                }
            })
        }),
        option: (provided, { isSelected, data }) => {
            if (variant === 'glbvisa') {
                return {
                    ...provided,
                    padding: '10px 16px',
                    color: '#434343',
                    backgroundColor: isSelected ? '#E6F5FF' : 'white',
                    ':hover': {
                        backgroundColor: '#E6F5FF'
                    }
                }
            }
            return {
                ...provided,
                padding: '6px 12px',
                color: isSelected ? '#C91F26' : '#3B3A3C',
                fontSize: '16px',
                fontWeight: '400',
                lineHeight: '24px',
                borderRadius: '2px',
                marginLeft: (data as { isChildren: boolean }).isChildren ? '12px' : '0',
                backgroundColor: isSelected ? '#ffd7d7b0' : 'white',
                ':hover': {
                    backgroundColor: '#ffd7d7b0',
                    cursor: 'pointer',
                    color: '#C91F26',
                    fontWeight: '500'
                }
            }
        },
        valueContainer: (provided) => ({
            ...provided,
            padding: variant === 'glbvisa' && startIcon ? '0 10px 0 40px' : '0 10px',
            margin: '0',
            borderRadius: variant === 'glbvisa' ? '16px' : undefined,
            fontSize: variant === 'glbvisa' ? '14px' : undefined
        }),
        singleValue: (styles, { data }) => ({ ...styles, ...loadIcon(data as SelectOptionProps) }),
        input: (provided) => ({
            ...provided,
            margin: '0',
            padding: '0',
            color: variant === 'glbvisa' ? '#434343' : '#3B3A3C',
            fontSize: variant === 'glbvisa' ? undefined : '16px',
            fontWeight: variant === 'glbvisa' ? undefined : '400',
            lineHeight: variant === 'glbvisa' ? undefined : '1',
            ...inputStyle
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            display: 'none'
        }),
        placeholder: (provided) => ({
            ...provided,
            color: variant === 'glbvisa' ? '#909090' : '#646464',
            fontSize: variant === 'glbvisa' ? '14px' : '16px',
            fontWeight: variant === 'glbvisa' ? undefined : '400',
            lineHeight: variant === 'glbvisa' ? undefined : '1',
            opacity: variant === 'glbvisa' ? 1 : isShowPlaceholder ? 1 : 0,
            ...placeholderStyle
        }),
        ...(variant === 'glbvisa' && controlStyle)
    }

    const onChange = (selectedOption: unknown | SelectOptionProps) => {
        field.onChange(selectedOption)
        onSelect && onSelect(selectedOption as SelectOptionProps)
    }

    const isMounted = useMounted()

    useEffect(() => {
        if (defaultValue) {
            onChange(defaultValue)
        }
    }, [defaultValue])

    return (
        <>
            <div className='relative text-14'>
                <div className='relative flex flex-col gap-2'>
                    {nameLabel && (
                        <div className='flex gap-1 w-fit'>
                            <label
                                htmlFor={id}
                                className={cn(
                                    'font-semibold text-black',
                                    isRequired && 'label-required',
                                    classNameLabel
                                )}
                            >
                                {nameLabel}
                            </label>
                            {tooltip && <div className={classNameTooltip}>{tooltip}</div>}
                        </div>
                    )}
                    {isMounted && (
                        <Select
                            className={`${className ? className : ''} `}
                            styles={customStyles}
                            classNamePrefix={`${classNamePrefix ? classNamePrefix : ''}`}
                            defaultValue={defaultValue}
                            placeholder={placeholder}
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            isSearchable={isSearchable}
                            name={name}
                            options={option}
                            inputId={id}
                            required={isRequired}
                            onChange={(e) => onChange(e)}
                            value={variant === 'glbvisa' ? (!!field.value?.value && field.value) : field.value}
                            filterOption={variant === 'glbvisa' && filterOption ? filterOption : undefined}
                            components={{
                                DropdownIndicator: (props) => (
                                    <DropdownIndicator {...props} isLeadform={isLeadform} variant={variant} />
                                ),
                                Option: IconOption,
                                Input,
                                ...(variant === 'glbvisa' && startIcon
                                    ? { Control: (props: any) => <ControlWithIcon {...props} startIcon={startIcon} /> }
                                    : {})
                            }}
                            onBlur={() => field && field.onBlur()}
                            ref={selectInputRef as never}
                            menuShouldScrollIntoView={true}
                            // defaultMenuIsOpen={true}
                        />
                    )}
                </div>
                {fieldState.error && (
                    <div
                        className={
                            variant === 'glbvisa'
                                ? `input-error ${classNameError ? classNameError : ''}`
                                : `text-primary ${classNameError}`
                        }
                        dangerouslySetInnerHTML={variant === 'glbvisa' ? undefined : { __html: fieldState.error.message as string }}
                    >
                        {variant === 'glbvisa' ? fieldState.error.message : null}
                    </div>
                )}
            </div>
        </>
    )
}

const DropdownIndicator: React.FC<DropdownIndicatorProps & { isLeadform?: boolean; variant?: '1ibc' | 'glbvisa' }> = (
    props
) => {
    if (props.variant === 'glbvisa') {
        return (
            <components.DropdownIndicator {...props}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 18 18'
                    fill='none'
                    className={`transition-transform duration-200 ${props.selectProps.menuIsOpen ? 'rotate-180' : ''}`}
                >
                    <path
                        d='M4.5 6.75L9 11.25L13.5 6.75'
                        stroke='#777777'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            </components.DropdownIndicator>
        )
    }
    return (
        <components.DropdownIndicator {...props}>
            {props?.isLeadform ? (
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
                    <path
                        d='M14.5336 4.82468L13.8656 4.13751C13.7766 4.04574 13.6741 4 13.5582 4C13.4426 4 13.3401 4.04574 13.2511 4.13751L8.00023 9.53951L2.74961 4.13765C2.66056 4.04589 2.55808 4.00015 2.44231 4.00015C2.32649 4.00015 2.22401 4.04589 2.13501 4.13765L1.46714 4.82487C1.37795 4.91644 1.3335 5.02188 1.3335 5.14104C1.3335 5.2601 1.37809 5.36554 1.46714 5.45711L7.69293 11.8626C7.78193 11.9542 7.88446 12 8.00023 12C8.116 12 8.21835 11.9542 8.3073 11.8626L14.5336 5.45711C14.6226 5.36549 14.6668 5.26005 14.6668 5.14104C14.6668 5.02188 14.6226 4.91644 14.5336 4.82468Z'
                        fill='#666666'
                    />
                </svg>
            ) : (
                <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
                    <path
                        d='M5.69868 8.00149L2.69868 4.66816C2.61386 4.57391 2.57145 4.46231 2.57145 4.33334C2.57145 4.20437 2.61386 4.09276 2.69868 3.99852C2.7835 3.90427 2.88395 3.85715 3.00002 3.85715L9.00002 3.85715C9.11609 3.85715 9.21654 3.90427 9.30136 3.99852C9.38618 4.09276 9.42859 4.20437 9.42859 4.33334C9.42859 4.46231 9.38618 4.57391 9.30136 4.66816L6.30136 8.00149C6.21653 8.09574 6.11609 8.14286 6.00002 8.14286C5.88395 8.14286 5.7835 8.09574 5.69868 8.00149Z'
                        fill='#3B3A3C'
                    />
                </svg>
            )}
        </components.DropdownIndicator>
    )
}

const Input: React.FC<InputProps> = (props) => <components.Input {...props} autoComplete='off' />

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ControlWithIcon: React.FC<any> = (props) => {
    const { startIcon } = props
    return (
        <div className='relative'>
            {startIcon && (
                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-[1] pointer-events-none'>
                    {startIcon}
                </div>
            )}
            <components.Control {...props} />
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IconOption: React.FC<any> = (props) => {
    return (
        <components.Option {...props} className='!flex items-center justify-start gap-2'>
            {props.data.icon && (
                <Image
                    width={20}
                    height={14}
                    style={{ width: '20px' }}
                    src={props.data.icon || '/'}
                    alt={props.data.label || ''}
                    title={props.data.label}
                />
            )}
            {props.data.label}
        </components.Option>
    )
}
