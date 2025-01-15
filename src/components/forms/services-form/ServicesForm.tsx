'use client'

import { SelectInput } from '@/components/inputs/select-input/select-input'
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
  addService,
  getServicesCategories,
  getServicesList,
  ServiceListItemResponse,
} from '@/services/api/onboardings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
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
  new_service_category: z.array(optionSchema).optional(),
})

export type ServicesFormType = z.infer<typeof servicesFormSchema>

export default function ServicesForm({
  defaultValues,
  onChange,
}: ServicesFormProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openAddService, setOpenAddService] = useState<boolean>(false)

  const { data: servicesList, refetch } = useQuery({
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
  const new_service_category = watch('new_service_category')

  useEffect(() => {
    if (isValid) {
      onChange?.(getValues())
    }
  }, [isValid, services])

  const addServiceMutation = useMutation({
    mutationFn: addService,
    onSuccess: async () => {
      const services = await refetch()
      if (new_service && services?.data) {
        setValue(
          'services',
          (services.data || [])
            .filter((item) => item.value === new_service)
            .map((item) => {
              return {
                value: item.id,
                label: item.value,
                info: item.serviceCategory.value,
              }
            }),
          {
            shouldValidate: true,
            shouldDirty: true,
          }
        )
        setValue('new_service', '', {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      setIsLoading(false)
      setOpenAddService(false)
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
    if (new_service && new_service_category) {
      setIsLoading(true)
      addServiceMutation.mutate({
        value: new_service,
        key: new_service,
        serviceCategory: {
          id: new_service_category[0].value,
        },
      })
    }
  }

  return (
    <div className="w-full">
      <OnboardingFormLayout.Title>
        {t('sections.onboarding.services-form.service-title')}
      </OnboardingFormLayout.Title>
      <OnboardingFormLayout.Subtitle>
        {t('sections.onboarding.services-form.service-subtitle')}
      </OnboardingFormLayout.Subtitle>
      <OnboardingFormLayout.Container>
        <div className="w-full flex gap-2">
          <SelectInput
            required
            data-testid="services"
            placeholder={t('table.select-from-list')}
            options={
              servicesList?.map((item: ServiceListItemResponse) => {
                return {
                  value: item.id,
                  label: item.value,
                  info: item.serviceCategory.value,
                }
              }) || []
            }
            value={services}
            onSelect={handleSelectChange('services')}
          />
          <Button
            className="px-3"
            endAdornment={<Plus className="w-4 h-4" />}
            onClick={() => setOpenAddService(true)}
            color="secondary"
          >
            {t('button-actions.create')}
          </Button>
        </div>

        <Dialog open={openAddService} onOpenChange={setOpenAddService}>
          <DialogContent className="sm:max-w-[425px] max-sm:max-w-100svw">
            <DialogHeader>
              <DialogTitle>
                {t('sections.onboarding.services-form.new-service-title')}
              </DialogTitle>
              <DialogDescription className="pt-2 pb-6">
                {t('sections.onboarding.services-form.new-service-subtitle')}
              </DialogDescription>
            </DialogHeader>
            <div className="w-full flex flex-col gap-4">
              <TextInput
                data-testid="new_service"
                value={new_service}
                onChange={handleChange('new_service')}
                placeholder={t('sections.onboarding.services-form.new-service')}
              />
              <SelectInput
                data-testid="new_service_category"
                placeholder={t(
                  'sections.onboarding.services-form.new-service-category'
                )}
                options={
                  servicesList ? getServicesCategories(servicesList) : []
                }
                value={new_service_category || []}
                onSelect={handleSelectChange('new_service_category')}
              />
            </div>
            <DialogFooter>
              <Button
                color="secondary"
                disabled={isLoading}
                onClick={() => setOpenAddService(false)}
              >
                {t('button-actions.cancel')}
              </Button>
              <Button
                disabled={!new_service || !new_service_category || isLoading}
                loading={isLoading}
                onClick={handleAddService}
              >
                {t('button-actions.add')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </OnboardingFormLayout.Container>
    </div>
  )
}
