'use client'

import { SidebarLayout } from '@/components/layouts/sidebar'
import { Navbar } from '@/components/navigation/Navbar'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from '@/lib/hooks/use-toast'
import { getHostInfo, SpaceInfoResponse } from '@/services/api/hosts'
import { HostStatus } from '@/services/api/onboardings'
import {
  createSpace,
  SpaceStatus,
  updateSpaceStatus,
} from '@/services/api/spaces'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  House,
  Link as LinkIcon,
  Pencil,
  ShieldCheck,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface SpaceCardProps {
  space: SpaceInfoResponse
  onArchive: () => void
  onPublish: () => void
}

function SpaceCard({ space, onArchive, onPublish }: SpaceCardProps) {
  const t = useTranslations()
  const router = useRouter()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
    <div className="w-full border px-6 py-6 rounded-xl">
      <div className="w-full flex gap-4 max-sm:flex-col">
        <div className="relative w-[150px] h-full max-sm:w-full">
          {space.photos && space.photos[0] && (
            <AspectRatio ratio={16 / 9}>
              <Image
                src={space.photos[0]}
                alt={'space_image'}
                fill
                objectFit="cover"
                className="rounded-xl"
              />
            </AspectRatio>
          )}
          {(!space.photos || space.photos.length === 0) && (
            <AspectRatio ratio={16 / 9}>
              <div className="w-full h-full flex items-center justify-center rounded-xl border">
                <House className="w-8 h-8" />
              </div>
            </AspectRatio>
          )}
        </div>
        <div className="w-full flex items-center justify-between max-sm:flex-col max-sm:items-start">
          <div className="flex gap-4 max-sm:items-center max-sm:justify-between max-sm:w-full">
            <p className="text-base font-medium">{space.title}</p>
            <div className="flex items-center gap-2">
              <Badge
                color={
                  space.status === SpaceStatus.Archived
                    ? 'error'
                    : space.status === SpaceStatus.Active
                    ? 'success'
                    : space.status === SpaceStatus.Pending
                    ? 'warning'
                    : 'white'
                }
              >
                {t(`space-status.${space.status}`)}
              </Badge>

              <div className="hidden max-sm:block">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button size="xs" color="secondary">
                      <Ellipsis strokeWidth={2.5} className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-fit flex flex-col gap-1 p-2"
                  >
                    {space.status !== SpaceStatus.Archived &&
                      space.status !== SpaceStatus.Active && (
                        <>
                          <Button
                            size="xs"
                            color="destructive"
                            startAdornment={<Ban className="w-4 h-4" />}
                            variant="outline"
                            onClick={onArchive}
                            className="mb-2 px-6"
                          >
                            {t('host-section.archive')}
                          </Button>
                          <Button
                            size="xs"
                            color="secondary"
                            startAdornment={<Pencil className="w-4 h-4" />}
                            onClick={() =>
                              router.push(`/edit-space?id=${space.id}`)
                            }
                            className="mb-2 px-6"
                          >
                            {t('host-section.edit')}
                          </Button>
                        </>
                      )}

                    {space.status === SpaceStatus.Pending && (
                      <Button
                        size="xs"
                        color="success"
                        startAdornment={<ShieldCheck className="w-4 h-4" />}
                        onClick={onPublish}
                        className="px-6"
                      >
                        {t('host-section.publish')}
                      </Button>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className="block flex gap-4 max-sm:hidden">
            {space.status !== SpaceStatus.Archived &&
              space.status !== SpaceStatus.Active && (
                <>
                  <Button
                    size="xs"
                    color="destructive"
                    variant="outline"
                    startAdornment={<Ban className="w-4 h-4" />}
                    onClick={onArchive}
                  >
                    {t('host-section.archive')}
                  </Button>
                  <Button
                    size="xs"
                    color="secondary"
                    startAdornment={<Pencil className="w-4 h-4" />}
                    onClick={() => router.push(`/edit-space?id=${space.id}`)}
                  >
                    {t('host-section.edit')}
                  </Button>
                </>
              )}

            {space.status === SpaceStatus.Pending && (
              <Button
                size="xs"
                color="success"
                startAdornment={<ShieldCheck className="w-4 h-4" />}
                onClick={onPublish}
              >
                {t('host-section.publish')}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  )
}

interface CreateSpaceCardProps {
  onClick: () => void
}
function CreateSpaceCard({ onClick }: CreateSpaceCardProps) {
  const t = useTranslations()
  const router = useRouter()
  return (
    <div
      className="w-full border border-dashed hover:border-solid hover:border-1 hover:border-utility-gray-700 px-6 py-6 rounded-xl cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full flex gap-4">
        <div className="relative w-8 h-full">
          <AspectRatio ratio={1 / 1}>
            <div className="w-full h-full flex items-center rounded-xl">
              <House className="w-8 h-8" />
            </div>
          </AspectRatio>
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-4 max-sm:items-center">
            <p className="text-base font-medium">
              {t('host-section.create-space')}
            </p>
          </div>
          <div className="flex gap-4">
            <ChevronRight className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div></div>
    </div>
  )
}

interface HostSectionProps {}

export default function HostSection({}: HostSectionProps) {
  const t = useTranslations()
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id') as string
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openArchive, setOpenArchive] = useState<boolean>(false)
  const [openPublish, setOpenPublish] = useState<boolean>(false)
  const [spaceId, setSpaceId] = useState<string>()

  const { data, refetch } = useQuery({
    queryKey: ['host-info', id],
    queryFn: async () => {
      return await getHostInfo(id)
    },
  })

  const createSpaceMutation = useMutation({
    mutationFn: createSpace,
    onSuccess: (data) => {
      router.push(`/edit-space?id=${data.id}`)
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.submit'),
      })
    },
  })

  const updateSpaceStatusMutation = useMutation({
    mutationFn: updateSpaceStatus,
    onSuccess: () => {
      refetch()
      setIsLoading(false)
      setOpenArchive(false)
      setOpenPublish(false)
    },
    onError: () => {
      setIsLoading(false)
      setOpenArchive(false)
      setOpenPublish(false)
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.submit'),
      })
    },
  })

  return (
    <main>
      <Navbar
        topbarActions={
          <Button
            color="secondary"
            startAdornment={<ChevronLeft className="h-4 w-4" />}
            onClick={() => router.back()}
            variant="ghost"
          >
            {t('navigation.back')}
          </Button>
        }
      >
        {data && (
          <SidebarLayout.Root>
            <SidebarLayout.Header>
              <SidebarLayout.Title>
                {t('sections.onboarding.host-title')}
              </SidebarLayout.Title>
              <SidebarLayout.Subtitle>
                {t('sections.onboarding.host-subtitle')}
              </SidebarLayout.Subtitle>
            </SidebarLayout.Header>

            <SidebarLayout.Header>
              <div className="w-full flex gap-4 max-sm:pr-8">
                <div className="w-48 flex items-center justify-center max-sm:items-start ">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={data.picture} />
                    <AvatarFallback>
                      {data.name?.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="w-full flex max-sm:flex-col gap-12 max-sm:gap-4">
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-full">
                      <p className="text-sm font-light text-utility-gray-500 ">
                        {t('host-section.name')}
                      </p>
                      <p className="text-base font-medium text-utility-brand-600">
                        {data.name}
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm font-light text-utility-gray-500">
                        {t('host-section.company-type')}
                      </p>
                      <p className="text-base font-medium text-utility-brand-600 pt-1">
                        <Badge shape="square" color="brand">
                          {t(`business_type.${data.type}`)}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <div className="w-full text-clip flex flex-col gap-4">
                    <div className="w-full">
                      <p className="text-sm font-light text-utility-gray-500">
                        {t('host-section.email')}
                      </p>
                      <p className="text-base font-medium text-utility-brand-600">
                        {data.email}
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm font-light text-utility-gray-500">
                        {t('host-section.status')}
                      </p>
                      <p className="text-base font-medium text-utility-brand-600 pt-1">
                        <Badge
                          shape="square"
                          color={
                            data.status === HostStatus.Completed
                              ? 'success'
                              : data.status === HostStatus.Pending
                              ? 'blue'
                              : data.status === HostStatus.Archived
                              ? 'warning'
                              : data.status === HostStatus.Suspended
                              ? 'error'
                              : 'brand'
                          }
                        >
                          {t(`host-status.${data.status}`)}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-light text-utility-gray-500">
                        {t('host-section.phone')}
                      </p>
                      <p className="text-base font-medium text-utility-brand-600">
                        {data.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-light text-utility-gray-500">
                        {t('host-section.stripe-account')}
                      </p>
                      <p>
                        <a
                          target="_blank"
                          href={`https://dashboard.stripe.com/connect/accounts/${data.account_id}/activity`}
                        >
                          <div className="flex gap-2 items-center">
                            <span>{data.account_id}</span>
                            <LinkIcon className="h-3.5 w-3.5" />
                          </div>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SidebarLayout.Header>
            <SidebarLayout.Main>
              <div className="w-full flex flex-col gap-6 pl-6 pb-16 pt-6">
                {data.spaces?.map((space) => {
                  return (
                    <SpaceCard
                      space={space}
                      onArchive={() => {
                        setOpenArchive(true)
                        setSpaceId(space.id)
                      }}
                      onPublish={() => {
                        setOpenPublish(true)
                        setSpaceId(space.id)
                      }}
                    />
                  )
                })}
                <CreateSpaceCard
                  onClick={() =>
                    createSpaceMutation.mutate({
                      host_id: data.id,
                    })
                  }
                />
              </div>
            </SidebarLayout.Main>
          </SidebarLayout.Root>
        )}
      </Navbar>

      <Dialog open={openArchive} onOpenChange={setOpenArchive}>
        <DialogContent className="sm:max-w-[425px] max-sm:max-w-100svw">
          <DialogHeader>
            <DialogTitle>{t('titles.archive-space')}</DialogTitle>
            <DialogDescription className="pt-2 pb-6">
              {t('subtitles.archive-space')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              color="secondary"
              disabled={isLoading}
              onClick={() => setOpenArchive(false)}
            >
              {t('button-actions.cancel')}
            </Button>
            <Button
              color="destructive"
              loading={isLoading}
              disabled={isLoading}
              onClick={() => {
                updateSpaceStatusMutation.mutate({
                  id: spaceId as string,
                  status: SpaceStatus.Archived,
                })
                setIsLoading(true)
              }}
            >
              {t('button-actions.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openPublish} onOpenChange={setOpenPublish}>
        <DialogContent className="sm:max-w-[425px] max-sm:max-w-100svw">
          <DialogHeader>
            <DialogTitle>{t('titles.publish-space')}</DialogTitle>
            <DialogDescription className="pt-2 pb-6">
              {t('subtitles.publish-space')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              color="secondary"
              disabled={isLoading}
              onClick={() => setOpenPublish(false)}
            >
              {t('button-actions.cancel')}
            </Button>
            <Button
              loading={isLoading}
              disabled={isLoading}
              onClick={() => {
                updateSpaceStatusMutation.mutate({
                  id: spaceId as string,
                  status: SpaceStatus.Active,
                })
                setIsLoading(true)
              }}
            >
              {t('button-actions.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
