import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
}

const FormSection = ({ 
  title, 
  children, 
  className = "", 
  icon: Icon,
}: FormSectionProps) => {
  return (
    <div 
      className={`
        rounded-xl border border-border bg-card p-5 md:p-6 
        shadow-sm
        ${className}
      `}
    >
      <div className="flex items-center gap-3 mb-5">
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default FormSection;