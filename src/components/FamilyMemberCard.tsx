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
  gender: string; // "son" or "daughter"
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
  const handleMemberChange = (id: string, field: keyof FamilyMember, value: string) => {
    onChange(id, field, value);
  };

  return (
    <div className="relative rounded-lg border border-border bg-muted/50 p-4 transition-all duration-300 hover:shadow-md">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(member.id)}
        aria-label={`Remove child ${index + 1}`}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <p className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
        Child #{index + 1}
      </p>
      
      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          label="Name"
          name={`family-name-${member.id}`}
          value={member.name}
          onChange={(e) => handleMemberChange(member.id, "name", e.target.value)}
          required
          placeholder="Enter name"
          error={errors[`family-name-${member.id}`]}
        />
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Gender <span className="text-destructive font-bold">*</span>
          </Label>
          <Select
            value={member.gender}
            onValueChange={(value) => handleMemberChange(member.id, "gender", value)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="son">Son</SelectItem>
              <SelectItem value="daughter">Daughter</SelectItem>
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
          onChange={(e) => handleMemberChange(member.id, "dateOfBirth", e.target.value)}
          required
          error={errors[`family-dob-${member.id}`]}
        />
      </div>
    </div>
  );
};

export default FamilyMemberCard;