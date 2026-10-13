import * as React from "react";
export type CardProps = React.HTMLAttributes<HTMLDivElement>;
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-xl border border-gray-200 bg-white shadow-md ${className}`}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";
export default Card;
