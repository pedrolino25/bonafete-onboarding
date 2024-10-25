'use client'

import { SelectInput } from '@/components/inputs/select-input/select-input'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import { toast } from '@/lib/hooks/use-toast'
import { stringToUrl } from '@/lib/utils/functions'
import { addExtra, getExtrasList } from '@/services/api/onboarding-processes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface ExtrasFormProps {
  defaultValues?: ExtrasFormType
  onChange?: (values: ExtrasFormType) => void
}

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
  disabled: z.any().optional(),
})

export const extrasFormSchema = z.object({
  extras: z.array(optionSchema).min(1),
  new_extra: z.string().optional(),
})

export type ExtrasFormType = z.infer<typeof extrasFormSchema>

export default function ExtrasForm({
  defaultValues,
  onChange,
}: ExtrasFormProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { data, refetch } = useQuery({
    queryKey: ['extras-list'],
    queryFn: async () => {
      return await getExtrasList()
    },
  })

  const {
    setValue,
    watch,
    getValues,
    formState: { isValid },
  } = useForm<ExtrasFormType>({
    resolver: zodResolver(extrasFormSchema),
    defaultValues: defaultValues,
  })

  const extras = watch('extras')
  const new_extra = watch('new_extra')

  useEffect(() => {
    if (isValid) {
      onChange?.(getValues())
    }
  }, [isValid, extras])

  const addExtraMutation = useMutation({
    mutationFn: addExtra,
    onSuccess: async () => {
      await refetch()
      if (new_extra) {
        setValue(
          'extras',
          extras && extras?.length > 0
            ? [
                ...extras,
                {
                  value: stringToUrl(new_extra),
                  label: new_extra,
                },
              ]
            : [
                {
                  value: stringToUrl(new_extra),
                  label: new_extra,
                },
              ],
          { shouldValidate: true, shouldDirty: true }
        )
        setValue('new_extra', '', {
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
    (field: keyof ExtrasFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  const handleChange =
    (field: keyof ExtrasFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  const handleAddExtra = () => {
    if (new_extra) {
      setIsLoading(true)
      addExtraMutation.mutate({
        extra: new_extra,
      })
    }
  }

  return (
    <div className="w-full">
      <OnboardingFormLayout.Title>
        {t('sections.onboarding.extra-form.extra-title')}
      </OnboardingFormLayout.Title>
      <OnboardingFormLayout.Subtitle>
        {t('sections.onboarding.extra-form.extra-subtitle')}
      </OnboardingFormLayout.Subtitle>
      <OnboardingFormLayout.Container>
        <SelectInput
          required
          data-testid="extras"
          placeholder={t('table.select-from-list')}
          options={
            data?.map((item: { key: string; value: string }) => {
              return {
                value: item.key,
                label: item.value,
              }
            }) || []
          }
          value={extras}
          onSelect={handleSelectChange('extras')}
          useTranslation
        />
        <div className="w-full flex gap-4">
          <div className="w-full">
            <TextInput
              data-testid="new_extra"
              value={new_extra}
              onChange={handleChange('new_extra')}
              placeholder={t('sections.onboarding.extra-form.new-extra')}
              hint={
                'Adicione o extra caso não esteja disponível para selecionar'
              }
            />
          </div>
          <Button
            disabled={!new_extra || isLoading}
            loading={isLoading}
            onClick={handleAddExtra}
          >
            {t('button-actions.add')}
          </Button>
        </div>
      </OnboardingFormLayout.Container>
    </div>
  )
}
