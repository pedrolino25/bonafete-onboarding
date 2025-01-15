'use client'
import { ImageInput } from '@/components/inputs/image-input/image-input'
import { OnboardingSectionLayout } from '@/components/layouts/onboarding-section'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/lib/hooks/use-toast'
import { uploadPictureToS3Bucket, urlToFile } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import Photo from '../../onboarding/space-photos/space-photo/SpacePhoto'

const MAX_PHOTOS = 10

const imageTypeSchema = z.object({
  file: z.instanceof(File).optional(),
  path: z.string(),
})

type ImageFormType = z.infer<typeof imageTypeSchema>

const submitApplicationPhotosFormSchema = z.object({
  photos: z.array(imageTypeSchema).min(5).max(10),
})

export type SubmitApplicationPhotosFormType = z.infer<
  typeof submitApplicationPhotosFormSchema
>

interface SubmitApplicationPhotosSectionProps {
  applicationId: string
  defaultValues?: SubmitApplicationPhotosFormType
  onChange: (values: string[]) => void
}

export default function SubmitApplicationPhotosSection({
  applicationId,
  defaultValues,
  onChange,
}: SubmitApplicationPhotosSectionProps) {
  const t = useTranslations()
  const [viewPhotos, setViewPhotos] = useState<boolean>()
  const [isLoading, setLoading] = useState<boolean>(false)

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid, isDirty },
  } = useForm<SubmitApplicationPhotosFormType>({
    mode: 'onChange',
    resolver: zodResolver(submitApplicationPhotosFormSchema),
    defaultValues,
  })

  const onSubmit = async (values: SubmitApplicationPhotosFormType) => {
    setLoading(true)
    const pictures = await Promise.all(
      values.photos.map(async (photo, index) => {
        if (photo.file) {
          return await uploadPictureToS3Bucket({
            file: photo.file,
            path: `public/spaces/application/${applicationId}/photo_${index}.webp`,
          })
        } else if (photo.path.includes('/applications/')) {
          return await uploadPictureToS3Bucket({
            file: await urlToFile(photo.path, 'file'),
            path: `public/spaces/application/${applicationId}/photo_${index}.webp`,
          })
        } else {
          return photo.path
        }
      })
    )
    setLoading(false)
    onChange(pictures)
  }

  return (
    <form
      className="w-full max-sm:border-t max-sm:px-2 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full border-b pb-4 flex justify-between items-center max-sm:flex-col">
        <div className="w-full">
          <OnboardingSectionLayout.Title>
            {t('sections.onboarding.space-photos-title')}
          </OnboardingSectionLayout.Title>
          <OnboardingSectionLayout.Subtitle>
            {t('sections.onboarding.space-photos-subtitle')}
          </OnboardingSectionLayout.Subtitle>
        </div>
        <div className="flex justify-between items-center gap-4 max-sm:justify-end max-sm:items-start max-sm:pt-4 max-sm:w-full">
          <Button
            type="submit"
            disabled={!isValid}
            loading={isLoading}
            endAdornment={<ChevronRight className="h-4 w-4" />}
          >
            {t('button-actions.next')}
          </Button>
        </div>
      </div>
      <div className="w-9/12 max-w-[700px] max-sm:w-full flex flex-col gap-8 pt-8 pl-6 max-sm:pl-0 pb-12">
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6">
          {getValues().photos?.map((item, index) => {
            return (
              <Photo
                index={index}
                src={item.path}
                onViewPhoto={() => setViewPhotos(true)}
                onDeletePhoto={
                  getValues().photos.length > 5
                    ? (val) => {
                        setValue(
                          'photos',
                          getValues().photos.filter(
                            (__, index) => index !== (val as number)
                          ),
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          }
                        )
                      }
                    : undefined
                }
                onSetAsProfilePhoto={(val) => {
                  const photos = getValues().photos.filter(
                    (__, index) => index !== (val as number)
                  )
                  const item = getValues().photos[val]
                  photos.unshift(item)
                  setValue('photos', photos, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
              />
            )
          })}
          {MAX_PHOTOS - getValues().photos?.length > 0 && (
            <ImageInput
              maxFiles={MAX_PHOTOS - getValues().photos?.length}
              onSuccess={(images) => {
                setValue(
                  'photos',
                  [
                    ...getValues().photos,
                    ...(images as unknown as ImageFormType[]),
                  ],
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                  }
                )
              }}
              onError={() => {
                toast({
                  variant: 'destructive',
                  title: t('error'),
                  description: t('error-messages.photos-limite-exceded'),
                })
              }}
            />
          )}
        </div>
      </div>
      <Dialog open={viewPhotos} onOpenChange={setViewPhotos}>
        <DialogContent className="max-w-[1024px] max-sm:max-w-100svw max-h-svh">
          <DialogHeader>
            <DialogTitle>{t('titles.photos')}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(100svh-100px)] w-full overflow-y-auto">
            <div className="flex flex-col gap-8 py-8 px-1 w-full">
              {getValues().photos?.map((photo, index) => {
                return (
                  <div key={`space_image_${index}`} className="relative w-full">
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={photo.path}
                        alt={`space_image_${index}`}
                        fill
                        objectFit="cover"
                      />
                    </AspectRatio>
                  </div>
                )
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  )
}
