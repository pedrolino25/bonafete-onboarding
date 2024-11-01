'use client'

import { SelectInput } from '@/components/inputs/select-input/select-input'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import { toast } from '@/lib/hooks/use-toast'
import { stringToUrl } from '@/lib/utils/functions'
import {
  addService,
  getServicesList,
} from '@/services/api/onboarding-processes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface ServicesFormProps {
  defaultValues?: ServicesFormType
  onChange?: (values: ServicesFormType) => void
}

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
  disabled: z.any().optional(),
})

export const servicesFormSchema = z.object({
  services: z.array(optionSchema).min(1),
  new_service: z.string().optional(),
})

export type ServicesFormType = z.infer<typeof servicesFormSchema>

export default function ServicesForm({
  defaultValues,
  onChange,
}: ServicesFormProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { data, refetch } = useQuery({
    queryKey: ['services-list'],
    queryFn: async () => {
      return await getServicesList()
    },
  })

  const {
    setValue,
    watch,
    getValues,
    formState: { isValid },
  } = useForm<ServicesFormType>({
    resolver: zodResolver(servicesFormSchema),
    defaultValues: defaultValues,
  })

  const services = watch('services')
  const new_service = watch('new_service')

  useEffect(() => {
    if (isValid) {
      onChange?.(getValues())
    }
  }, [isValid, services])

  const addServiceMutation = useMutation({
    mutationFn: addService,
    onSuccess: async () => {
      await refetch()
      if (new_service) {
        setValue(
          'services',
          services && services?.length > 0
            ? [
                ...services,
                {
                  value: stringToUrl(new_service),
                  label: new_service,
                },
              ]
            : [
                {
                  value: stringToUrl(new_service),
                  label: new_service,
                },
              ],
          { shouldValidate: true, shouldDirty: true }
        )
        setValue('new_service', '', {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      setIsLoading(false)
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.submit'),
      })
    },
  })

  const handleSelectChange =
    (field: keyof ServicesFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  const handleChange =
    (field: keyof ServicesFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  const handleAddService = () => {
    if (new_service) {
      setIsLoading(true)
      addServiceMutation.mutate({
        key: stringToUrl(new_service),
        value: new_service,
      })
    }
  }

  return (
    <div className="w-full">
      <OnboardingFormLayout.Title>
        {t('sections.onboarding.package-form.services-title')}
      </OnboardingFormLayout.Title>
      <OnboardingFormLayout.Subtitle>
        {t('sections.onboarding.package-form.services-subtitle')}
      </OnboardingFormLayout.Subtitle>
      <OnboardingFormLayout.Container>
        <div className="grid grid-cols-5 max-sm:grid-cols-1 gap-4">
          <div className="col-span-3 max-sm:col-span-1">
            <SelectInput
              required
              data-testid="services"
              placeholder={t('table.select-from-list')}
              options={
                data?.map((item: { key: string; value: string }) => {
                  return {
                    value: item.key,
                    label: item.value,
                  }
                }) || []
              }
              value={services}
              onSelect={handleSelectChange('services')}
              useTranslation
              multiple
            />
          </div>
          <div className="w-full flex gap-4 col-span-2 max-sm:col-span-1">
            <div className="w-full">
              <TextInput
                data-testid="new_service"
                value={new_service}
                onChange={handleChange('new_service')}
                placeholder={t('sections.onboarding.package-form.new-service')}
                hint={
                  'Adicione o serviço caso não esteja disponível para selecionar'
                }
              />
            </div>
            <Button
              disabled={!new_service || isLoading}
              loading={isLoading}
              onClick={handleAddService}
            >
              {t('button-actions.add')}
            </Button>
          </div>
        </div>
        {isValid && (
          <OnboardingFormLayout.Info>
            {t(
              'sections.onboarding.package-form.explanation-messages.services'
            )}
          </OnboardingFormLayout.Info>
        )}
      </OnboardingFormLayout.Container>
    </div>
  )
}
