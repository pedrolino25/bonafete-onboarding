import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '../ui/alert'

export interface ErrorMessageProps {
  children?: string
  'data-testid'?: string
}

export function ErrorMessage({ children, ...props }: ErrorMessageProps) {
  return (
    <Alert
      variant="destructive"
      data-testid={props['data-testid'] || 'error-message'}
      className="flex items-center gap-2 py-2"
    >
      <div>
        <AlertCircle className="h-4 w-4" />
      </div>
      <div>
        <AlertDescription>{children}</AlertDescription>
      </div>
    </Alert>
  )
}
