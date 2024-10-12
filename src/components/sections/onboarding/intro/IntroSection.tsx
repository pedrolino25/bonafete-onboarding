import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/lib/hooks/use-toast'
import {
  OnboardingProcessItemResponse,
  saveOnboardingIntro,
} from '@/services/api/onboarding-processes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FileSearch, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface OnboardingIntroProps {
  onboardingInfo: OnboardingProcessItemResponse
  completed?: boolean
  refetch: () => void
}

const onboardingIntroFormSchema = z.object({
  question_1: z.boolean().refine((val) => val === true),
  question_2: z.boolean().refine((val) => val === true),
  question_3: z.boolean().refine((val) => val === true),
  question_4: z.boolean().refine((val) => val === true),
  question_5: z.boolean().refine((val) => val === true),
  question_6: z.boolean().refine((val) => val === true),
})

type OnboardingIntroFormSchema = z.infer<typeof onboardingIntroFormSchema>

export default function OnboardingIntro({
  onboardingInfo,
  completed,
  refetch,
}: OnboardingIntroProps) {
  const t = useTranslations()

  const saveOnboardingIntroMutation = useMutation({
    mutationFn: saveOnboardingIntro,
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

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<OnboardingIntroFormSchema>({
    resolver: zodResolver(onboardingIntroFormSchema),
    defaultValues: {
      question_1: completed,
      question_2: completed,
      question_3: completed,
      question_4: completed,
      question_5: completed,
      question_6: completed,
    },
  })

  const onSubmit = (values: OnboardingIntroFormSchema) => {
    if (
      values.question_1 &&
      values.question_2 &&
      values.question_3 &&
      values.question_4 &&
      values.question_5 &&
      values.question_6
    ) {
      saveOnboardingIntroMutation.mutate({ id: onboardingInfo.id })
    }
  }

  return (
    <form
      className="w-full max-sm:border-t max-sm:px-4 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full border-b pb-4 flex justify-between items-center max-sm:flex-col">
        <div>
          <h3 className="text-lg font-semibold text-utility-brand-600">
            {t('sections.onboarding.introduction-title')}
          </h3>
          <p className="text-sm font-light text-utility-gray-500 pt-1 pr-4">
            {t('sections.onboarding.introduction-subtitle')}
          </p>
        </div>
        <div className="flex justify-between items-center gap-4 max-sm:items-start max-sm:pt-4 max-sm:w-full">
          <Button
            startAdornment={<FileSearch className="w-4 h-4" />}
            color="secondary"
            variant="ghost"
          >
            {t('sections.onboarding.documentation')}
          </Button>
          <Button
            type="submit"
            disabled={!isValid || completed}
            startAdornment={<Send className="h-4 w-4" />}
          >
            {t('button-actions.submit')}
          </Button>
        </div>
      </div>
      <div className="w-9/12 max-w-[700px] max-sm:w-full flex flex-col gap-4 pt-8 pl-6 max-sm:pl-2 pb-12">
        <div className="w-full flex items-center justify-between">
          <p className="w-10/12 font-medium tex-sm text-utility-gray-600">
            {t('sections.onboarding.form-question-1')}
          </p>
          <Checkbox
            checked={getValues('question_1')}
            onCheckedChange={(val) => {
              setValue('question_1', val as boolean, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }}
            disabled={completed}
          />
        </div>
        <div className="w-full flex items-center justify-between">
          <p className="w-10/12 font-medium tex-sm text-utility-gray-600">
            {t('sections.onboarding.form-question-2')}
          </p>
          <Checkbox
            checked={getValues('question_2')}
            onCheckedChange={(val) => {
              setValue('question_2', val as boolean, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }}
            disabled={completed}
          />
        </div>
        <div className="w-full flex items-center justify-between">
          <p className="w-10/12 font-medium tex-sm text-utility-gray-600">
            {t('sections.onboarding.form-question-3')}
          </p>
          <Checkbox
            checked={getValues('question_3')}
            onCheckedChange={(val) => {
              setValue('question_3', val as boolean, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }}
            disabled={completed}
          />
        </div>
        <div className="w-full flex items-center justify-between">
          <p className="w-10/12 font-medium tex-sm text-utility-gray-600">
            {t('sections.onboarding.form-question-4')}
          </p>
          <Checkbox
            checked={getValues('question_4')}
            onCheckedChange={(val) => {
              setValue('question_4', val as boolean, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }}
            disabled={completed}
          />
        </div>
        <div className="w-full flex items-center justify-between">
          <p className="w-10/12 font-medium tex-sm text-utility-gray-600">
            {t('sections.onboarding.form-question-5')}
          </p>
          <Checkbox
            checked={getValues('question_5')}
            onCheckedChange={(val) => {
              setValue('question_5', val as boolean, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }}
            disabled={completed}
          />
        </div>
        <div className="w-full flex items-center justify-between">
          <p className="w-10/12 font-medium tex-sm text-utility-gray-600">
            {t('sections.onboarding.form-question-6')}
          </p>
          <Checkbox
            checked={getValues('question_6')}
            onCheckedChange={(val) => {
              setValue('question_6', val as boolean, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }}
            disabled={completed}
          />
        </div>
      </div>
    </form>
  )
}
