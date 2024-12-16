import { OnboardingSectionLayout } from '@/components/layouts/onboarding-section'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/lib/hooks/use-toast'
import {
  OnboardingProcessItemResponse,
  saveOnboardingIntro,
} from '@/services/api/onboardings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FileDown, FileSearch, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface OnboardingIntroProps {
  onboardingInfo: OnboardingProcessItemResponse
  documentation: { offers: string[]; kyc: string[] }
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

type OnboardingIntroFormType = z.infer<typeof onboardingIntroFormSchema>

export default function OnboardingIntro({
  onboardingInfo,
  documentation,
  completed,
  refetch,
}: OnboardingIntroProps) {
  const t = useTranslations()
  const [openDocuments, setOpenDocuments] = useState<boolean>(false)

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
  } = useForm<OnboardingIntroFormType>({
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

  const onSubmit = (values: OnboardingIntroFormType) => {
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
      className="w-full max-sm:border-t max-sm:px-2 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full border-b pb-4 flex justify-between items-center max-sm:flex-col">
        <div className="w-full">
          <OnboardingSectionLayout.Title>
            {t('sections.onboarding.introduction-title')}
          </OnboardingSectionLayout.Title>
          <OnboardingSectionLayout.Subtitle>
            {t('sections.onboarding.introduction-subtitle')}
          </OnboardingSectionLayout.Subtitle>
        </div>
        <div className="flex justify-between items-center gap-4 max-sm:items-start max-sm:pt-4 max-sm:w-full">
          <Button
            startAdornment={<FileSearch className="w-4 h-4" />}
            color="secondary"
            variant="ghost"
            onClick={() => setOpenDocuments(true)}
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
      <div className="w-9/12 max-w-[700px] max-sm:w-full flex flex-col gap-4 pt-8 pl-6 max-sm:pl-0 pb-12">
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

      <Dialog open={openDocuments} onOpenChange={setOpenDocuments}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('sections.onboarding.documentation')}</DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full">
              <p className="text-utility-gray-600 text-base font-normal pb-2">
                Ofertas
              </p>
              {documentation?.offers?.map((item, index) => {
                return (
                  <a
                    key={index}
                    href={item}
                    target="_blank"
                    className="w-full cursor-pointer p-2 border rounded-xl flex justify-between items-center mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-light text-utility-gray-500">
                        {item?.split('/')[item?.split('/')?.length - 1]}
                      </p>
                    </div>
                    <FileDown className="w-4 h-4 text-utility-gray-500 cursor-pointer hover:text-utility-gray-900" />
                  </a>
                )
              })}
              <p className="text-utility-gray-600 text-base font-normal pb-2 pt-4">
                KYC
              </p>
              {documentation?.kyc?.map((item, index) => {
                return (
                  <a
                    key={index}
                    href={item}
                    target="_blank"
                    className="w-full cursor-pointer p-2 border rounded-xl flex justify-between items-center mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-light text-utility-gray-500">
                        {item?.split('/')[item?.split('/')?.length - 1]}
                      </p>
                    </div>
                    <FileDown className="w-4 h-4 text-utility-gray-500 cursor-pointer hover:text-utility-gray-900" />
                  </a>
                )
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  )
}
