'use client'

import { SelectInput } from '@/components/inputs/select-input/select-input'
import { TextEditorInput } from '@/components/inputs/text-editor-input/text-editor-input'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
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
import {
  deleteSpacePackage,
  getSpaceServicesList,
  OnboardingSpaceInfo,
  SpaceSchedule,
  SpaceServiceListItemResponse,
  updateSpacePackage,
} from '@/services/api/onboarding-processes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Clock, UsersRound } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import ScheduleForm, { scheduleFormSchema } from '../schedule-form/ScheduleForm'

interface SpacePackageFormProps {
  defaultValues?: SpacePackageFormType
  spaceInfo: OnboardingSpaceInfo
  completed?: boolean
  refetch: () => void
}

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
  disabled: z.any().optional(),
})

const spacePackageFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  services: z.array(optionSchema).min(1),
  description: z.string().min(12),
  schedule_form: scheduleFormSchema,
  min_hours: z.string().min(1),
  min_persons: z.string().min(1),
  max_persons: z.string().min(1),
})

export type SpacePackageFormType = z.infer<typeof spacePackageFormSchema>

export default function SpacePackageForm({
  spaceInfo,
  defaultValues,
  refetch,
}: SpacePackageFormProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)

  const { data: spaceServicesList } = useQuery({
    queryKey: ['space-services-list'],
    queryFn: async () => {
      return await getSpaceServicesList(spaceInfo.space_id)
    },
  })

  const getTimeLimit = () => {
    if (spaceInfo?.prices?.custom?.price_1) {
      const start = spaceInfo?.prices?.custom?.time_from_1
      const end =
        spaceInfo?.prices?.custom?.time_to_5 ||
        spaceInfo?.prices?.custom?.time_to_4 ||
        spaceInfo?.prices?.custom?.time_to_3 ||
        spaceInfo?.prices?.custom?.time_to_2
      return {
        start,
        end,
      }
    }
    return undefined
  }
  const [timeLimit] = useState<{ start: Option[]; end: Option[] } | undefined>(
    getTimeLimit()
  )

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isDirty },
  } = useForm<SpacePackageFormType>({
    resolver: zodResolver(spacePackageFormSchema),
    defaultValues: {
      ...defaultValues,
      max_persons:
        defaultValues?.max_persons || spaceInfo?.lotation?.lotation?.toString(),
      schedule_form: defaultValues?.schedule_form || spaceInfo?.schedule,
    },
  })

  const package_id = watch('id')
  const services = watch('services')
  const description = watch('description')
  const min_hours = watch('min_hours')
  const min_persons = watch('min_persons')
  const max_persons = watch('max_persons')
  const name = watch('name')
  const schedule_form = watch('schedule_form')

  const handleSelectChange =
    (field: keyof SpacePackageFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  const handleChange =
    (field: keyof SpacePackageFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[.,]/g, '')
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  const getSpaceScheduleObject = (
    values: SpacePackageFormType
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

  const deleteSpacePackageMutation = useMutation({
    mutationFn: deleteSpacePackage,
    onSuccess: () => {
      refetch()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.delete-package'),
      })
    },
    onError: () => {
      refetch()
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.delete-package'),
      })
    },
  })

  const updateSpacePackageMutation = useMutation({
    mutationFn: updateSpacePackage,
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

  const onSubmit = (values: SpacePackageFormType) => {
    if (spaceInfo.space_id) {
      setIsLoading(true)
      const data = {
        space_id: spaceInfo.space_id,
        id: values.id,
        name: values.name,
        services: values.services?.map((item) => {
          return {
            spaceService: {
              id: item.value,
            },
          }
        }),
        description: values.description,
        schedule: getSpaceScheduleObject(values),
        min_hours: values.min_hours,
        min_persons: values.min_persons,
        max_persons: values.max_persons,
      }
      updateSpacePackageMutation.mutate(data)
    }
  }

  const handleDelete = () => {
    setOpenDelete(true)
  }

  return (
    <OnboardingFormLayout.Root>
      <div className="w-full">
        <OnboardingFormLayout.Title>
          {t('sections.onboarding.package-form.name-title')}
        </OnboardingFormLayout.Title>
        <OnboardingFormLayout.Subtitle>
          {t('sections.onboarding.package-form.name-subtitle')}
        </OnboardingFormLayout.Subtitle>
        <OnboardingFormLayout.Container>
          <TextInput
            data-testid="name"
            value={name}
            onChange={handleChange('name')}
            placeholder={t('sections.onboarding.package-form.name')}
          />
        </OnboardingFormLayout.Container>
      </div>

      <OnboardingFormLayout.Main>
        <OnboardingFormLayout.Title>
          {t('sections.onboarding.package-form.services-title')}
        </OnboardingFormLayout.Title>
        <OnboardingFormLayout.Subtitle>
          {t('sections.onboarding.package-form.services-subtitle')}
        </OnboardingFormLayout.Subtitle>
        <OnboardingFormLayout.Container>
          <SelectInput
            required
            data-testid="services"
            placeholder={t('table.select-from-list')}
            options={
              spaceServicesList?.map((item: SpaceServiceListItemResponse) => {
                return {
                  value: item.id,
                  label: item.service.value,
                  info: item.service.serviceCategory.value,
                }
              }) || []
            }
            value={services}
            onSelect={handleSelectChange('services')}
            multiple
          />
        </OnboardingFormLayout.Container>
      </OnboardingFormLayout.Main>

      <OnboardingFormLayout.Main>
        <OnboardingFormLayout.Title>
          {t('sections.onboarding.package-form.min-hours-persons-title')}
        </OnboardingFormLayout.Title>
        <OnboardingFormLayout.Subtitle>
          {t('sections.onboarding.package-form.min-hours-persons-subtitle')}
        </OnboardingFormLayout.Subtitle>
        <OnboardingFormLayout.Container>
          <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4">
            <TextInput
              data-testid="min_hours"
              value={min_hours}
              onChange={handleChange('min_hours')}
              type="number"
              placeholder={t('sections.onboarding.package-form.min-hours')}
              fixedEndAdornment={
                <div className="px-3 pt-2.5 text-sm">
                  <Clock className="h-4 w-4" />
                </div>
              }
            />
            <TextInput
              data-testid="min_persons"
              value={min_persons}
              onChange={handleChange('min_persons')}
              type="number"
              placeholder={t('sections.onboarding.package-form.min-persons')}
              fixedEndAdornment={
                <div className="px-3 pt-2.5 text-sm">
                  <UsersRound className="h-4 w-4" />
                </div>
              }
            />
            <TextInput
              data-testid="max_persons"
              value={max_persons}
              onChange={handleChange('max_persons')}
              type="number"
              placeholder={t('sections.onboarding.package-form.max-persons')}
              fixedEndAdornment={
                <div className="px-3 pt-2.5 text-sm">
                  <UsersRound className="h-4 w-4" />
                </div>
              }
            />
          </div>
          {min_hours && min_persons && max_persons && (
            <OnboardingFormLayout.Info>
              {t(
                'sections.onboarding.package-form.explanation-messages.min-hours-persons'
              )
                .replace('$1', min_hours)
                .replace('$2', min_persons)
                .replace('$3', max_persons)}
            </OnboardingFormLayout.Info>
          )}
        </OnboardingFormLayout.Container>
      </OnboardingFormLayout.Main>
      <ScheduleForm
        disabled={!min_hours}
        info={{
          minHours: min_hours ? parseInt(min_hours) : 1,
          limits: timeLimit
            ? {
                start: timeLimit.start,
                end: timeLimit.end,
              }
            : undefined,
          addUnavailable: true,
        }}
        defaultValues={defaultValues?.schedule_form || schedule_form}
        title={t('sections.onboarding.package-form.schedule-title')}
        subtitle={t('sections.onboarding.package-form.schedule-subtitle')}
        onChange={(value) =>
          setValue('schedule_form', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      <OnboardingFormLayout.Main>
        <OnboardingFormLayout.Title>
          {t('sections.onboarding.package-form.description-title')}
        </OnboardingFormLayout.Title>
        <OnboardingFormLayout.Subtitle>
          {t('sections.onboarding.package-form.description-subtitle')}
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
            <DialogTitle>{t('titles.delete-package')}</DialogTitle>
            <DialogDescription className="pt-2 pb-6">
              {t('subtitles.delete-package')}
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
                deleteSpacePackageMutation.mutate({
                  id: package_id as string,
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
