'use client'
import { SelectInput } from '@/components/inputs/select-input/select-input'
import { StripeDocsInput } from '@/components/inputs/stripe-docs-input/stripe-docs-input'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { OnboardingSectionLayout } from '@/components/layouts/onboarding-section'
import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import { toast } from '@/lib/hooks/use-toast'
import { COMPANY_TYPE_OPTIONS, CompanyType } from '@/lib/utils/consts'
import {
  finishOnboarding,
  OnboardingProcessItemResponse,
  updateHostInfo,
  updateOnboardingStatus,
} from '@/services/api/onboardings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useStripe } from '@stripe/react-stripe-js'
import { useMutation } from '@tanstack/react-query'
import { Info, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { OnboardingFaseStatus, OnboardingSections } from '../OnboardingSection'

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
  disabled: z.any().optional(),
})

const hostInfoFormSchema = z
  .object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    birth_date: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    postal_code: z.string(),
    nif: z.string(),
    company_type: z.array(optionSchema),
    company_name: z.string().optional(),
    company_phone: z.string().optional(),
    company_email: z.string().optional(),
    company_address: z.string().optional(),
    company_city: z.string().optional(),
    company_postal_code: z.string().optional(),
    account_owner: z.string(),
    account_token: z.string(),
    iban: z.string(),
  })
  .refine((data) => {
    if (data.company_type?.[0]?.value === CompanyType.Company) {
      return (
        data.company_name &&
        data.company_phone &&
        data.company_email &&
        data.company_address &&
        data.company_city &&
        data.company_postal_code
      )
    } else {
      return true
    }
  })

type HostInfoFormType = z.infer<typeof hostInfoFormSchema>

interface HostInfoSectionProps {
  onboardingInfo: OnboardingProcessItemResponse
  completed?: boolean
  refetch: () => void
}

