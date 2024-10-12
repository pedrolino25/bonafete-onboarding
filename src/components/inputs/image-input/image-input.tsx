import { AspectRatio } from '@/components/ui/aspect-ratio'
import { convertImageToWebP, ImageType } from '@/lib/utils'
import { Camera } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'

export interface ImageInputProps {
  maxFiles?: number
  onSuccess?: (images: ImageType[]) => void
  isLoading?: (loading: boolean) => void
  onError?: (error: unknown) => void
}

export function ImageInput({
  maxFiles,
  onSuccess,
  isLoading,
  onError,
}: ImageInputProps) {
  const t = useTranslations()

  const onDrop = async (acceptedFiles: File[]) => {
    if (maxFiles && acceptedFiles.length > maxFiles) {
      return
    }

    try {
      isLoading?.(true)
      const files = await Promise.all(
        acceptedFiles.map(async (file: File) => {
          const convertedImage = await convertImageToWebP(file)
          return convertedImage
        })
      )
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
      className="border-2 px-6 border-dashed border-utility-gray-400 hover:border-utility-gray-500 flex flex-col items-center justify-center cursor-pointer"
    >
      <AspectRatio ratio={16 / 9}>
        <input {...getInputProps()} disabled={maxFiles === 0} />
        <div className="w-full h-full flex flex-col text-utility-gray-400 hover:text-utility-gray-500 items-center justify-center">
          <Camera className="h-12 w-12 " />
          <p className="text-sm font-light text-center">
            {t('actions.drag-grop-image')}
          </p>
        </div>
      </AspectRatio>
    </div>
  )
}
