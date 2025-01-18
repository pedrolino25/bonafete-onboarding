'use client'
import SpacePackageForm, {
  SpacePackageFormType,
} from '@/components/forms/space-package-form/SpacePackageForm'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { OnboardingSpaceInfo } from '@/services/api/onboardings'

interface SpacePackageSectionProps {
  onboardingId?: string
  spaceInfo: OnboardingSpaceInfo
  data?: SpacePackageFormType
  openDrawer: boolean
  setOpenDrawer: (value: boolean) => void
  refetch?: () => void
}

export default function SpacePackageSection({
  data,
  spaceInfo,
  onboardingId,
  openDrawer,
  setOpenDrawer,
  refetch,
}: SpacePackageSectionProps) {
  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer} direction="right">
      <DrawerContent className="w-[70svw] max-sm:w-[100svw]">
        <SpacePackageForm
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