export default function HostInfoSection({
  onboardingInfo,
  refetch,
}: HostInfoSectionProps) {
  const t = useTranslations()
  const router = useRouter()
  const stripe = useStripe()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isVerificationComplete =
    onboardingInfo?.host?.requirements?.identity_proof?.front &&
    onboardingInfo?.host?.requirements?.identity_proof?.back &&
    onboardingInfo?.host?.requirements?.address_proof &&
    onboardingInfo?.host?.requirements?.iban_proof &&
    (onboardingInfo?.host?.requirements?.company_proof ||
      onboardingInfo?.host?.company_type?.[0]?.value === CompanyType.Individual)

  const isComplete =
    isVerificationComplete &&
    onboardingInfo.fase1 === OnboardingFaseStatus.Completed &&
    onboardingInfo.fase2 === OnboardingFaseStatus.Completed &&
    onboardingInfo.fase3 === OnboardingFaseStatus.Completed &&
    onboardingInfo.fase4 === OnboardingFaseStatus.Completed &&
    onboardingInfo.fase5 === OnboardingFaseStatus.Completed

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid, isDirty },
  } = useForm<HostInfoFormType>({
    mode: 'onChange',
    resolver: zodResolver(hostInfoFormSchema),
    defaultValues: {
      ...onboardingInfo.host,
      id: onboardingInfo.space.host_id,
    },
  })

  const handleChange =
    (field: keyof HostInfoFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  const handleSelectChange =
    (field: keyof HostInfoFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  const submitBankAccount = async () => {
    const bankToken = await stripe?.createToken('bank_account', {
      country: 'pt',
      currency: 'EUR',
      account_number: getValues().iban,
      account_holder_type: getValues().company_type?.[0]?.value,
      account_holder_name: getValues().account_owner,
    })
    if (bankToken?.error) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.submit'),
      })
    } else if (bankToken?.token) {
      setValue('account_token', bankToken.token.id, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }

  const updateHostInfoMutation = useMutation({
    mutationFn: updateHostInfo,
    onSuccess: () => {
      setIsLoading(false)
      refetch?.()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.submit'),
      })
    },
    onError: () => {
      setIsLoading(false)
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.submit'),
      })
    },
  })

  const updateOnboardingStatusMutation = useMutation({
    mutationFn: updateOnboardingStatus,
    onSuccess: () => {
      refetch?.()
    },
  })

  const finishOnboardingMutation = useMutation({
    mutationFn: finishOnboarding,
    onSuccess: () => {
      router.push('/processes/completed')
    },
  })

  const onSubmit = (values: HostInfoFormType) => {
    setIsLoading(true)
    updateHostInfoMutation.mutate({
      ...values,
      company_type: values.company_type?.[0]?.value,
      onboarding_id: onboardingInfo.id,
    })
  }

  useEffect(() => {
    if (
      isVerificationComplete &&
      !updateOnboardingStatusMutation.isPending &&
      onboardingInfo.fase5 !== OnboardingFaseStatus.Incomplete &&
      onboardingInfo.fase5 !== OnboardingFaseStatus.Completed
    ) {
      updateOnboardingStatusMutation.mutate({
        onboarding_id: onboardingInfo.id,
        flow: OnboardingSections.HostInfo,
        status: OnboardingFaseStatus.Completed,
      })
    }
  }, [isVerificationComplete])

  return (
    <form
      className="w-full max-sm:border-t max-sm:px-1 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full border-b pb-4 flex justify-between items-center max-sm:flex-col">
        <div className="w-full">
          <OnboardingSectionLayout.Title>
            {t('sections.onboarding.host-info-title')}
          </OnboardingSectionLayout.Title>
          <OnboardingSectionLayout.Subtitle>
            {t('sections.onboarding.host-info-subtitle')}
          </OnboardingSectionLayout.Subtitle>
        </div>
        <div className="flex justify-between items-center gap-4 max-sm:justify-end max-sm:items-start max-sm:pt-4 max-sm:w-full">
          {onboardingInfo.fase5 === OnboardingFaseStatus.Completed && (
            <Button
              startAdornment={<Info className="h-4 w-4" />}
              color="secondary"
              variant="fill"
              onClick={() =>
                updateOnboardingStatusMutation.mutate({
                  onboarding_id: onboardingInfo.id,
                  flow: OnboardingSections.HostInfo,
                  status: OnboardingFaseStatus.Incomplete,
                })
              }
            >
              {t('button-actions.update-needed')}
            </Button>
          )}
          {isComplete && (
            <Button
              startAdornment={<Send className="h-4 w-4" />}
              color="success"
              onClick={() =>
                finishOnboardingMutation.mutate({
                  id: onboardingInfo.id,
                })
              }
            >
              {t('button-actions.complete')}
            </Button>
          )}
          {!isComplete && isVerificationComplete && (
            <Button
              startAdornment={<Send className="h-4 w-4" />}
              onClick={() =>
                updateOnboardingStatusMutation.mutate({
                  onboarding_id: onboardingInfo.id,
                  flow: OnboardingSections.HostInfo,
                  status: OnboardingFaseStatus.Completed,
                })
              }
            >
              {t('button-actions.submit')}
            </Button>
          )}
        </div>
      </div>

      <div className="w-9/12 max-w-[700px] max-sm:w-full grid grid-cols-6 gap-4 pt-4 pl-6 max-sm:pl-0 pb-6 border-b">
        <div className="col-span-6 pb-4">
          <OnboardingFormLayout.Title>
            {t('sections.onboarding.host-info-form.fiscal-data-title')}
          </OnboardingFormLayout.Title>
          <OnboardingFormLayout.Subtitle>
            {t('sections.onboarding.host-info-form.fiscal-data-subtitle')}
          </OnboardingFormLayout.Subtitle>
        </div>
        <div className="col-span-3 max-sm:col-span-6">
          <TextInput
            data-testid="nif"
            label={t('sections.onboarding.host-info-form.account_type')}
            value={onboardingInfo.application.account_type}
            disabled={true}
          />
        </div>
        <div className="col-span-3 max-sm:col-span-6">
          <TextInput
            data-testid="nif"
            label={t('sections.onboarding.host-info-form.certificate')}
            value={onboardingInfo.application.certificate}
            disabled={true}
          />
        </div>
        <div className="col-span-3 max-sm:col-span-6">
          <SelectInput
            data-testid="company_type"
            label={t('sections.onboarding.host-info-form.company-type')}
            placeholder={t('sections.onboarding.host-info-form.company-type')}
            options={COMPANY_TYPE_OPTIONS}
            value={getValues().company_type}
            onSelect={handleSelectChange('company_type')}
            disabled={!!onboardingInfo.host?.account_id}
            useTranslation
          />
        </div>
        <div className="col-span-3 max-sm:col-span-6">
          <TextInput
            data-testid="nif"
            label={t('sections.onboarding.host-info-form.nif')}
            placeholder={t('sections.onboarding.host-info-form.nif')}
            value={getValues().nif}
            onChange={handleChange('nif')}
            disabled={
              !getValues().company_type || !!onboardingInfo.host?.account_id
            }
          />
        </div>
        {getValues().company_type?.[0]?.value === CompanyType.Company && (
          <>
            <div className="col-span-6">
              <TextInput
                data-testid="company_name"
                label={t('sections.onboarding.host-info-form.company-name')}
                placeholder={t(
                  'sections.onboarding.host-info-form.company-name'
                )}
                value={getValues().company_name}
                onChange={handleChange('company_name')}
                disabled={!!onboardingInfo.host?.account_id}
              />
            </div>
            <div className="col-span-3 max-sm:col-span-6">
              <TextInput
                data-testid="company_phone"
                label={t('sections.onboarding.host-info-form.phone')}
                placeholder={t('sections.onboarding.host-info-form.phone')}
                value={getValues().company_phone}
                onChange={handleChange('company_phone')}
                disabled={!!onboardingInfo.host?.account_id}
                type="number"
              />
            </div>
            <div className="col-span-3 max-sm:col-span-6">
              <TextInput
                data-testid="company_email"
                label={t('sections.onboarding.host-info-form.email')}
                placeholder={t('sections.onboarding.host-info-form.email')}
                value={getValues().company_email}
                onChange={handleChange('company_email')}
                disabled={!!onboardingInfo.host?.account_id}
              />
            </div>
            <div className="col-span-6">
              <TextInput
                data-testid="company_address"
                label={t('sections.onboarding.host-info-form.address')}
                placeholder={t('sections.onboarding.host-info-form.address')}
                value={getValues().company_address}
                onChange={handleChange('company_address')}
                disabled={!!onboardingInfo.host?.account_id}
              />
            </div>
            <div className="col-span-4 max-sm:col-span-6">
              <TextInput
                data-testid="company_city"
                label={t('sections.onboarding.host-info-form.city')}
                placeholder={t('sections.onboarding.host-info-form.city')}
                value={getValues().company_city}
                onChange={handleChange('company_city')}
                disabled={!!onboardingInfo.host?.account_id}
              />
            </div>
            <div className="col-span-2 max-sm:col-span-6">
              <TextInput
                data-testid="company_postal_code"
                label={t('sections.onboarding.host-info-form.postal-code')}
                placeholder={t(
                  'sections.onboarding.host-info-form.postal-code'
                )}
                value={getValues().company_postal_code}
                onChange={handleChange('company_postal_code')}
                disabled={!!onboardingInfo.host?.account_id}
              />
            </div>
          </>
        )}
      </div>

      <div className="w-9/12 max-w-[700px] max-sm:w-full grid grid-cols-6 gap-4 pt-4 pl-6 max-sm:pl-0 pb-6 border-b">
        <div className="col-span-6 pb-4">
          <OnboardingFormLayout.Title>
            {t('sections.onboarding.host-info-form.representative-title')}
          </OnboardingFormLayout.Title>
          <OnboardingFormLayout.Subtitle>
            {t('sections.onboarding.host-info-form.representative-subtitle')}
          </OnboardingFormLayout.Subtitle>
        </div>
        <div className="col-span-3 max-sm:col-span-6">
          <TextInput
            data-testid="first_name"
            label={t('sections.onboarding.host-info-form.first-name')}
            placeholder={t('sections.onboarding.host-info-form.first-name')}
            value={getValues().first_name}
            onChange={handleChange('first_name')}
            disabled={!!onboardingInfo.host?.account_id}
          />
        </div>
        <div className="col-span-3 max-sm:col-span-6">
          <TextInput
            data-testid="last_name"
            label={t('sections.onboarding.host-info-form.last-name')}
            placeholder={t('sections.onboarding.host-info-form.last-name')}
            value={getValues().last_name}
            onChange={handleChange('last_name')}
            disabled={!!onboardingInfo.host?.account_id}
          />
        </div>
        <div className="col-span-2 max-sm:col-span-6">
          <TextInput
            data-testid="birth_date"
            label={t('sections.onboarding.host-info-form.birth-date')}
            placeholder={t('table.select-date')}
            defaultValue={getValues().birth_date}
            onChange={handleChange('birth_date')}
            type="date"
            disabled={!!onboardingInfo.host?.account_id}
          />
        </div>
        <div className="col-span-2 max-sm:col-span-6">
          <TextInput
            data-testid="email"
            label={t('sections.onboarding.host-info-form.email')}
            placeholder={t('sections.onboarding.host-info-form.email')}
            value={getValues().email}
            onChange={handleChange('email')}
            disabled={!!onboardingInfo.host?.account_id}
          />
        </div>
        <div className="col-span-2 max-sm:col-span-6">
          <TextInput
            data-testid="phone"
            label={t('sections.onboarding.host-info-form.phone')}
            placeholder={t('sections.onboarding.host-info-form.phone')}
            value={getValues().phone}
            onChange={handleChange('phone')}
            type="number"
            disabled={!!onboardingInfo.host?.account_id}
          />
        </div>
        <div className="col-span-6">
          <TextInput
            data-testid="address"
            label={t('sections.onboarding.host-info-form.address')}
            placeholder={t('sections.onboarding.host-info-form.address')}
            value={getValues().address}
            onChange={handleChange('address')}
            disabled={!!onboardingInfo.host?.account_id}
          />
        </div>
        <div className="col-span-4 max-sm:col-span-6">
          <TextInput
            data-testid="city"
            label={t('sections.onboarding.host-info-form.city')}
            placeholder={t('sections.onboarding.host-info-form.city')}
            value={getValues().city}
            onChange={handleChange('city')}
            disabled={!!onboardingInfo.host?.account_id}
          />
        </div>
        <div className="col-span-2 max-sm:col-span-6">
          <TextInput
            data-testid="postal_code"
            label={t('sections.onboarding.host-info-form.postal-code')}
            placeholder={t('sections.onboarding.host-info-form.postal-code')}
            value={getValues().postal_code}
            onChange={handleChange('postal_code')}
            disabled={!!onboardingInfo.host?.account_id}
          />
        </div>
      </div>
      <div className="w-9/12 max-w-[700px] max-sm:w-full grid grid-cols-6 gap-4 pt-4 pl-6 max-sm:pl-0 pb-6 border-b">
        <div className="col-span-6 pb-4">
          <OnboardingFormLayout.Title>
            {t('sections.onboarding.host-info-form.account-title')}
          </OnboardingFormLayout.Title>
          <OnboardingFormLayout.Subtitle>
            {t('sections.onboarding.host-info-form.account-subtitle')}
          </OnboardingFormLayout.Subtitle>
        </div>
        <div className="col-span-6">
          <TextInput
            data-testid="account_owner"
            label={t('sections.onboarding.host-info-form.account-owner')}
            placeholder={t('sections.onboarding.host-info-form.account-owner')}
            value={getValues().account_owner}
            onChange={handleChange('account_owner')}
            disabled={!!onboardingInfo.host?.account_id}
          />
        </div>
        <div className="col-span-6">
          <TextInput
            data-testid="iban"
            label={t('sections.onboarding.host-info-form.iban')}
            placeholder={t('sections.onboarding.host-info-form.iban')}
            value={getValues().iban}
            onChange={handleChange('iban')}
            fixedEndAdornment={
              !getValues().account_token ? (
                <Button
                  size="xs"
                  variant="ghost"
                  color="secondary"
                  className="pt-3"
                  onClick={() => {
                    if (getValues().iban) {
                      submitBankAccount()
                    }
                  }}
                  disabled={
                    !getValues().iban ||
                    getValues().iban?.length < 25 ||
                    getValues().iban?.length > 25 ||
                    getValues().iban?.substring(0, 2) !== 'PT' ||
                    !!onboardingInfo.host?.account_id
                  }
                >
                  {t('button-actions.validate')}
                </Button>
              ) : undefined
            }
          />
        </div>
        <div className="col-span-6 w-full flex justify-end pt-4">
          <Button
            className="px-10"
            disabled={
              !isValid ||
              isLoading ||
              !isDirty ||
              !!onboardingInfo.host?.account_id
            }
            loading={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {t('button-actions.submit')}
          </Button>
        </div>
      </div>

      <div className="w-9/12 max-w-[700px] max-sm:w-full grid grid-cols-6 gap-4 pt-4 pl-6 max-sm:pl-0 pb-6 border-b">
        <div className="col-span-6 pb-4">
          <OnboardingFormLayout.Title>
            {t('sections.onboarding.host-info-form.id-proof-title')}
          </OnboardingFormLayout.Title>
          <OnboardingFormLayout.Subtitle>
            {t('sections.onboarding.host-info-form.id-proof-subtitle')}
          </OnboardingFormLayout.Subtitle>
        </div>
        <div className="col-span-3 max-sm:col-span-6">
          <StripeDocsInput
            label="Frente do documento"
            complete={onboardingInfo?.host?.requirements?.identity_proof?.front}
            info={{
              account_id: onboardingInfo.host?.account_id as string,
              person_id: onboardingInfo.host?.person_id as string,
              verification_type: 'document',
              file_type: 'front',
              is_company: getValues().company_type?.[0]?.value === 'company',
            }}
            onSuccess={() => refetch?.()}
          />
        </div>
        <div className="col-span-3 max-sm:col-span-6">
          <StripeDocsInput
            label="Verso do documento"
            complete={onboardingInfo?.host?.requirements?.identity_proof?.back}
            info={{
              account_id: onboardingInfo.host?.account_id as string,
              person_id: onboardingInfo.host?.person_id as string,
              verification_type: 'document',
              file_type: 'back',
              is_company: getValues().company_type?.[0]?.value === 'company',
            }}
            onSuccess={() => refetch?.()}
          />
        </div>
      </div>
      <div className="w-9/12 max-w-[700px] max-sm:w-full grid grid-cols-6 gap-4 pt-4 pl-6 max-sm:pl-0 pb-6 border-b">
        <div className="col-span-6 pb-4">
          <OnboardingFormLayout.Title>
            {t('sections.onboarding.host-info-form.address-proof-title')}
          </OnboardingFormLayout.Title>
          <OnboardingFormLayout.Subtitle>
            {t('sections.onboarding.host-info-form.address-proof-subtitle')}
          </OnboardingFormLayout.Subtitle>
        </div>
        <div className="col-span-6">
          <StripeDocsInput
            complete={onboardingInfo?.host?.requirements?.address_proof}
            info={{
              account_id: onboardingInfo.host?.account_id as string,
              person_id: onboardingInfo.host?.person_id as string,
              verification_type: 'additional_document',
              file_type: 'front',
              is_company: getValues().company_type?.[0]?.value === 'company',
            }}
            onSuccess={() => refetch?.()}
          />
        </div>
      </div>

      {getValues().company_type?.[0]?.value === 'company' && (
        <div className="w-9/12 max-w-[700px] max-sm:w-full grid grid-cols-6 gap-4 pt-4 pl-6 max-sm:pl-0 pb-6 border-b">
          <div className="col-span-6 pb-4">
            <OnboardingFormLayout.Title>
              {t('sections.onboarding.host-info-form.company-proof-title')}
            </OnboardingFormLayout.Title>
            <OnboardingFormLayout.Subtitle>
              {t('sections.onboarding.host-info-form.company-proof-subtitle')}
            </OnboardingFormLayout.Subtitle>
          </div>
          <div className="col-span-6">
            <StripeDocsInput
              complete={onboardingInfo?.host?.requirements?.company_proof}
              info={{
                account_id: onboardingInfo.host?.account_id as string,
                person_id: onboardingInfo.host?.person_id as string,
                verification_type: 'company_registration',
                file_type: 'front',
                is_company: getValues().company_type?.[0]?.value === 'company',
              }}
              onSuccess={() => refetch?.()}
            />
          </div>
        </div>
      )}

      <div className="w-9/12 max-w-[700px] max-sm:w-full grid grid-cols-6 gap-4 pt-4 pl-6 max-sm:pl-0 pb-6">
        <div className="col-span-6 pb-4">
          <OnboardingFormLayout.Title>
            {t('sections.onboarding.host-info-form.account-proof-title')}
          </OnboardingFormLayout.Title>
          <p>
            <OnboardingFormLayout.Subtitle>
              {t('sections.onboarding.host-info-form.account-proof-subtitle')}
            </OnboardingFormLayout.Subtitle>
          </p>
        </div>
        <div className="col-span-6">
          <StripeDocsInput
            complete={onboardingInfo?.host?.requirements?.iban_proof}
            info={{
              account_id: onboardingInfo.host?.account_id as string,
              person_id: onboardingInfo.host?.person_id as string,
              verification_type: 'iban',
              file_type: 'front',
              is_company: getValues().company_type?.[0]?.value === 'company',
            }}
            onSuccess={() => refetch?.()}
          />
        </div>
      </div>
    </form>
  )
}
