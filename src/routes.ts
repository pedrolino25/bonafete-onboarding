import { Inbox, Loader, PartyPopper, Users } from 'lucide-react'
import { SidebarLink } from './components/navigation/sidebar/Sidebar'
import { TopbarLink } from './components/navigation/topbar/Topbar'

export const routes = {
  sidebar: [
    {
      title: 'navigation.applications',
      icon: Inbox,
      path: '/applications/spontaneous',
      alias: 'applications',
    },
    {
      title: 'navigation.processes',
      icon: Loader,
      path: '/processes/in-progress',
      alias: 'processes',
    },
    {
      title: 'navigation.hosts',
      icon: Users,
      path: '/hosts/pending',
      alias: 'hosts',
    },
    {
      title: 'navigation.spaces',
      icon: PartyPopper,
      path: '/spaces/pending',
      alias: 'spaces',
    },
  ] as SidebarLink[],
  applications: [
    {
      title: 'navigation.spontaneous-applications',
      path: '/applications/spontaneous',
    },
    {
      title: 'navigation.sent-applications',
      path: '/applications/sent',
    },
    {
      title: 'navigation.ready-applications',
      path: '/applications/ready',
    },
    {
      title: 'navigation.onboarding-applications',
      path: '/applications/onboarding',
    },
    {
      title: 'navigation.completed-applications',
      path: '/applications/completed',
    },
  ] as TopbarLink[],
  hosts: [
    {
      title: 'navigation.pending-hosts',
      path: '/hosts/pending',
    },
    {
      title: 'navigation.active-hosts',
      path: '/hosts/active',
    },
    {
      title: 'navigation.suspended-hosts',
      path: '/hosts/suspended',
    },
    {
      title: 'navigation.archived-hosts',
      path: '/hosts/archived',
    },
  ] as TopbarLink[],
  processes: [
    {
      title: 'navigation.in-progress-processes',
      path: '/processes/in-progress',
    },
    {
      title: 'navigation.scheduled-processes',
      path: '/processes/scheduled',
    },
    {
      title: 'navigation.completed-processes',
      path: '/processes/completed',
    },
    {
      title: 'navigation.archived-processes',
      path: '/processes/archived',
    },
  ] as TopbarLink[],
  spaces: [
    {
      title: 'navigation.pending-spaces',
      path: '/spaces/pending',
    },
    {
      title: 'navigation.active-spaces',
      path: '/spaces/active',
    },
    {
      title: 'navigation.archived-spaces',
      path: '/spaces/archived',
    },
  ] as TopbarLink[],
}
