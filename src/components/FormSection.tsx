import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
  accentColor?: "primary" | "pink" | "blue" | "orange";
}

const accentStyles = {
  primary: "from-primary/10 to-transparent border-primary/20",
  pink: "from-pink-500/10 to-transparent border-pink-500/20",
  blue: "from-blue-500/10 to-transparent border-blue-500/20",
  orange: "from-orange-500/10 to-transparent border-orange-500/20",
};

const iconStyles = {
  primary: "bg-primary text-primary-foreground",
  pink: "bg-pink-500 text-white",
  blue: "bg-blue-500 text-white",
  orange: "bg-orange-500 text-white",
};

const FormSection = ({ 
  title, 
  children, 
  className = "", 
  icon: Icon,
  accentColor = "primary" 
}: FormSectionProps) => {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl border bg-card p-5 md:p-6 
        shadow-sm hover:shadow-md transition-shadow duration-300
        bg-gradient-to-br ${accentStyles[accentColor]}
        ${className}
      `}
    >
      <div className="flex items-center gap-3 mb-5">
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconStyles[accentColor]} shadow-sm`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default FormSection;