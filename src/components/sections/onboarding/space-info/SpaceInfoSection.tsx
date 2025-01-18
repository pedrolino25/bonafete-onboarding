'use client'
import LotationForm, {
  lotationFormSchema,
} from '@/components/forms/lotation-form/LotationForm'
import ScheduleForm, {
  scheduleFormSchema,
} from '@/components/forms/schedule-form/ScheduleForm'
import { MapInput } from '@/components/inputs/map-input/map-input'
import { SelectInput } from '@/components/inputs/select-input/select-input'
import { TextEditorInput } from '@/components/inputs/text-editor-input/text-editor-input'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { EditSpaceSectionLayout } from '@/components/layouts/edit-space-section'
import { OnboardingSectionLayout } from '@/components/layouts/onboarding-section'
import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import { toast } from '@/lib/hooks/use-toast'
import { cn, splitCommaGetFirst } from '@/lib/utils'
import {
  OnboardingSpaceInfo,
  saveOnboardingSpaceInfo,
  SpaceSchedule,
} from '@/services/api/onboardings'
import {
  LocalityListItemResponse,
  PostalCodesListItemResponse,
  SpaceConvenienceListItem,
  SpaceTargetListItemResponse,
  SpaceTypeListItemResponse,
} from '@/services/api/reference-data'
import { verifySpaceTitle } from '@/services/api/spaces'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  CircleCheck,
  CircleX,
  Info,
  LoaderCircle,
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
  street: z.string().min(1),
  postal: z.string().min(1),
  locality: z.string().min(1),
  city: z.string().min(1),
  latitude: z.string(),
  longitude: z.string(),
  schedule_form: scheduleFormSchema,
  lotation_form: lotationFormSchema,
})

export type SpaceInfoFormType = z.infer<typeof spaceInfoFormSchema>

interface SpaceInfoSectionProps {
  spaceInfo: OnboardingSpaceInfo
  localitiesList: LocalityListItemResponse[]
  conveniencesList: SpaceConvenienceListItem[]
  spaceTypesList: SpaceTypeListItemResponse[]
  spaceTargetsList: SpaceTargetListItemResponse[]
  postalCodesList: PostalCodesListItemResponse[]
  onboardingId?: string
  defaultValues?: SpaceInfoFormType
  completed?: boolean
  showUpdateOnboardingStatus?: boolean
  onUpdateOnboardingStatus?: () => void
  refetch: () => void
}

