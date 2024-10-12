'use client'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Ellipsis, Eye, Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

interface PhotoProps {
  index: number
  src: string
  onDeletePhoto?: (key: number) => void
  onSetAsProfilePhoto?: (key: number) => void
  onViewPhoto?: () => void
}

export default function Photo({
  index,
  src,
  onDeletePhoto,
  onSetAsProfilePhoto,
  onViewPhoto,
}: PhotoProps) {
  const t = useTranslations()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
    <div key={`space_image_${index}`} className="relative w-full">
      <AspectRatio ratio={16 / 9}>
        <Image src={src} alt={`space_image_${index}`} fill objectFit="cover" />

        <div className="w-full h-full absolute">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div
                className="absolute shadow-md outline-none h-6 w-6 right-2 bottom-[-5px] bg-utility-gray-100 hover:bg-utility-gray-400 cursor-pointer flex items-center justify-center rounded-full"
                onClick={() => setIsPopoverOpen(true)}
              >
                <Ellipsis strokeWidth={2.5} className="h-4 w-4" />
              </div>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-fit flex flex-col gap-1 p-2"
            >
              {onSetAsProfilePhoto && (
                <Button
                  color="secondary"
                  variant="ghost"
                  size="xs"
                  className="w-full"
                  onClick={() => {
                    onSetAsProfilePhoto?.(index)
                    setIsPopoverOpen(false)
                  }}
                >
                  {t('actions.set-profile-picture')}
                </Button>
              )}
              {onViewPhoto && (
                <Button
                  color="secondary"
                  variant="ghost"
                  size="xs"
                  className="w-full"
                  startAdornment={<Eye className="h-4 w-4" strokeWidth={2.5} />}
                  onClick={onViewPhoto}
                >
                  {t('actions.view-photo')}
                </Button>
              )}
              {onDeletePhoto && (
                <Button
                  color="destructive"
                  variant="ghost"
                  size="xs"
                  className="w-full"
                  startAdornment={
                    <Trash className="h-4 w-4" strokeWidth={2.5} />
                  }
                  onClick={() => {
                    onDeletePhoto?.(index)
                    setIsPopoverOpen(false)
                  }}
                >
                  {t('actions.delete-picture')}
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </AspectRatio>
    </div>
  )
}
