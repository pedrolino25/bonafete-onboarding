'use client'
import { MapInput } from '@/components/inputs/map-input/map-input'
import { SelectInput } from '@/components/inputs/select-input/select-input'
import { TextEditorInput } from '@/components/inputs/text-editor-input/text-editor-input'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Option } from '@/components/ui/select'
import { toast } from '@/lib/hooks/use-toast'
import { cn, splitCommaGetFirst } from '@/lib/utils'
import {
  OnboardingProcessItemResponse,
  saveOnboardingSpaceInfo,
} from '@/services/api/onboarding-processes'
import { verifySpaceTitle } from '@/services/api/spaces'
import {
  LocalityListItemResponse,
  PostalCodesListItemResponse,
  SpaceConvenienceResponse,
  SpaceTargetListItemResponse,
  SpaceTypeListItemResponse,
} from '@/services/api/static'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  CircleCheck,
  CircleX,
  LoaderCircle,
  Save,
  Search,
  Send,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
  disabled: z.any().optional(),
})

const spaceInfoFormSchema = z.object({
  type: z.array(optionSchema).min(1),
  targets: z.array(optionSchema).min(1),
  conveniences: z.array(optionSchema).min(2),
  title: z.string().min(1),
  tour: z.string().optional(),
  description: z.string().min(12),
  valid_url: z.string().min(1),
  allow_pets: z.string().min(1),
  allow_alcool: z.string().min(1),
  allow_smoking: z.string().min(1),
  allow_high_sound: z.string().min(1),
  has_security_cameras: z.string().min(1),
  rules: z.string().min(12),
  street: z.string().min(1),
  postal: z.string().min(1),
  locality: z.string().min(1),
  city: z.string().min(1),
  latitude: z.string(),
  longitude: z.string(),
})

type SpaceInfoFormType = z.infer<typeof spaceInfoFormSchema>

interface SpaceInfoSectionProps {
  onboardingInfo: OnboardingProcessItemResponse
  localitiesList: LocalityListItemResponse[]
  conveniencesList: SpaceConvenienceResponse
  spaceTypesList: SpaceTypeListItemResponse[]
  spaceTargetsList: SpaceTargetListItemResponse[]
  postalCodesList: PostalCodesListItemResponse[]
  completed?: boolean
  refetch: () => void
}

