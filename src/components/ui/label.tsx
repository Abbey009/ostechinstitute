import React from "react"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ children, ...props }: LabelProps) {
  return (
    <label className="block text-sm font-medium text-gray-700" {...props}>
      {children}
    </label>
  )
}
