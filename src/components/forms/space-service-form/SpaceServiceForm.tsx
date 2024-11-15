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
  PRICING_MODEL_SERVICES_OPTIONS,
} from '@/lib/utils/consts'
import {
  deleteSpaceService,
  OnboardingProcessItemResponse,
  updateSpaceService,
} from '@/services/api/onboarding-processes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Clock, Euro, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 } from 'uuid'
import z from 'zod'
import ServicesForm, { servicesFormSchema } from '../services-form/ServicesForm'

const MAX_PHOTOS = 4

interface SpaceServiceFormProps {
  defaultValues?: SpaceServiceFormType
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

const spaceServiceFormSchema = z.object({
  id: z.string().optional(),
  services_form: servicesFormSchema,
  description: z.string().optional(),
  price_modality: z.array(optionSchema).min(1),
  price: z.string().min(1),
  units: z.string().min(1).optional(),
  packages_only: z.array(optionSchema).min(1),
  photos: z.array(imageTypeSchema).max(4).optional(),
})

export type SpaceServiceFormType = z.infer<typeof spaceServiceFormSchema>

export default function SpaceServiceForm({
  onboardingInfo,
  defaultValues,
  refetch,
}: SpaceServiceFormProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isDirty, errors },
  } = useForm<SpaceServiceFormType>({
    resolver: zodResolver(spaceServiceFormSchema),
    defaultValues: {
      ...defaultValues,
      description: defaultValues?.description || '',
    },
  })

  const service_id = watch('id')
  const description = watch('description')
  const price_modality = watch('price_modality')
  const price = watch('price')
  const units = watch('units')
  const packages_only = watch('packages_only')
  const photos = watch('photos')

  const handleSelectChange =
    (field: keyof SpaceServiceFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  const handleChange =
    (field: keyof SpaceServiceFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[.,]/g, '')
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  const deleteSpaceServiceMutation = useMutation({
    mutationFn: deleteSpaceService,
    onSuccess: () => {
      refetch()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.delete-service'),
      })
    },
    onError: () => {
      refetch()
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.delete-service'),
      })
    },
  })

  const updateSpaceServiceMutation = useMutation({
    mutationFn: updateSpaceService,
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

  const onSubmit = async (values: SpaceServiceFormType) => {
    setIsLoading(true)
    const pictures = values.photos
      ? await Promise.all(
          values.photos.map(async (photo, index) => {
            if (photo.file) {
              return await uploadPictureToS3Bucket({
                file: photo.file,
                path: `public/spaces/${
                  onboardingInfo?.space.space_id
                }/services/photo_${v4()}.webp`,
              })
            } else {
              return photo.path
            }
          })
        )
      : []

    updateSpaceServiceMutation.mutate({
      onboarding_id: onboardingInfo?.id,
      id: values.id,
      description: values.description,
      photos: JSON.stringify(pictures),
      price_modality: values.price_modality?.[0]?.value,
      price: values.price,
      units: values.units,
      packages_only: values.packages_only?.[0]?.value,
      service_id: values.services_form?.services?.[0]?.value,
    })
  }

  const handleDelete = () => {
    setOpenDelete(true)
  }

  return (
    <OnboardingFormLayout.Root>
      <ServicesForm
        defaultValues={defaultValues?.services_form}
        onChange={(value) => {
          setValue('services_form', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }}
      />
      <OnboardingFormLayout.Main>
        <OnboardingFormLayout.Title>
          {t('sections.onboarding.services-form.pricing-title')}
        </OnboardingFormLayout.Title>
        <OnboardingFormLayout.Subtitle>
          {t('sections.onboarding.services-form.pricing-subtitle')}
        </OnboardingFormLayout.Subtitle>
        <OnboardingFormLayout.Container>
          <SelectInput
            required
            data-testid="price_modality"
            placeholder={t(
              'sections.onboarding.services-form.select-pricing-model'
            )}
            options={PRICING_MODEL_SERVICES_OPTIONS}
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
                `sections.onboarding.services-form.unit-${price_modality?.[0]?.value}`
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
            placeholder={t('sections.onboarding.services-form.price')}
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
                `sections.onboarding.services-form.explanation-messages.pricing-${price_modality?.[0]?.value}`
              )
                .replace('$1', price)
                .replace('$2', units || '')}
            </OnboardingFormLayout.Info>
          )}
        </OnboardingFormLayout.Container>
      </OnboardingFormLayout.Main>

      <OnboardingFormLayout.Main>
        <OnboardingFormLayout.Title>
          {t('sections.onboarding.services-form.packages-available-title')}
        </OnboardingFormLayout.Title>
        <OnboardingFormLayout.Subtitle>
          {t('sections.onboarding.services-form.packages-available-subtitle')}
        </OnboardingFormLayout.Subtitle>
        <OnboardingFormLayout.Container>
          <SelectInput
            required
            data-testid="packages_only"
            placeholder={t(
              'sections.onboarding.services-form.select-packages-available'
            )}
            options={PACKAGES_AVAILABLE_OPTIONS}
            value={packages_only}
            onSelect={handleSelectChange('packages_only')}
            useTranslation
          />
          {packages_only?.[0]?.value && (
            <OnboardingFormLayout.Info>
              {t(
                `sections.onboarding.services-form.explanation-messages.packages-available-${packages_only?.[0]?.value}`
              )}
            </OnboardingFormLayout.Info>
          )}
        </OnboardingFormLayout.Container>
      </OnboardingFormLayout.Main>

      {packages_only?.[0]?.value && packages_only?.[0]?.value === 'false' && (
        <OnboardingFormLayout.Main>
          <OnboardingFormLayout.Title>
            {t('sections.onboarding.services-form.description-title')}
          </OnboardingFormLayout.Title>
          <OnboardingFormLayout.Subtitle>
            {t('sections.onboarding.services-form.description-subtitle')}
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
      )}
      {packages_only?.[0]?.value && packages_only?.[0]?.value === 'false' && (
        <OnboardingFormLayout.Main>
          <OnboardingFormLayout.Title>
            {t('sections.onboarding.services-form.photos-title')}
          </OnboardingFormLayout.Title>
          <OnboardingFormLayout.Subtitle>
            {t('sections.onboarding.services-form.photos-subtitle')}
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
      )}

      <div className="w-full flex justify-end gap-4">
        {defaultValues && (
          <Button
            className="px-10"
            disabled={isLoading}
            onClick={handleDelete}
            color="secondary"
          >
            {t('button-actions.remove')}
          </Button>
        )}

        <Button
          className="px-10"
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
            <DialogTitle>{t('titles.delete-service')}</DialogTitle>
            <DialogDescription className="pt-2 pb-6">
              {t('subtitles.delete-service')}
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
                deleteSpaceServiceMutation.mutate({
                  id: service_id as string,
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
