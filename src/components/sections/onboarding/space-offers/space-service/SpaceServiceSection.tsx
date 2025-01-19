'use client'
import SpaceServiceForm, {
  SpaceServiceFormType,
} from '@/components/forms/space-service-form/SpaceServiceForm'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { OnboardingSpaceInfo } from '@/services/api/onboardings'

interface SpaceServiceSectionProps {
  onboardingId?: string
  spaceInfo: OnboardingSpaceInfo
  data?: SpaceServiceFormType
  openDrawer: boolean
  setOpenDrawer: (value: boolean) => void
  refetch?: () => void
}
export default function SpaceServiceSection({
  data,
  spaceInfo,
  onboardingId,
  openDrawer,
  setOpenDrawer,
  refetch,
}: SpaceServiceSectionProps) {
  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer} direction="right">
      <DrawerContent className="w-[70svw] max-sm:w-[100svw]">
        <SpaceServiceForm
          onboardingId={onboardingId}
          spaceInfo={spaceInfo}
          defaultValues={data}
          refetch={() => {
            refetch?.()
            setOpenDrawer(false)
          }}
        />
      </DrawerContent>
    </Drawer>
  )
}
