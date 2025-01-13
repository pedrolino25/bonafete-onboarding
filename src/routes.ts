import { Inbox, Loader, LucideIcon, PartyPopper, Users } from 'lucide-react'

export interface NavbarChildrenLink {
  title: string
  path: string
  alias: string
}

export interface NavbarLink {
  title: string
  icon: LucideIcon
  path: string
  alias: string
  childrens?: NavbarChildrenLink[]
}

export const routes = [
  {
    title: 'navigation.applications',
    icon: Inbox,
    path: '/applications/spontaneous',
    alias: 'applications',
    childrens: [
      {
        title: 'navigation.spontaneous-applications',
        path: '/applications/spontaneous',
        alias: 'applications',
      },
      {
        title: 'navigation.sent-applications',
        path: '/applications/sent',
        alias: 'applications',
      },
      {
        title: 'navigation.ready-applications',
        path: '/applications/ready',
        alias: 'applications',
      },
      {
        title: 'navigation.onboarding-applications',
        path: '/applications/onboarding',
        alias: 'applications',
      },
      {
        title: 'navigation.completed-applications',
        path: '/applications/completed',
        alias: 'applications',
      },
    ] as NavbarChildrenLink[],
  },
  {
    title: 'navigation.processes',
    icon: Loader,
    path: '/processes/in-progress',
    alias: 'processes',
    childrens: [
      {
        title: 'navigation.in-progress-processes',
        path: '/processes/in-progress',
        alias: 'processes',
      },
      {
        title: 'navigation.scheduled-processes',
        path: '/processes/scheduled',
        alias: 'processes',
      },
      {
        title: 'navigation.completed-processes',
        path: '/processes/completed',
        alias: 'processes',
      },
      {
        title: 'navigation.archived-processes',
        path: '/processes/archived',
        alias: 'processes',
      },
    ] as NavbarChildrenLink[],
  },
  {
    title: 'navigation.hosts',
    icon: Users,
    path: '/hosts/pending',
    alias: 'hosts',
    childrens: [
      {
        title: 'navigation.pending-hosts',
        path: '/hosts/pending',
        alias: 'hosts',
      },
      {
        title: 'navigation.active-hosts',
        path: '/hosts/active',
        alias: 'hosts',
      },
      {
        title: 'navigation.suspended-hosts',
        path: '/hosts/suspended',
        alias: 'hosts',
      },
      {
        title: 'navigation.archived-hosts',
        path: '/hosts/archived',
        alias: 'hosts',
      },
    ] as NavbarChildrenLink[],
  },
  {
    title: 'navigation.spaces',
    icon: PartyPopper,
    path: '/spaces/pending',
    alias: 'spaces',
    childrens: [
      {
        title: 'navigation.pending-spaces',
        path: '/spaces/pending',
        alias: 'spaces',
      },
      {
        title: 'navigation.active-spaces',
        path: '/spaces/active',
        alias: 'spaces',
      },
      {
        title: 'navigation.archived-spaces',
        path: '/spaces/archived',
        alias: 'spaces',
      },
    ] as NavbarChildrenLink[],
  },
] as NavbarLink[]
