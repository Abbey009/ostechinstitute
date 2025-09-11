// src/components/ui/textarea.tsx
import React from 'react';

interface TextareaProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ name, placeholder, value, onChange, className }) => {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`p-2 border rounded-md ${className}`}
    />
  );
};

export { Textarea }
