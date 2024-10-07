import { Inbox, Loader, PartyPopper, Users } from 'lucide-react'
import { SidebarLink } from './components/navbar/sidebar/Sidebar'
import { TopbarLink } from './components/navbar/topbar/Topbar'

export const routes = {
  sidebar: [
    {
      title: 'navigation.applications',
      icon: Inbox,
      path: '/applications/new',
      alias: 'applications',
    },
    {
      title: 'navigation.processes',
      icon: Loader,
      path: '/processes/ongoing',
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
      title: 'navigation.new-applications',
      path: '/applications/new',
    },
    {
      title: 'navigation.accepted-applications',
      path: '/applications/accepted',
    },
    {
      title: 'navigation.rejected-applications',
      path: '/applications/rejected',
    },
    {
      title: 'navigation.scheduled-applications',
      path: '/applications/scheduled',
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
      title: 'navigation.ongoing-processes',
      path: '/processes/ongoing',
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
