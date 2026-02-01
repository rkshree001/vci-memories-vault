import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormField from "./FormField";

export interface FamilyMember {
  id: string;
  name: string;
  dateOfBirth: string;
  mobileNumber: string;
  gender: string;
}

interface FamilyMemberCardProps {
  member: FamilyMember;
  index: number;
  onChange: (id: string, field: keyof FamilyMember, value: string) => void;
  onRemove: (id: string) => void;
  errors: { [key: string]: string };
}

const FamilyMemberCard = ({
  member,
  index,
  onChange,
  onRemove,
  errors,
}: FamilyMemberCardProps) => {
  return (
    <div className="relative rounded-lg border border-border bg-muted/50 p-4">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(member.id)}
        aria-label={`Remove family member ${index + 1}`}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <p className="mb-4 text-sm font-medium text-muted-foreground">
        Family Member #{index + 1}
      </p>
      
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Name"
          name={`family-name-${member.id}`}
          value={member.name}
          onChange={(e) => onChange(member.id, "name", e.target.value)}
          required
          placeholder="Enter name"
          error={errors[`family-name-${member.id}`]}
        />
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Gender <span className="text-destructive">*</span>
          </Label>
          <Select
            value={member.gender}
            onValueChange={(value) => onChange(member.id, "gender", value)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors[`family-gender-${member.id}`] && (
            <p className="text-xs text-destructive">{errors[`family-gender-${member.id}`]}</p>
          )}
        </div>
        
        <FormField
          label="Date of Birth"
          name={`family-dob-${member.id}`}
          type="date"
          value={member.dateOfBirth}
          onChange={(e) => onChange(member.id, "dateOfBirth", e.target.value)}
          required
          error={errors[`family-dob-${member.id}`]}
        />
        
        <FormField
          label="Mobile Number"
          name={`family-mobile-${member.id}`}
          type="tel"
          value={member.mobileNumber}
          onChange={(e) => onChange(member.id, "mobileNumber", e.target.value)}
          placeholder="10-digit number"
          inputMode="numeric"
          maxLength={10}
          error={errors[`family-mobile-${member.id}`]}
        />
      </div>
    </div>
  );
};

export default FamilyMemberCard;