import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ReactNode } from 'react'

export interface PopupProps {
  open: boolean
  onClose: (open: boolean) => void
  children?: ReactNode
  className?: string
  title?: string
}

export function Popup({
  open,
  onClose,
  children,
  className,
  title,
}: PopupProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  )
}
