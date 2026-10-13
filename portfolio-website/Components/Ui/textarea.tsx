import * as React from "react";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = "", ...props}, ref) => {
        return (
            <textarea 
            ref= {ref}
            className={`min-h-30 w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
        )
    } 
)
Textarea.displayName = "Textarea";

export default Textarea;