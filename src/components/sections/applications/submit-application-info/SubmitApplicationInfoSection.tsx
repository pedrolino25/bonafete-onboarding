'use client'
import { SelectInput } from '@/components/inputs/select-input/select-input'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingSectionLayout } from '@/components/layouts/onboarding-section'
import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { BUSINESS_MODEL_OPTIONS } from '@/lib/utils/consts'
import {
  getUserApplications,
  UserApplicationsResponse,
} from '@/services/api/applications'
import {
  LocalityListItemResponse,
  SpaceTargetListItemResponse,
  SpaceTypeListItemResponse,
} from '@/services/api/static'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, CircleCheck, LoaderCircle, Search } from 'lucide-react'
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

const submitApplicationInfoFormSchema = z.object({
  id: z.string().optional(),
  lead_id: z.string().min(1),
  email: z.string().min(1),
  type: z.array(optionSchema).min(1),
  targets: z.array(optionSchema).min(1),
  locality: z.array(optionSchema).min(1),
  max_of_persons: z.string().min(1),
  business_model: z.array(optionSchema).min(1),
  email_validated: z.string().min(1),
})

export type SubmitApplicationInfoFormType = z.infer<
  typeof submitApplicationInfoFormSchema
>

interface SubmitApplicationInfoSectionProps {
  localitiesList: LocalityListItemResponse[]
  spaceTypesList: SpaceTypeListItemResponse[]
  spaceTargetsList: SpaceTargetListItemResponse[]
  defaultValues?: SubmitApplicationInfoFormType
  onGetUserApplication: (data: UserApplicationsResponse | undefined) => void
  onChange: (data: SubmitApplicationInfoFormType) => void
}

