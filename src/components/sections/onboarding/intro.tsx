import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileSearch } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import z from 'zod'

export default function OnboardingIntro() {
  const t = useTranslations()

  const onboardingIntroFormSchema = z.object({
    question_1: z.boolean().refine((val) => val === true),
    question_2: z.boolean().refine((val) => val === true),
    question_3: z.boolean().refine((val) => val === true),
    question_4: z.boolean().refine((val) => val === true),
    question_5: z.boolean().refine((val) => val === true),
  })

  type OnboardingIntroFormSchema = z.infer<typeof onboardingIntroFormSchema>

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<OnboardingIntroFormSchema>({
    resolver: zodResolver(onboardingIntroFormSchema),
    defaultValues: {
      question_1: false,
      question_2: false,
      question_3: false,
      question_4: false,
      question_5: false,
    },
  })

  const onSubmit = (values: OnboardingIntroFormSchema) => {
    console.log(values)
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
          <p className="text-sm font-light text-utility-gray-500 pt-1">
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
          <Button type="submit" disabled={!isValid}>
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
          />
        </div>
      </div>
    </form>
  )
}
