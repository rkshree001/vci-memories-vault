import { useState, useCallback } from "react";
import { Cake, Plus, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormSection from "./FormSection";
import FormField from "./FormField";
import FamilyMemberCard, { FamilyMember } from "./FamilyMemberCard";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  // VCI Member Details
  vciName: string;
  vciMobile: string;
  vciEmail: string;
  vciDob: string;
  vciGender: string;
  maritalStatus: string;
  // Spouse Details
  anniversaryDate: string;
  spouseName: string;
  spouseDob: string;
  spouseMobile: string;
  // Business Details
  businessName: string;
  employeeCount: string;
  employeeName: string;
  employeeMobile: string;
}

const initialFormData: FormData = {
  vciName: "",
  vciMobile: "",
  vciEmail: "",
  vciDob: "",
  vciGender: "",
  maritalStatus: "",
  anniversaryDate: "",
  spouseName: "",
  spouseDob: "",
  spouseMobile: "",
  businessName: "",
  employeeCount: "",
  employeeName: "",
  employeeMobile: "",
};

const BirthdayReminderForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addFamilyMember = useCallback(() => {
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name: "",
      dateOfBirth: "",
      mobileNumber: "",
    };
    setFamilyMembers((prev) => [...prev, newMember]);
  }, []);

  const removeFamilyMember = useCallback((id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateFamilyMember = useCallback(
    (id: string, field: keyof FamilyMember, value: string) => {
      setFamilyMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
      );
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};

    // VCI Member validations
    if (!formData.vciName.trim()) {
      newErrors.vciName = "Name is required";
    }

    if (!formData.vciMobile.trim()) {
      newErrors.vciMobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.vciMobile)) {
      newErrors.vciMobile = "Enter a valid 10-digit mobile number";
    }

    if (formData.vciEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.vciEmail)) {
      newErrors.vciEmail = "Enter a valid email address";
    }

    if (!formData.vciDob) {
      newErrors.vciDob = "Date of birth is required";
    }

    if (!formData.vciGender) {
      newErrors.vciGender = "Please select a gender";
    }

    if (!formData.maritalStatus) {
      newErrors.maritalStatus = "Please select marital status";
    }

    // Validate family members
    familyMembers.forEach((member) => {
      if (!member.name.trim()) {
        newErrors[`family-name-${member.id}`] = "Name is required";
      }
      if (!member.dateOfBirth) {
        newErrors[`family-dob-${member.id}`] = "Date of birth is required";
      }
      if (member.mobileNumber && !/^\d{10}$/.test(member.mobileNumber)) {
        newErrors[`family-mobile-${member.id}`] = "Enter valid 10-digit number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, familyMembers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Prepare submission data
    const submissionData = {
      timestamp: new Date().toISOString(),
      vciMember: {
        name: formData.vciName,
        mobile: formData.vciMobile,
        email: formData.vciEmail,
        dateOfBirth: formData.vciDob,
        gender: formData.vciGender,
        maritalStatus: formData.maritalStatus,
      },
      spouse:
        formData.maritalStatus === "married"
          ? {
              anniversaryDate: formData.anniversaryDate,
              name: formData.spouseName,
              dateOfBirth: formData.spouseDob,
              mobile: formData.spouseMobile,
            }
          : null,
      familyMembers: familyMembers.map((m) => ({
        name: m.name,
        dateOfBirth: m.dateOfBirth,
        mobile: m.mobileNumber,
      })),
      business: {
        name: formData.businessName,
        employeeCount: formData.employeeCount,
        employeeName: formData.employeeName,
        employeeMobile: formData.employeeMobile,
      },
    };

    console.log("Form Data:", submissionData);

    // Simulate API call (replace with actual Google Apps Script endpoint)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Success!",
      description: "Your birthday reminder has been submitted successfully.",
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFamilyMembers([]);
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            Thank You!
          </h1>
          <p className="mb-6 text-muted-foreground">
            Your birthday reminder information has been submitted successfully.
            We'll send you reminders on special occasions!
          </p>
          <Button onClick={resetForm} className="w-full">
            Submit Another Entry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex items-center gap-3 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Cake className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              VCI Birthday Reminder
            </h1>
            <p className="text-xs text-muted-foreground">
              Smart Calendar Application
            </p>
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="container mx-auto px-4 pt-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* VCI Member Details */}
          <FormSection title="VCI Member Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="VCI Member Name"
                name="vciName"
                value={formData.vciName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                error={errors.vciName}
              />

              <FormField
                label="VCI Mobile Number"
                name="vciMobile"
                type="tel"
                value={formData.vciMobile}
                onChange={handleChange}
                required
                placeholder="10-digit mobile number"
                inputMode="numeric"
                maxLength={10}
                error={errors.vciMobile}
              />

              <FormField
                label="VCI Email ID"
                name="vciEmail"
                type="email"
                value={formData.vciEmail}
                onChange={handleChange}
                placeholder="email@example.com"
                inputMode="email"
                error={errors.vciEmail}
              />

              <FormField
                label="VCI Date of Birth"
                name="vciDob"
                type="date"
                value={formData.vciDob}
                onChange={handleChange}
                required
                error={errors.vciDob}
              />
            </div>

            {/* Gender */}
            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Gender <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={formData.vciGender}
                onValueChange={(value) => handleSelectChange("vciGender", value)}
                className="flex flex-wrap gap-4"
              >
                {["Male", "Female", "Other", "Prefer not to say"].map(
                  (option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option.toLowerCase().replace(/\s+/g, "-")}
                        id={`gender-${option}`}
                      />
                      <Label
                        htmlFor={`gender-${option}`}
                        className="cursor-pointer text-sm"
                      >
                        {option}
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>
              {errors.vciGender && (
                <p className="text-xs text-destructive">{errors.vciGender}</p>
              )}
            </div>

            {/* Marital Status */}
            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Marital Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.maritalStatus}
                onValueChange={(value) =>
                  handleSelectChange("maritalStatus", value)
                }
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="unmarried">Unmarried</SelectItem>
                </SelectContent>
              </Select>
              {errors.maritalStatus && (
                <p className="text-xs text-destructive">{errors.maritalStatus}</p>
              )}
            </div>
          </FormSection>

          {/* Spouse Details - Conditional */}
          {formData.maritalStatus === "married" && (
            <FormSection title="Spouse Details">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Anniversary Date"
                  name="anniversaryDate"
                  type="date"
                  value={formData.anniversaryDate}
                  onChange={handleChange}
                />

                <FormField
                  label="Spouse Name"
                  name="spouseName"
                  value={formData.spouseName}
                  onChange={handleChange}
                  placeholder="Enter spouse name"
                />

                <FormField
                  label="Spouse Date of Birth"
                  name="spouseDob"
                  type="date"
                  value={formData.spouseDob}
                  onChange={handleChange}
                />

                <FormField
                  label="Spouse Mobile Number"
                  name="spouseMobile"
                  type="tel"
                  value={formData.spouseMobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                />
              </div>
            </FormSection>
          )}

          {/* Family Members */}
          <FormSection title="Family Members">
            <div className="space-y-4">
              {familyMembers.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No family members added yet. Click the button below to add.
                </p>
              ) : (
                familyMembers.map((member, index) => (
                  <FamilyMemberCard
                    key={member.id}
                    member={member}
                    index={index}
                    onChange={updateFamilyMember}
                    onRemove={removeFamilyMember}
                    errors={errors}
                  />
                ))
              )}

              <Button
                type="button"
                variant="outline"
                onClick={addFamilyMember}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Family Member
              </Button>
            </div>
          </FormSection>

          {/* Business Details */}
          <FormSection title="Business Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter business name"
              />

              <FormField
                label="Employee Count"
                name="employeeCount"
                type="number"
                value={formData.employeeCount}
                onChange={handleChange}
                placeholder="Number of employees"
                inputMode="numeric"
              />

              <FormField
                label="Employee Name"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                placeholder="Enter employee name"
              />

              <FormField
                label="Employee Mobile Number"
                name="employeeMobile"
                type="tel"
                value={formData.employeeMobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                inputMode="numeric"
                maxLength={10}
              />
            </div>
          </FormSection>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 text-base font-semibold"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Birthday Reminder
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BirthdayReminderForm;