export default function SubmitApplicationInfoSection({
  localitiesList,
  spaceTypesList,
  spaceTargetsList,
  defaultValues,
  onGetUserApplication,
  onChange,
}: SubmitApplicationInfoSectionProps) {
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

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<SubmitApplicationInfoFormType>({
    mode: 'onChange',
    resolver: zodResolver(submitApplicationInfoFormSchema),
    defaultValues,
  })

  const onSubmit = (values: SubmitApplicationInfoFormType) => {
    onChange(values)
  }

  const handleChange =
    (field: keyof SubmitApplicationInfoFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  const handleSelectChange =
    (field: keyof SubmitApplicationInfoFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  const {
    isLoading,
    data,
    refetch: refetchGetUserApplications,
  } = useQuery({
    queryKey: ['user-applications', getValues().email],
    queryFn: async () => {
      return await getUserApplications(getValues().email)
    },
    enabled: false,
  })

  const [lastVerification, setLastVerification] = useState<string>(
    defaultValues?.email || ''
  )

  useEffect(() => {
    if (getValues().email !== defaultValues?.email) {
      if (data) {
        onGetUserApplication(data)
        setValue('id', data.id, {
          shouldValidate: true,
          shouldDirty: true,
        })
        if (data.lead_id) {
          setValue('lead_id', data.lead_id, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        if (data.type) {
          const spaceType = JSON.parse(data.type)
          setValue(
            'type',
            [
              {
                value: spaceType.id,
                label: spaceType.label,
              },
            ],
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          )
        }
        if (data.targets) {
          const spaceTargets = JSON.parse(data.targets)
          setValue(
            'targets',
            spaceTargets?.map((item: { id: string; label: string }) => {
              return {
                value: item.id,
                label: item.label,
              }
            }),
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          )
        }
        if (data.locality) {
          const spaceLocality = JSON.parse(data.locality)
          setValue(
            'locality',
            [
              {
                value: spaceLocality.value,
                label: spaceLocality.label,
              },
            ],
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          )
        }
        if (data.maxOfPersons) {
          setValue('max_of_persons', data.maxOfPersons, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        if (data.businessModel) {
          setValue(
            'business_model',
            [
              {
                value: data.businessModel,
                label: `business-model-options.${data.businessModel}`,
              },
            ],
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          )
        }
      } else {
        onGetUserApplication(undefined)
        setValue('type', [], {
          shouldValidate: true,
          shouldDirty: true,
        })
        setValue('targets', [], {
          shouldValidate: true,
          shouldDirty: true,
        })
        setValue('locality', [], {
          shouldValidate: true,
          shouldDirty: true,
        })
        setValue('max_of_persons', '', {
          shouldValidate: true,
          shouldDirty: true,
        })
        setValue('business_model', [], {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
    }
    setValue('email_validated', 'true', {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [data])

  useEffect(() => {
    if (getValues().email !== lastVerification) {
      setValue('email_validated', 'false', {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [getValues().email])

  return (
    <form
      className="w-full max-sm:border-t max-sm:px-1 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full border-b pb-4 flex justify-between items-center max-sm:flex-col">
        <div className="w-full">
          <OnboardingSectionLayout.Title>
            {t('sections.onboarding.application-info-title')}
          </OnboardingSectionLayout.Title>
          <OnboardingSectionLayout.Subtitle>
            {t('sections.onboarding.application-info-subtitle')}
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
        <TextInput
          required
          label={t('columns.lead_id')}
          placeholder={t('columns.lead_id')}
          value={getValues().lead_id}
          onChange={handleChange('lead_id')}
          disabled
        />
        <TextInput
          required
          label={t('columns.application-email')}
          placeholder={t('columns.email')}
          value={getValues().email}
          onChange={handleChange('email')}
          fixedEndAdornment={
            <Button
              size="xs"
              variant="ghost"
              color="secondary"
              onClick={() => {
                if (lastVerification !== getValues().email) {
                  refetchGetUserApplications()
                  setLastVerification(getValues().email)
                }
              }}
              disabled={
                isLoading ||
                !getValues().email ||
                lastVerification === getValues().email
              }
            >
              {isLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin text-utility-gray-500" />
              ) : lastVerification !== getValues().email ||
                !getValues().email ? (
                <Search
                  className={cn(
                    'h-4 w-4 text-utility-gray-700',
                    isLoading ||
                      !getValues().email ||
                      lastVerification === getValues().email
                      ? 'text-utility-gray-400'
                      : undefined,
                    !isLoading &&
                      lastVerification !== getValues().email &&
                      getValues().email
                      ? 'animate-bounce'
                      : undefined
                  )}
                />
              ) : (
                <CircleCheck className="h-4 w-4 text-utility-success-500" />
              )}
            </Button>
          }
        />
        <SelectInput
          required
          data-testid="locality"
          label={t('columns.locality')}
          placeholder={t('table.select-from-list')}
          options={localitiesList?.map((item) => {
            return {
              value: item.value,
              label: item.label,
            }
          })}
          value={getValues().locality}
          onSelect={handleSelectChange('locality')}
          disabled={
            getValues().email_validated !== 'true' || !getValues().email
          }
        />
        <SelectInput
          required
          data-testid="type"
          label={t('columns.type')}
          placeholder={t('table.select-from-list')}
          options={spaceTypesOptions}
          value={getValues().type}
          onSelect={handleSelectChange('type')}
          disabled={
            getValues().email_validated !== 'true' || !getValues().email
          }
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
          disabled={
            getValues().email_validated !== 'true' || !getValues().email
          }
        />
        <TextInput
          required
          label={t('columns.max_of_persons')}
          placeholder={t('columns.max_of_persons')}
          value={getValues().max_of_persons}
          onChange={handleChange('max_of_persons')}
          type="number"
          disabled={
            getValues().email_validated !== 'true' || !getValues().email
          }
        />
        <SelectInput
          required
          data-testid="business_model"
          label={t('columns.business_model')}
          placeholder={t('table.select-from-list')}
          options={BUSINESS_MODEL_OPTIONS}
          value={getValues().business_model}
          onSelect={handleSelectChange('business_model')}
          useTranslation
          disabled={
            getValues().email_validated !== 'true' || !getValues().email
          }
        />
      </div>
    </form>
  )
}
