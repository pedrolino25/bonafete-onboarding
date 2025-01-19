'use client'
import { FileInput } from '@/components/inputs/file-input/file-input'
import { EditSpaceSectionLayout } from '@/components/layouts/edit-space-section'
import { Button } from '@/components/ui/button'
import { uploadPictureToS3Bucket } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, CloudUpload, FileCheck2, Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const imageTypeSchema = z.object({
  file: z.instanceof(File).optional(),
  path: z.string(),
})

const submitApplicationOffersFormSchema = z.object({
  files: z.array(imageTypeSchema).min(1),
})

export type SubmitApplicationOffersFormType = z.infer<
  typeof submitApplicationOffersFormSchema
>

interface SubmitApplicationOffersSectionProps {
  applicationId: string
  defaultValues?: SubmitApplicationOffersFormType
  onChange: (values: string[]) => void
}

export default function SubmitApplicationOffersSection({
  applicationId,
  defaultValues,
  onChange,
}: SubmitApplicationOffersSectionProps) {
  const t = useTranslations()
  const [isLoading, setLoading] = useState<boolean>(false)

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<SubmitApplicationOffersFormType>({
    mode: 'onChange',
    resolver: zodResolver(submitApplicationOffersFormSchema),
    defaultValues,
  })

  const onSubmit = async (values: SubmitApplicationOffersFormType) => {
    setLoading(true)
    const pictures = await Promise.all(
      values.files.map(async (item) => {
        if (item.file) {
          return await uploadPictureToS3Bucket({
            file: item.file,
            path: `public/spaces/application/${applicationId}/${item.file.name}`,
          })
        } else {
          return item.path
        }
      })
    )
    setLoading(false)
    onChange(pictures)
  }

  return (
    <form
      className="w-full max-sm:border-t max-sm:px-2 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full border-b pb-4 flex justify-between items-center max-sm:flex-col">
        <div className="w-full">
          <EditSpaceSectionLayout.HeaderTitle>
            {t('sections.onboarding.application-offers-title')}
          </EditSpaceSectionLayout.HeaderTitle>
          <EditSpaceSectionLayout.HeaderSubtitle>
            {t('sections.onboarding.application-offers-subtitle')}
          </EditSpaceSectionLayout.HeaderSubtitle>
        </div>
        <div className="flex justify-between items-center gap-4 max-sm:justify-end max-sm:items-start max-sm:pt-4 max-sm:w-full">
          <Button
            type="submit"
            disabled={!isValid}
            loading={isLoading}
            endAdornment={<ChevronRight className="h-4 w-4" />}
          >
            {t('button-actions.send')}
          </Button>
        </div>
      </div>
      <div className="w-9/12 max-w-[700px] max-sm:w-full flex flex-col gap-8 pt-8 pl-6 max-sm:pl-0 pb-12">
        <div className="grid grid-cols-1 max-sm:grid-cols-1 gap-6">
          <FileInput
            label="Ofertas"
            complete={false}
            path=""
            onSuccess={(val) => {
              const vals = val?.map((item) => {
                return {
                  path: item.name,
                  file: item,
                }
              })
              setValue('files', [...(getValues().files || []), ...vals], {
                shouldDirty: true,
                shouldValidate: true,
              })
            }}
          />
          <div className="w-full">
            {getValues().files?.map((item) => {
              return (
                <div className="w-full p-2 border rounded-xl flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {item?.path?.includes('/application/') ? (
                      <>
                        <FileCheck2 className="w-4 h-4 text-utility-gray-500" />
                        <p className="text-sm font-light text-utility-gray-500">
                          {item?.file?.name ||
                            item?.path?.split('/')[
                              item?.path?.split('/')?.length - 1
                            ]}
                        </p>
                      </>
                    ) : (
                      <>
                        <CloudUpload className="w-4 h-4" />
                        <p className="text-sm font-light">
                          {item?.file?.name ||
                            item?.path?.split('/')[
                              item?.path?.split('/')?.length - 1
                            ]}
                        </p>
                      </>
                    )}
                  </div>
                  <Trash
                    className="w-4 h-4 text-utility-gray-500 cursor-pointer hover:text-utility-gray-900"
                    onClick={() => {
                      setValue(
                        'files',
                        getValues().files?.filter(
                          (value) => value.path !== item.path
                        ),
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        }
                      )
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </form>
  )
}
