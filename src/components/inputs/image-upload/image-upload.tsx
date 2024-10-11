import { convertImageToWebP } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'
import { Accept, useDropzone } from 'react-dropzone'

export interface ImageUploadProps {
  label?: string
  required?: boolean
}

export function ImageUpload({ label, required }: ImageUploadProps) {
  const [compressedImage, setCompressedImage] = useState<string>()

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    try {
      console.log('original size', file.size)
      const compressedFile = await convertImageToWebP(file)
      setCompressedImage(compressedFile)
    } catch (error) {
      console.error(error)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*' as unknown as Accept,
    maxFiles: 1,
  })

  return (
    <div data-testid="image-upload-input">
      {label && (
        <p className="text-sm font-medium text-utility-gray-700 p-0 m-0 mb-1.5">
          {label}
          {required && '*'}
        </p>
      )}
      <div>
        <div
          {...getRootProps()}
          className="border-1 dashed border-utility-gray-700"
        >
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      </div>
      {compressedImage && (
        <div style={{ marginTop: '20px' }}>
          <h4>Compressed Image:</h4>
          <div className="w-700 h-500 relative ">
            <Image
              src={compressedImage}
              alt="Responsive image"
              width="700"
              height="500"
              // quality={75}
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
