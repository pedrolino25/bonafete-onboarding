import OnboardingSection from '@/components/sections/onboarding/OnboardingSection'
import {
  getLocalitiesList,
  getPostalCodesList,
  getSpaceConveniencesList,
  getSpaceTargetsList,
  getSpaceTypesList,
} from '@/services/api/static'

export default async function ManageOnboardingProcess() {
  const localitiesList = await getLocalitiesList()
  const conveniencesList = await getSpaceConveniencesList()
  const spaceTypesList = await getSpaceTypesList()
  const spaceTargetsList = await getSpaceTargetsList()
  const postalCodesList = await getPostalCodesList()

  return (
    <OnboardingSection
      localitiesList={localitiesList}
      conveniencesList={conveniencesList}
      spaceTypesList={spaceTypesList}
      spaceTargetsList={spaceTargetsList}
      postalCodesList={postalCodesList}
    />
  )
}
