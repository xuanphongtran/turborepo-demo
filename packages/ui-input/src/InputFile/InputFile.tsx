import classNames from 'classnames'
import type { Dispatch, SetStateAction } from 'react'
import React, { useRef } from 'react'
import type { UseFormSetError } from 'react-hook-form'

interface InputFileProps {
  setFile: Dispatch<SetStateAction<File[]>>
  name: string
  nameButton?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setError?: UseFormSetError<any>
  errorMessage?: string
  classNameError?: string
  nameLabel?: string
  classNameLabel?: string
}

export default function InputFile({
  setFile,
  name,
  setError,
  errorMessage,
  nameButton,
  classNameError,
  nameLabel,
  classNameLabel
}: InputFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const extensionToMimeType: {
    [key: string]: string
  } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }

  const listFileAccept = Object.values(extensionToMimeType)

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    if (fileList) {
      const selectedFiles = Array.from(fileList)

      selectedFiles.forEach((file) => {
        const fileExtension = '.' + file.name.split('.').pop()
        const fileSizeMB = file.size / (1024 * 1024)

        if (fileSizeMB > 20) {
          setError && setError(name, { message: '<= 20MB/file' })
        } else if (!listFileAccept.includes(extensionToMimeType[fileExtension])) {
          setError && setError(name, { message: 'Your file is invalid.' })
        } else {
          setFile((prev) => [...prev, file])
          setError && setError(name, { message: '' })
        }
      })
    }
  }
  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <label
        className={classNames('label-primary', classNameLabel)}
        dangerouslySetInnerHTML={{ __html: nameLabel ?? '' }}
      />
      <div className='relative'>
        <input
          className='absolute h-full w-full cursor-pointer opacity-0'
          type='file'
          name={name}
          accept='.jpg, .jpeg, .png, .gif, .bmp, .pdf, .txt, .doc, .docx, .xls, .xlsx'
          ref={fileInputRef}
          onChange={onFileChange}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={(event: React.MouseEvent<HTMLInputElement, MouseEvent>) => ((event.target as any).value = null)}
          multiple
        />
        <button
          className='mt-2 flex w-full items-center justify-center rounded-xl p-3 text-14 leading-[20px] text-gray-3 outline-dashed outline-1 outline-gray-11'
          type='button'
          onClick={handleUpload}
        >
          {nameButton}
        </button>
      </div>
      {
        <div
          className='mt-2 text-14 text-gray-3'
          dangerouslySetInnerHTML={{
            __html:
              '(*.jpg, *.jpeg, *.png, *.gif, *.bmp, *.pdf, *.txt, *.doc, *.docx, *.xls, *.xlsx, <= 20MB/file, limit 3/3 files)'
          }}
        />
      }
      {errorMessage && <div className={`input-error ${classNameError ? classNameError : ''}`}>{errorMessage}</div>}
    </>
  )
}
