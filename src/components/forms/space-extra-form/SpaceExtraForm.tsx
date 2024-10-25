'use client'

import { ImageInput } from '@/components/inputs/image-input/image-input'
import { SelectInput } from '@/components/inputs/select-input/select-input'
import { TextEditorInput } from '@/components/inputs/text-editor-input/text-editor-input'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import Photo from '@/components/sections/onboarding/space-photos/space-photo/SpacePhoto'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Option } from '@/components/ui/select'
import { toast } from '@/lib/hooks/use-toast'
import { uploadPictureToS3Bucket } from '@/lib/utils'
import {
  PACKAGES_AVAILABLE_OPTIONS,
  PRICING_MODEL_EXTRAS_OPTIONS,
} from '@/lib/utils/consts'
import {
  deleteSpaceExtra,
  OnboardingProcessItemResponse,
  updateSpaceExtra,
} from '@/services/api/onboarding-processes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Clock, Euro, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 } from 'uuid'
import z from 'zod'
import ExtrasForm, { extrasFormSchema } from '../extras-form/ExtrasForm'

const MAX_PHOTOS = 4

interface SpaceExtraFormProps {
  defaultValues?: SpaceExtraFormType
  onboardingInfo: OnboardingProcessItemResponse
  completed?: boolean
  refetch: () => void
}

const imageTypeSchema = z.object({
  file: z.instanceof(File).optional(),
  path: z.string(),
})

type ImageFormType = z.infer<typeof imageTypeSchema>

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
  disabled: z.any().optional(),
})

const spaceExtraFormSchema = z.object({
  id: z.string().optional(),
  extras_form: extrasFormSchema,
  description: z.string().min(12),
  price_modality: z.array(optionSchema).min(1),
  price: z.string().min(1),
  units: z.string().min(1).optional(),
  packages_available: z.array(optionSchema).min(1),
  photos: z.array(imageTypeSchema).max(4).optional(),
})

export type SpaceExtraFormType = z.infer<typeof spaceExtraFormSchema>

