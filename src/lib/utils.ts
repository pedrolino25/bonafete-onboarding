// eslint-disable-next-line prettier/prettier
import { uploadData } from 'aws-amplify/storage'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface S3File {
  file: File
  path: string
}
export async function uploadPictureToS3Bucket(file: S3File): Promise<string> {
  await uploadData({
    path: file.path,
    data: file.file,
  }).result
  return `${process.env.NEXT_PUBLIC_AWS_STORAGE_BUCKET_URL}/${file.path}`
}

export async function urlToFile(imageUrl: string, fileName: string) {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  return new File([blob], fileName, { type: blob.type })
}

export function splitCommaGetFirst(data: String): string {
  return data?.split(',')[0] || (data as string)
}

export interface ImageType {
  file: File
  path: string
}

export async function convertImageToWebP(file: File): Promise<ImageType> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      const img = new Image()
      img.src = reader.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Could not create canvas context'))
          return
        }

        // Max dimensions
        const maxWidth = 1920
        const maxHeight = 1080
        let { width, height } = img

        // Maintain aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height

          if (width > height) {
            width = maxWidth
            height = Math.round(maxWidth / aspectRatio)
          } else {
            height = maxHeight
            width = Math.round(maxHeight * aspectRatio)
          }
        }

        // Set the canvas size to the new dimensions
        canvas.width = width
        canvas.height = height

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0, width, height)

        // Convert the canvas to a WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Conversion to WebP failed'))
              return
            }

            const url = URL.createObjectURL(blob)
            resolve({
              file: new File([blob], file.name, { type: 'image/webp' }),
              path: url,
            })
          },
          'image/webp',
          0.75 // Quality (1.0 = max quality)
        )
      }
    }

    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }
  })
}
