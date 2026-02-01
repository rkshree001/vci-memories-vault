import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  pattern?: string;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "tel" | "email";
}

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  error,
  pattern,
  maxLength,
  inputMode,
}: FormFieldProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Handle date picker with both typing and calendar
  if (type === "date") {
    const handleCalendarSelect = (date: Date | undefined) => {
      if (date) {
        const formattedDate = format(date, "yyyy-MM-dd");
        const syntheticEvent = {
          target: { name, value: formattedDate },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
      setIsCalendarOpen(false);
    };

    const dateValue = value ? new Date(value) : undefined;

    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        <div className="relative group">
          <Input
            id={name}
            name={name}
            type="date"
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full bg-background pr-12 transition-all duration-200 focus:shadow-md ${error ? "border-destructive" : "group-hover:border-muted-foreground/50"}`}
          />
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-12 hover:bg-transparent"
              >
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover z-50" align="end">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={handleCalendarSelect}
                initialFocus
                className="p-3 pointer-events-auto"
                captionLayout="dropdown"
                fromYear={1920}
                toYear={new Date().getFullYear() + 10}
              />
            </PopoverContent>
          </Popover>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive font-bold">*</span>}
        </Label>
        {type === "tel" && maxLength && (
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            {value.length} / {maxLength}
          </span>
        )}
      </div>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        pattern={pattern}
        maxLength={maxLength}
        inputMode={inputMode}
        className={`w-full bg-background transition-all duration-200 focus:shadow-md hover:border-muted-foreground/50 ${error ? "border-destructive" : ""}`}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default FormField;