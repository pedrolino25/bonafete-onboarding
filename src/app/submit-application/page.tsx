import SubmitApplicationSection from '@/components/sections/applications/SubmitApplicationSection'
import {
  getLocalitiesList,
  getSpaceTargetsList,
  getSpaceTypesList,
} from '@/services/api/static'

export default async function SubmitApplication() {
  const localitiesList = await getLocalitiesList()
  const spaceTypesList = await getSpaceTypesList()
  const spaceTargetsList = await getSpaceTargetsList()

  return (
    <SubmitApplicationSection
      localitiesList={localitiesList}
      spaceTypesList={spaceTypesList}
      spaceTargetsList={spaceTargetsList}
    />
  )
}
