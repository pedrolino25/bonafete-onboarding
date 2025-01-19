'use client'
import { TextEditorInput } from '@/components/inputs/text-editor-input/text-editor-input'
import { EditSpaceSectionLayout } from '@/components/layouts/edit-space-section'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/lib/hooks/use-toast'
import {
  OnboardingSpaceInfo,
  saveOnboardingSpaceRules,
} from '@/services/api/onboardings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Info, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import z from 'zod'

const spaceRulesFormSchema = z.object({
  allow_pets: z.string().min(1),
  allow_alcool: z.string().min(1),
  allow_smoking: z.string().min(1),
  allow_high_sound: z.string().min(1),
  has_security_cameras: z.string().min(1),
  rules: z.string().min(12),
})

export type SpaceRulesFormType = z.infer<typeof spaceRulesFormSchema>

interface SpaceRulesSectionProps {
  spaceInfo: OnboardingSpaceInfo
  onboardingId?: string
  defaultValues?: SpaceRulesFormType
  completed?: boolean
  showUpdateOnboardingStatus?: boolean
  onUpdateOnboardingStatus?: () => void
  refetch: () => void
}

export default function SpaceRulesSection({
  spaceInfo,
  onboardingId,
  defaultValues,
  completed,
  showUpdateOnboardingStatus,
  onUpdateOnboardingStatus,
  refetch,
}: SpaceRulesSectionProps) {
  const t = useTranslations()

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid, isDirty },
  } = useForm<SpaceRulesFormType>({
    mode: 'onChange',
    resolver: zodResolver(spaceRulesFormSchema),
    defaultValues,
  })

  const saveOnboardingSpaceRulesMutation = useMutation({
    mutationFn: saveOnboardingSpaceRules,
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

  const onSubmit = (values: SpaceRulesFormType) => {
    saveOnboardingSpaceRulesMutation.mutate({
      space_id: spaceInfo.space_id,
      onboarding_id: onboardingId,
      allow_pets: values.allow_pets || '',
      allow_alcool: values.allow_alcool || '',
      allow_smoking: values.allow_smoking || '',
      allow_high_sound: values.allow_high_sound || '',
      has_security_cameras: values.has_security_cameras || '',
      rules: values.rules || '',
    })
  }

  return (
    <form
      className="w-full max-sm:border-t max-sm:px-1 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full border-b px-6 max-sm:px-4 pb-4 flex justify-between items-center max-sm:flex-col">
        <div className="w-full">
          <EditSpaceSectionLayout.HeaderTitle>
            {t('sections.onboarding.space-rules-title')}
          </EditSpaceSectionLayout.HeaderTitle>
          <EditSpaceSectionLayout.HeaderSubtitle>
            {t('sections.onboarding.space-rules-subtitle')}
          </EditSpaceSectionLayout.HeaderSubtitle>
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
              saveOnboardingSpaceRulesMutation.isPending
            }
            loading={saveOnboardingSpaceRulesMutation.isPending}
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
              {t('sections.onboarding.rules-checks-title')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.rules-checks-subtitle')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <div className="flex flex-col w-full gap-4">
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
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>
        <EditSpaceSectionLayout.Container>
          <EditSpaceSectionLayout.Header>
            <EditSpaceSectionLayout.Title>
              {t('sections.onboarding.rules-aditional-title')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.rules-aditional-subtitle')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <TextEditorInput
              labelSmall
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
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>
      </div>
    </form>
  )
}