export default function SpaceInfoSection({
  spaceInfo,
  localitiesList,
  postalCodesList,
  conveniencesList,
  spaceTypesList,
  spaceTargetsList,
  onboardingId,
  defaultValues,
  completed,
  showUpdateOnboardingStatus,
  onUpdateOnboardingStatus,
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
    conveniencesList?.map((option) => {
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
    formState: { isValid, isDirty },
  } = useForm<SpaceInfoFormType>({
    mode: 'onChange',
    resolver: zodResolver(spaceInfoFormSchema),
    defaultValues,
  })

  const {
    isLoading,
    data,
    refetch: refetchVerifySpace,
  } = useQuery({
    queryKey: ['space-name', getValues().title],
    queryFn: async () => {
      return await verifySpaceTitle(getValues().title, spaceInfo?.space_id)
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
    spaceInfo?.title || ''
  )

  const getSpaceScheduleObject = (
    values: SpaceInfoFormType
  ): SpaceSchedule[] => {
    let schedule: SpaceSchedule[] = []
    if (values.schedule_form) {
      schedule = [
        {
          weekDay: 'monday',
          timeStart:
            values.schedule_form.monday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.monday_from[0].value,
          timeEnd: values.schedule_form.monday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
        {
          weekDay: 'tuesday',
          timeStart:
            values.schedule_form.tuesday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.tuesday_from[0].value,
          timeEnd: values.schedule_form.tuesday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
        {
          weekDay: 'wednesday',
          timeStart:
            values.schedule_form.wednesday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.wednesday_from[0].value,
          timeEnd: values.schedule_form.wednesday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
        {
          weekDay: 'thursday',
          timeStart:
            values.schedule_form.thursday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.thursday_from[0].value,
          timeEnd: values.schedule_form.thursday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
        {
          weekDay: 'friday',
          timeStart:
            values.schedule_form.friday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.friday_from[0].value,
          timeEnd: values.schedule_form.friday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
        {
          weekDay: 'saturday',
          timeStart:
            values.schedule_form.saturday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.saturday_from[0].value,
          timeEnd: values.schedule_form.saturday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
        {
          weekDay: 'sunday',
          timeStart:
            values.schedule_form.sunday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.sunday_from[0].value,
          timeEnd: values.schedule_form.sunday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
      ]
    }
    return schedule
  }

  const onSubmit = (values: SpaceInfoFormType) => {
    saveOnboardingSpaceInfoMutation.mutate({
      space_id: spaceInfo.space_id,
      onboarding_id: onboardingId,
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
      street: values.street,
      postal: values.postal,
      locality: values.locality,
      city_id: values.city
        ? localitiesList?.find(
            (item) => splitCommaGetFirst(item.title) === values.city
          )?.id
        : undefined,
      city: values.city,
      latitude: values.latitude ? parseFloat(values.latitude) : undefined,
      longitude: values.longitude ? parseFloat(values.longitude) : undefined,
      schedule: getSpaceScheduleObject(values),
      lotation: parseInt(values.lotation_form.lotation || '1'),
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
          (item) => item.postalCode.toString() === value.substring(0, 4)
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
      className="w-full max-sm:border-t max-sm:px-1 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full border-b px-6 max-sm:px-4 pb-4 flex justify-between items-center max-sm:flex-col">
        <div className="w-full">
          <OnboardingSectionLayout.Title>
            {t('sections.onboarding.space-info-title')}
          </OnboardingSectionLayout.Title>
          <OnboardingSectionLayout.Subtitle>
            {t('sections.onboarding.space-info-subtitle')}
          </OnboardingSectionLayout.Subtitle>
        </div>
        <div className="flex justify-between items-center gap-4 max-sm:justify-end max-sm:items-start max-sm:pt-4 max-sm:w-full">
          {showUpdateOnboardingStatus && (
            <Button
              startAdornment={<Info className="h-4 w-4" />}
              color="secondary"
              variant="fill"
              onClick={() => onUpdateOnboardingStatus?.()}
            >
              {t('button-actions.update-needed')}
            </Button>
          )}
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
        </div>
      </div>
      <div className="w-full">
        <EditSpaceSectionLayout.Container>
          <EditSpaceSectionLayout.Header>
            <EditSpaceSectionLayout.Title>
              {t('sections.onboarding.about-title')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.about-subtitle')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <SelectInput
              required
              labelSmall
              data-testid="type"
              label={t('columns.type')}
              placeholder={t('table.select-from-list')}
              options={spaceTypesOptions}
              value={getValues().type}
              onSelect={handleSelectChange('type')}
            />
            <TextInput
              required
              labelSmall
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
              labelSmall
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
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>

        <EditSpaceSectionLayout.Container>
          <EditSpaceSectionLayout.Header>
            <EditSpaceSectionLayout.Title>
              {t('sections.onboarding.conveniences-title')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.conveniences-subtitle')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <SelectInput
              labelSmall
              required
              data-testid="conveniences"
              label={t('columns.conveniences')}
              placeholder={t('table.select-from-list')}
              options={conveniencesOptions}
              value={getValues().conveniences}
              onSelect={handleSelectChange('conveniences')}
              multiple
            />
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>

        <EditSpaceSectionLayout.Container>
          <EditSpaceSectionLayout.Header>
            <EditSpaceSectionLayout.Title>
              {t('sections.onboarding.targets-title')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.targets-subtitle')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <SelectInput
              required
              labelSmall
              data-testid="targets"
              label={t('columns.targets')}
              placeholder={t('table.select-from-list')}
              options={spaceTargetsOptions}
              value={getValues().targets}
              onSelect={handleSelectChange('targets')}
              multiple
            />
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>

        <EditSpaceSectionLayout.Container>
          <EditSpaceSectionLayout.Header>
            <EditSpaceSectionLayout.Title>
              {t('sections.onboarding.address-title')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.address-subtitle')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <div className="grid">
              <span className="text-xs font-light text-utility-gray-600 mb-1.5">
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
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>

        <EditSpaceSectionLayout.Container>
          <EditSpaceSectionLayout.Header>
            <EditSpaceSectionLayout.Title>
              {t('sections.onboarding.lotation-title')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.lotation-subtitle')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <LotationForm
              defaultValues={defaultValues?.lotation_form}
              onChange={(value) =>
                setValue('lotation_form', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>

        <EditSpaceSectionLayout.Container>
          <EditSpaceSectionLayout.Header>
            <EditSpaceSectionLayout.Title>
              {t('sections.onboarding.schedule-title')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.schedule-subtitle')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <ScheduleForm
              info={{
                minHours: 1,
              }}
              defaultValues={defaultValues?.schedule_form}
              onChange={(value) =>
                setValue('schedule_form', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>

        <EditSpaceSectionLayout.Container>
          <EditSpaceSectionLayout.Header>
            <EditSpaceSectionLayout.Title>
              {t('sections.onboarding.tour-title')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.tour-subtitle')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <TextInput
              labelSmall
              label={t('columns.tour')}
              placeholder={t('columns.tour')}
              value={getValues().tour}
              onChange={handleChange('tour')}
            />
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>
      </div>
    </form>
  )
}
