import * as React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`md-2 block text-sm font-medium text-gray-700 ${className}`}
        {...props}
      />
    );
  },
);

Label.displayName = "label";

export default Label;
