import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const FormSection = ({ title, children, className = "" }: FormSectionProps) => {
  return (
    <div className={`rounded-lg border border-border bg-card p-4 md:p-6 ${className}`}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
};

export default FormSection;
