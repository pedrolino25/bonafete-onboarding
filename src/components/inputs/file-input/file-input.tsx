import { cn } from '@/lib/utils'
import { FileUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'

export interface FileInputProps {
  maxFiles?: number
  onSuccess?: (images: File[]) => void
  isLoading?: (loading: boolean) => void
  onError?: (error: unknown) => void
  label?: string
  disabled?: boolean
}

export function FileInput({
  maxFiles,
  onSuccess,
  isLoading,
  onError,
  label,
  disabled,
}: FileInputProps) {
  const t = useTranslations()

  const onDrop = async (files: File[]) => {
    if (maxFiles && files.length > maxFiles) {
      return
    }

    try {
      isLoading?.(true)
      isLoading?.(false)
      onSuccess?.(files)
    } catch (error) {
      isLoading?.(false)
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
          '!border-utility-gray-300 hover:!border-utility-gray-300 !cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} disabled={disabled || maxFiles === 0} />
      <div
        className={cn(
          'w-full h-full flex flex-col text-utility-gray-400 hover:text-utility-gray-500 items-center justify-center',
          disabled && '!text-utility-gray-300 hover:!text-utility-gray-300'
        )}
      >
        <FileUp className="h-8 w-8 " />
        <p className="pt-2 text-sm font-light text-center">
          {t('actions.drag-grop-file')}
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
