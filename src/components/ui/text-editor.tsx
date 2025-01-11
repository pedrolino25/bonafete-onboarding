import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export interface QuillEditorProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'onChange'
  > {
  value: string | undefined
  onChange: (content: string) => void
}

const QuillEditor = React.forwardRef<ReactQuill, QuillEditorProps>(
  ({ value, onChange, ...props }) => {
    return (
      <>
        {document ? (
          <ReactQuill
            value={value} // Pass the value prop
            onChange={onChange} // Pass the onChange handler directly
            modules={{ toolbar: false }}
            placeholder={props.placeholder}
          />
        ) : null}
      </>
    )
  }
)

QuillEditor.displayName = 'QuillEditor'

export { QuillEditor }
