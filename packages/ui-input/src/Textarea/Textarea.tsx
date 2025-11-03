import classNames from 'classnames'
import type { TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { useController } from 'react-hook-form'

type Props = {
  classNameWrapper?: string
  classNameInput?: string
  classNameError?: string
  classNameLabel?: string
  nameLabel?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
} & TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    { classNameWrapper, classNameInput, classNameError, classNameLabel, nameLabel, control, ...restParams }: Props,
    ref
  ) => {
    const fieldName = restParams?.name || 'textarea'

    const {
      field,
      formState: { errors }
    } = useController({
      name: fieldName,
      control,
      shouldUnregister: true
    })

    const errorMessage = errors?.[fieldName]?.message?.toString() ?? ''

    return (
      <div className={classNameWrapper} data-te-input-wrapper-init>
        <label
          htmlFor={restParams?.id}
          className={`label-primary ${restParams?.required ? 'label-required' : ''} ${classNameLabel ? classNameLabel : ''}`}
        >
          {nameLabel}
        </label>
        <div className='relative mt-2'>
          <textarea
            {...restParams}
            {...field}
            ref={ref}
            className={classNames(
              'input-primary block w-full appearance-none rounded-xl border border-gray-5 p-3 text-14 font-normal leading-1-4 text-gray-1 outline-none transition-all duration-200 placeholder:text-14 placeholder:font-normal placeholder:leading-1-4 placeholder:text-gray-4 hover:cursor-text hover:border-blue-1 focus:border-blue-1 focus:outline-none',
              classNameInput,
              {
                '!border-red-1': errorMessage,
                'cursor-no-drop appearance-none !border-gray-11 !bg-gray-7 !text-gray-5': restParams?.disabled
              }
            )}
          />
        </div>
        {errorMessage && <div className={`input-error ${classNameError ? classNameError : ''}`}>{errorMessage}</div>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