export default function SpaceExtraForm({
  onboardingInfo,
  defaultValues,
  refetch,
}: SpaceExtraFormProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isDirty },
  } = useForm<SpaceExtraFormType>({
    resolver: zodResolver(spaceExtraFormSchema),
    defaultValues,
  })

  const extra_id = watch('id')
  const description = watch('description')
  const price_modality = watch('price_modality')
  const price = watch('price')
  const units = watch('units')
  const packages_available = watch('packages_available')
  const photos = watch('photos')

  const handleSelectChange =
    (field: keyof SpaceExtraFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  const handleChange =
    (field: keyof SpaceExtraFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[.,]/g, '')
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  const deleteSpaceExtraMutation = useMutation({
    mutationFn: deleteSpaceExtra,
    onSuccess: () => {
      refetch()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.delete-extra'),
      })
    },
    onError: () => {
      refetch()
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.delete-extra'),
      })
    },
  })

  const updateSpaceExtraMutation = useMutation({
    mutationFn: updateSpaceExtra,
    onSuccess: () => {
      refetch()
      setIsLoading(false)
      setOpenDelete(false)
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.submit'),
      })
    },
    onError: () => {
      refetch()
      setIsLoading(false)
      setOpenDelete(false)
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.submit'),
      })
    },
  })

  const onSubmit = async (values: SpaceExtraFormType) => {
    setIsLoading(true)
    const pictures = values.photos
      ? await Promise.all(
          values.photos.map(async (photo, index) => {
            if (photo.file) {
              return await uploadPictureToS3Bucket({
                file: photo.file,
                path: `public/spaces/${
                  onboardingInfo?.space.space_id
                }/extras/photo_${v4()}.webp`,
              })
            } else {
              return photo.path
            }
          })
        )
      : []

    updateSpaceExtraMutation.mutate({
      onboarding_id: onboardingInfo?.id,
      id: values.id,
      name: values.extras_form?.extras?.[0]?.label,
      key: values.extras_form?.extras?.[0]?.value,
      description: values.description,
      photos: JSON.stringify(pictures),
      price_modality: values.price_modality?.[0]?.value,
      price: values.price,
      units: values.units,
      packages_available:
        values.packages_available?.[0]?.value === 'yes' ? 'true' : 'false',
    })
  }

  const handleDelete = () => {
    setOpenDelete(true)
  }

  return (
    <OnboardingFormLayout.Root>
      <ExtrasForm
        defaultValues={defaultValues?.extras_form}
        onChange={(value) =>
          setValue('extras_form', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      <OnboardingFormLayout.Main>
        <OnboardingFormLayout.Title>
          {t('sections.onboarding.extra-form.pricing-title')}
        </OnboardingFormLayout.Title>
        <OnboardingFormLayout.Subtitle>
          {t('sections.onboarding.extra-form.pricing-subtitle')}
        </OnboardingFormLayout.Subtitle>
        <OnboardingFormLayout.Container>
          <SelectInput
            required
            data-testid="price_modality"
            placeholder={t(
              'sections.onboarding.extra-form.select-pricing-model'
            )}
            options={PRICING_MODEL_EXTRAS_OPTIONS}
            value={price_modality}
            onSelect={handleSelectChange('price_modality')}
            useTranslation
          />
          {(price_modality?.[0]?.value === 'hourly' ||
            price_modality?.[0]?.value === 'person' ||
            price_modality?.[0]?.value === 'unit') && (
            <TextInput
              data-testid="units"
              value={units}
              onChange={handleChange('units')}
              type="number"
              placeholder={t(
                `sections.onboarding.extra-form.unit-${price_modality?.[0]?.value}`
              )}
              fixedEndAdornment={
                price_modality?.[0]?.value === 'hourly' ? (
                  <div className="px-3 pt-2.5 text-sm">
                    <Clock className="h-4 w-4" />
                  </div>
                ) : price_modality?.[0]?.value === 'person' ? (
                  <div className="px-3 pt-2.5 text-sm">
                    <Users className="h-4 w-4" />
                  </div>
                ) : undefined
              }
            />
          )}
          <TextInput
            data-testid="price"
            value={price}
            onChange={handleChange('price')}
            type="number"
            disabled={!price_modality || price_modality?.length === 0}
            placeholder={t('sections.onboarding.extra-form.price')}
            fixedEndAdornment={
              <div className="px-3 pt-2.5 text-sm">
                <Euro className="h-4 w-4" />
              </div>
            }
          />

          {((price_modality?.[0]?.value === 'fixed' && price) ||
            (price_modality?.[0]?.value && price && units)) && (
            <OnboardingFormLayout.Info>
              {t(
                `sections.onboarding.extra-form.explanation-messages.pricing-${price_modality?.[0]?.value}`
              )
                .replace('$1', price)
                .replace('$2', units || '')}
            </OnboardingFormLayout.Info>
          )}
        </OnboardingFormLayout.Container>
      </OnboardingFormLayout.Main>

      <OnboardingFormLayout.Main>
        <OnboardingFormLayout.Title>
          {t('sections.onboarding.extra-form.packages-available-title')}
        </OnboardingFormLayout.Title>
        <OnboardingFormLayout.Subtitle>
          {t('sections.onboarding.extra-form.packages-available-subtitle')}
        </OnboardingFormLayout.Subtitle>
        <OnboardingFormLayout.Container>
          <SelectInput
            required
            data-testid="packages_available"
            placeholder={t(
              'sections.onboarding.extra-form.select-packages-available'
            )}
            options={PACKAGES_AVAILABLE_OPTIONS}
            value={packages_available}
            onSelect={handleSelectChange('packages_available')}
            useTranslation
          />
          {packages_available?.[0]?.value && (
            <OnboardingFormLayout.Info>
              {t(
                `sections.onboarding.extra-form.explanation-messages.packages-available-${packages_available?.[0]?.value}`
              )}
            </OnboardingFormLayout.Info>
          )}
        </OnboardingFormLayout.Container>
      </OnboardingFormLayout.Main>

      <OnboardingFormLayout.Main>
        <OnboardingFormLayout.Title>
          {t('sections.onboarding.extra-form.description-title')}
        </OnboardingFormLayout.Title>
        <OnboardingFormLayout.Subtitle>
          {t('sections.onboarding.extra-form.description-subtitle')}
        </OnboardingFormLayout.Subtitle>
        <OnboardingFormLayout.Container>
          <TextEditorInput
            value={description}
            onChange={(val) =>
              setValue('description', val, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            placeholder={t('columns.description')}
            required
          />
        </OnboardingFormLayout.Container>
      </OnboardingFormLayout.Main>

      <OnboardingFormLayout.Main>
        <OnboardingFormLayout.Title>
          {t('sections.onboarding.extra-form.photos-title')}
        </OnboardingFormLayout.Title>
        <OnboardingFormLayout.Subtitle>
          {t('sections.onboarding.extra-form.photos-subtitle')}
        </OnboardingFormLayout.Subtitle>
        <OnboardingFormLayout.Container>
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6">
            {photos?.map((item, index) => {
              return (
                <Photo
                  index={index}
                  src={item.path}
                  onDeletePhoto={
                    photos.length > 0
                      ? (val) => {
                          setValue(
                            'photos',
                            photos.filter(
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
                />
              )
            })}
            {(!photos || MAX_PHOTOS - photos?.length > 0) && (
              <ImageInput
                maxFiles={MAX_PHOTOS - (photos?.length || 0)}
                onSuccess={(images) => {
                  setValue(
                    'photos',
                    [
                      ...(photos || []),
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
        </OnboardingFormLayout.Container>
      </OnboardingFormLayout.Main>

      <div className="w-full flex gap-4">
        {defaultValues && (
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleDelete}
            color="secondary"
          >
            {t('button-actions.remove')}
          </Button>
        )}

        <Button
          className="w-full"
          disabled={!isValid || isLoading || !isDirty}
          loading={isLoading}
          onClick={handleSubmit(onSubmit)}
        >
          {defaultValues ? t('button-actions.edit') : t('button-actions.add')}
        </Button>
      </div>
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('titles.delete-extra')}</DialogTitle>
            <DialogDescription className="pt-2 pb-6">
              {t('subtitles.delete-extra')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              color="secondary"
              disabled={isLoading}
              onClick={() => setOpenDelete(false)}
            >
              {t('button-actions.cancel')}
            </Button>
            <Button
              color="destructive"
              loading={isLoading}
              disabled={isLoading}
              onClick={() => {
                deleteSpaceExtraMutation.mutate({
                  id: extra_id as string,
                })
                setIsLoading(true)
              }}
            >
              {t('button-actions.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OnboardingFormLayout.Root>
  )
}
