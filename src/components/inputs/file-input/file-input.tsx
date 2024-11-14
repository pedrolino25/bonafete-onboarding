import { cn, uploadPictureToS3Bucket } from '@/lib/utils'
import {
  updateIbanDocument,
  uploadStripeDocument,
} from '@/services/api/onboarding-processes'
import { FileUp, LoaderCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { v4 } from 'uuid'

interface FileInputInfoProps {
  account_id: string
  person_id?: string
  verification_type: string
  file_type: string
  is_company: boolean
}

export interface FileInputProps {
  maxFiles?: number
  onSuccess?: (images: File[]) => void
  onError?: (error: unknown) => void
  label?: string
  disabled?: boolean
  info: FileInputInfoProps
  complete?: boolean
}

export function FileInput({
  maxFiles,
  onSuccess,
  onError,
  label,
  disabled,
  info,
  complete,
}: FileInputProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onDrop = async (files: File[]) => {
    if (maxFiles && files.length > maxFiles) {
      return
    }
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('account_id', info.account_id)
      formData.append('person_id', info.person_id || '')
      formData.append('verification_type', info.verification_type)
      formData.append('file_type', info.file_type)
      formData.append('is_company', info.is_company.toString())
      if (info.verification_type !== 'iban') {
        await uploadStripeDocument(formData)
      } else {
        await updateIbanDocument({
          account_id: info.account_id,
        })
      }
      await uploadPictureToS3Bucket({
        file: files[0],
        path: `public/stripe-docs/account_id/person_id/${
          info.verification_type
        }_${info.file_type}_${v4()}.webp`,
      })
      setIsLoading(false)
      onSuccess?.(files)
    } catch (error) {
      setIsLoading(false)
      onError?.(error)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles,
    accept: {
      'image/*': [],
    },
    onDrop,
    onError,
    onDropRejected: () => onError?.('exceded-max-photos'),
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'w-full h-32 border-2 px-6 border-dashed border-utility-gray-400 hover:border-utility-gray-500 flex flex-col items-center justify-center cursor-pointer',
        disabled &&
          '!border-utility-gray-300 hover:!border-utility-gray-300 !cursor-not-allowed',
        complete &&
          '!border-utility-success-200 hover:!border-utility-success-200 !cursor-not-allowed',
        isLoading &&
          '!border-utility-gray-blue-200 hover:!border-utility-gray-blue-200 !cursor-not-allowed'
      )}
    >
      <input
        {...getInputProps()}
        disabled={disabled || maxFiles === 0 || complete || isLoading}
      />
      <div
        className={cn(
          'w-full h-full flex flex-col text-utility-gray-400 hover:text-utility-gray-500 items-center justify-center',
          disabled && '!text-utility-gray-300 hover:!text-utility-gray-300',
          complete &&
            '!text-utility-success-500 hover:!text-utility-success-500',
          isLoading &&
            '!text-utility-gray-blue-500 hover:!text-utility-gray-blue-500'
        )}
      >
        {isLoading ? (
          <LoaderCircle className="h-8 w-8 animate-spin" />
        ) : (
          <FileUp className="h-8 w-8" />
        )}

        <p className="pt-2 text-sm font-light text-center">
          {complete
            ? t('actions.drag-grop-file-complete')
            : isLoading
            ? t('actions.drag-grop-file-loading')
            : t('actions.drag-grop-file')}
        </p>
        {label && (
          <p className="pt-2 text-utility-gray-600 text-xs font-normal text-center">
            {label}
          </p>
        )}
      </div>
    </div>
  )
}