export default function SpaceInfoSection({
  onboardingInfo,
  localitiesList,
  postalCodesList,
  conveniencesList,
  spaceTypesList,
  spaceTargetsList,
  completed,
  refetch,
}: SpaceInfoSectionProps) {
  const t = useTranslations()

  const [spaceTypesOptions] = useState<Option[]>(
    spaceTypesList?.map((option) => {
      return {
        label: option.label,
        value: option.id,
      }
    }) as Option[]
  )

  const [spaceTargetsOptions] = useState<Option[]>(
    spaceTargetsList?.map((option) => {
      return {
        label: option.label,
        value: option.id,
      }
    }) as Option[]
  )

  const [conveniencesOptions] = useState<Option[]>(
    conveniencesList.conveniences
      .concat(conveniencesList.equipement)
      .concat(conveniencesList.accessibility)
      ?.map((option) => {
        return {
          label: option.label,
          value: option.id,
          disabled: option.id === '17',
        }
      }) as Option[]
  )

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid, isDirty, errors },
  } = useForm<SpaceInfoFormType>({
    mode: 'onChange',
    resolver: zodResolver(spaceInfoFormSchema),
    defaultValues: {
      type: onboardingInfo.space?.type
        ? [
            {
              label: onboardingInfo.space.type.label,
              value: onboardingInfo.space.type.id,
            },
          ]
        : [
            {
              label: onboardingInfo.application?.type.label,
              value: onboardingInfo.application?.type.id,
            },
          ],
      targets:
        onboardingInfo.space?.targets && onboardingInfo.space.targets.length > 0
          ? onboardingInfo.space?.targets?.map((item) => {
              return {
                label: item.label,
                value: item.id,
              }
            })
          : onboardingInfo.application?.targets?.map((item) => {
              return {
                label: item.label,
                value: item.id,
              }
            }),
      conveniences:
        onboardingInfo.space?.conveniences &&
        onboardingInfo.space.conveniences.length > 0
          ? onboardingInfo.space?.conveniences?.map((item) => {
              return {
                label: item.label,
                value: item.id,
                disabled: item.id === '17',
              }
            })
          : conveniencesOptions?.filter((item) => item.value === '17'),
      title: onboardingInfo.space?.title,
      tour: onboardingInfo.space?.tour,
      description: onboardingInfo.space?.description,
      allow_pets: onboardingInfo.space?.allow_pets,
      allow_alcool: onboardingInfo.space?.allow_alcool,
      allow_smoking: onboardingInfo.space?.allow_smoking,
      allow_high_sound: onboardingInfo.space?.allow_high_sound,
      has_security_cameras: 'false',
      rules: onboardingInfo.space?.rules,
      valid_url: onboardingInfo.space.title ? 'unique' : '',
      street: onboardingInfo.space?.street,
      postal: onboardingInfo.space?.postal,
      locality: onboardingInfo.space?.locality,
      city: onboardingInfo.space?.city,
      latitude: onboardingInfo.space?.latitude?.toString(),
      longitude: onboardingInfo.space?.longitude?.toString(),
    },
  })

  const {
    isLoading,
    data,
    refetch: refetchVerifySpace,
  } = useQuery({
    queryKey: ['space-name', getValues().title],
    queryFn: async () => {
      return await verifySpaceTitle(
        getValues().title,
        onboardingInfo.space?.space_id
      )
    },
    enabled: false,
  })

  const saveOnboardingSpaceInfoMutation = useMutation({
    mutationFn: saveOnboardingSpaceInfo,
    onSuccess: () => {
      refetch?.()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.submit'),
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.submit'),
      })
    },
  })

  const [lastVerification, setLastVerification] = useState<string>(
    onboardingInfo.space?.title || ''
  )

  const onSubmit = (values: SpaceInfoFormType) => {
    saveOnboardingSpaceInfoMutation.mutate({
      onboarding_id: onboardingInfo.id || '',
      type:
        values.type?.map((item) => {
          return {
            id: item.value,
            label: item.label,
          }
        })[0] || {},
      targets:
        values.targets?.map((item) => {
          return {
            id: item.value,
            label: item.label,
          }
        }) || [],
      conveniences:
        values.conveniences?.map((item) => {
          return {
            id: item.value,
            label: item.label,
          }
        }) || [],
      title: values.title || '',
      tour: values.tour || '',
      description: values.description || '',
      allow_pets: values.allow_pets || '',
      allow_alcool: values.allow_alcool || '',
      allow_smoking: values.allow_smoking || '',
      allow_high_sound: values.allow_high_sound || '',
      has_security_cameras: values.has_security_cameras || '',
      rules: values.rules || '',
      street: values.street,
      postal: values.postal,
      locality: values.locality,
      city_id: values.city
        ? localitiesList?.find(
            (item) => splitCommaGetFirst(item.label) === values.city
          )?.value
        : undefined,
      city: values.city,
      latitude: values.latitude ? parseFloat(values.latitude) : undefined,
      longitude: values.longitude ? parseFloat(values.longitude) : undefined,
    })
  }

  useEffect(() => {
    if (data && data === 'unique' && lastVerification === getValues().title) {
      setValue('valid_url', 'unique', {
        shouldValidate: true,
        shouldDirty: true,
      })
    } else if (data && data === 'exists') {
      setValue('valid_url', '', {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [data])

  const handleChange =
    (field: keyof SpaceInfoFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
      if (field === 'postal' && value && value.length >= 4) {
        const postalCode = postalCodesList?.find(
          (item) => item.postal_code.toString() === value.substring(0, 4)
        )
        if (postalCode) {
          setValue('locality', postalCode?.locality, {
            shouldValidate: true,
            shouldDirty: true,
          })
          setValue('city', postalCode?.city, {
            shouldValidate: true,
            shouldDirty: true,
          })
          setValue('latitude', postalCode?.latitude?.toString(), {
            shouldValidate: true,
            shouldDirty: true,
          })
          setValue('longitude', postalCode?.longitude?.toString(), {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      }
    }

  const handleSelectChange =
    (field: keyof SpaceInfoFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  return (
    <form
      className="w-full max-sm:border-t max-sm:px-4 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full border-b pb-4 flex justify-between items-center max-sm:flex-col">
        <div>
          <h3 className="text-lg font-semibold text-utility-brand-600">
            {t('sections.onboarding.space-info-title')}
          </h3>
          <p className="text-sm font-light text-utility-gray-500 pt-1 pr-4">
            {t('sections.onboarding.space-info-subtitle')}
          </p>
        </div>
        <div className="flex justify-between items-center gap-4 max-sm:justify-end max-sm:items-start max-sm:pt-4 max-sm:w-full">
          {!isValid ? (
            <Button
              onClick={() => onSubmit(getValues())}
              color="secondary"
              disabled={
                !isDirty ||
                saveOnboardingSpaceInfoMutation.isPending ||
                lastVerification !== getValues().title
              }
              loading={saveOnboardingSpaceInfoMutation.isPending}
              startAdornment={<Save className="h-4 w-4" />}
            >
              {t('button-actions.save')}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={
                !isValid ||
                (completed && !isDirty) ||
                saveOnboardingSpaceInfoMutation.isPending ||
                lastVerification !== getValues().title
              }
              loading={saveOnboardingSpaceInfoMutation.isPending}
              startAdornment={<Send className="h-4 w-4" />}
            >
              {t('button-actions.submit')}
            </Button>
          )}
        </div>
      </div>
      <div className="w-9/12 max-w-[700px] max-sm:w-full flex flex-col gap-8 pt-8 pl-6 max-sm:pl-2 pb-12">
        <SelectInput
          required
          data-testid="type"
          label={t('columns.type')}
          placeholder={t('table.select-from-list')}
          options={spaceTypesOptions}
          value={getValues().type}
          onSelect={handleSelectChange('type')}
        />
        <SelectInput
          required
          data-testid="targets"
          label={t('columns.targets')}
          placeholder={t('table.select-from-list')}
          options={spaceTargetsOptions}
          value={getValues().targets}
          onSelect={handleSelectChange('targets')}
          multiple
        />
        <SelectInput
          required
          data-testid="conveniences"
          label={t('columns.conveniences')}
          placeholder={t('table.select-from-list')}
          options={conveniencesOptions}
          value={getValues().conveniences}
          onSelect={handleSelectChange('conveniences')}
          multiple
        />
        <TextInput
          required
          label={t('columns.name')}
          placeholder={t('columns.name')}
          value={getValues().title}
          onChange={handleChange('title')}
          fixedEndAdornment={
            <Button
              size="xs"
              variant="ghost"
              color="secondary"
              onClick={() => {
                if (lastVerification !== getValues().title) {
                  setLastVerification(getValues().title)
                  refetchVerifySpace()
                }
              }}
              disabled={
                isLoading ||
                !getValues().title ||
                lastVerification === getValues().title
              }
            >
              {isLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin text-utility-gray-500" />
              ) : data === 'unique' ? (
                <CircleCheck className="h-4 w-4 text-utility-success-500" />
              ) : data === 'exists' ? (
                <CircleX className="h-4 w-4 text-utility-error-500" />
              ) : (
                <Search
                  className={cn(
                    'h-4 w-4 text-utility-gray-700',
                    isLoading ||
                      !getValues().title ||
                      lastVerification === getValues().title
                      ? 'text-utility-gray-400'
                      : undefined,
                    !isLoading &&
                      lastVerification !== getValues().title &&
                      getValues().title
                      ? 'animate-bounce'
                      : undefined
                  )}
                />
              )}
            </Button>
          }
        />
        <TextEditorInput
          label={t('columns.description')}
          value={getValues().description}
          onChange={(val) =>
            setValue('description', val, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          placeholder={t('columns.description')}
          required
        />

        <div className="grid">
          <span className="text-sm font-medium text-utility-gray-700 mb-1.5">
            {t('columns.address')}
            {'*'}
          </span>
          <div className="w-full flex flex-col gap-2">
            <div className="flex w-full gap-2">
              <div className="w-2/3">
                <TextInput
                  placeholder={t('columns.street')}
                  value={getValues().street}
                  onChange={handleChange('street')}
                />
              </div>
              <div className="w-1/3">
                <TextInput
                  placeholder={t('columns.postal')}
                  value={getValues().postal}
                  onChange={handleChange('postal')}
                  className="w-full"
                  type="number"
                />
              </div>
            </div>
            <div className="flex w-full gap-2">
              <div className="w-full">
                <TextInput
                  placeholder={t('columns.locality')}
                  value={getValues().locality}
                  disabled
                />
              </div>
              <div className="w-full">
                <TextInput
                  placeholder={t('columns.city')}
                  value={getValues().city}
                  disabled
                />
              </div>
            </div>
            {getValues().latitude && getValues().longitude && (
              <>
                <div className="w-full h-96">
                  <MapInput
                    latitude={parseFloat(getValues().latitude)}
                    longitude={parseFloat(getValues().longitude)}
                    zoom={14}
                    onMove={(val) => {
                      setValue('latitude', val.latitude.toString(), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                      setValue('longitude', val.longitude.toString(), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }}
                  />
                </div>
                <div className="flex w-full gap-2">
                  <div className="w-full">
                    <TextInput
                      placeholder={t('columns.latitude')}
                      value={getValues().latitude}
                      onChange={handleChange('latitude')}
                      disabled={!getValues().locality}
                      type="number"
                    />
                  </div>
                  <div className="w-full">
                    <TextInput
                      placeholder={t('columns.longitude')}
                      value={getValues().longitude}
                      onChange={handleChange('longitude')}
                      disabled={!getValues().locality}
                      type="number"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <TextEditorInput
            label={t('columns.rules')}
            value={getValues().rules}
            onChange={(val) =>
              setValue('rules', val, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            placeholder={t('columns.rules')}
            required
          />
          <div className="flex flex-col w-full gap-3">
            <div className="flex items-center justify-between max-w-[430px] max-sm:max-w-full">
              <span className="text-sm font-normal text-utility-gray-700">
                {t('sections.onboarding.rules.allow_alcool')}
              </span>
              <RadioGroup
                onValueChange={(val) =>
                  setValue('allow_alcool', val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                defaultValue={getValues().allow_alcool}
                className="flex gap-2 items-center"
              >
                <div className="flex gap-1 items-center">
                  <RadioGroupItem value="true" />
                  <span className="text-sm font-bold text-utility-gray-700">
                    {t('actions.yes')}
                  </span>
                </div>
                <div className="flex gap-1 items-center">
                  <RadioGroupItem value="false" />
                  <span className="text-sm font-bold text-utility-gray-700">
                    {t('actions.no')}
                  </span>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between max-w-[430px] max-sm:max-w-full">
              <span className="text-sm font-normal text-utility-gray-700">
                {t('sections.onboarding.rules.allow_smoking')}
              </span>
              <RadioGroup
                onValueChange={(val) =>
                  setValue('allow_smoking', val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                defaultValue={getValues().allow_smoking}
                className="flex gap-2 items-center"
              >
                <div className="flex gap-1 items-center">
                  <RadioGroupItem value="true" />
                  <span className="text-sm font-bold text-utility-gray-700">
                    {t('actions.yes')}
                  </span>
                </div>
                <div className="flex gap-1 items-center">
                  <RadioGroupItem value="false" />
                  <span className="text-sm font-bold text-utility-gray-700">
                    {t('actions.no')}
                  </span>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between max-w-[430px] max-sm:max-w-full">
              <span className="text-sm font-normal text-utility-gray-700">
                {t('sections.onboarding.rules.allow_high_sound')}
              </span>
              <RadioGroup
                onValueChange={(val) =>
                  setValue('allow_high_sound', val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                defaultValue={getValues().allow_high_sound}
                className="flex gap-2 items-center"
              >
                <div className="flex gap-1 items-center">
                  <RadioGroupItem value="true" />
                  <span className="text-sm font-bold text-utility-gray-700">
                    {t('actions.yes')}
                  </span>
                </div>
                <div className="flex gap-1 items-center">
                  <RadioGroupItem value="false" />
                  <span className="text-sm font-bold text-utility-gray-700">
                    {t('actions.no')}
                  </span>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center justify-between max-w-[430px] max-sm:max-w-full">
              <span className="text-sm font-normal text-utility-gray-700">
                {t('sections.onboarding.rules.allow_pets')}
              </span>
              <RadioGroup
                onValueChange={(val) =>
                  setValue('allow_pets', val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                defaultValue={getValues().allow_pets}
                className="flex gap-2 items-center"
              >
                <div className="flex gap-1 items-center">
                  <RadioGroupItem value="true" />
                  <span className="text-sm font-bold text-utility-gray-700">
                    {t('actions.yes')}
                  </span>
                </div>
                <div className="flex gap-1 items-center">
                  <RadioGroupItem value="false" />
                  <span className="text-sm font-bold text-utility-gray-700">
                    {t('actions.no')}
                  </span>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        <TextInput
          label={t('columns.tour')}
          placeholder={t('columns.tour')}
          value={getValues().tour}
          onChange={handleChange('tour')}
        />
      </div>
    </form>
  )
}
