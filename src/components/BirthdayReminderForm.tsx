import { useState, useCallback, useRef } from "react";
import { Heart, Plus, Send, CheckCircle, Users, Briefcase, User, Camera, X } from "lucide-react";
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
  // VCEH Member Details
  vcehName: string;
  vcehMobile: string;
  vcehEmail: string;
  vcehDob: string;
  vcehGender: string;
  maritalStatus: string;
  photo: string;
  // Spouse Details
  anniversaryDate: string;
  spouseName: string;
  spouseDob: string;
  spouseMobile: string;
  spouseGender: string;
  // Business Details
  businessName: string;
  employeeCount: string;
}

const initialFormData: FormData = {
  vcehName: "",
  vcehMobile: "",
  vcehEmail: "",
  vcehDob: "",
  vcehGender: "",
  maritalStatus: "",
  photo: "",
  anniversaryDate: "",
  spouseName: "",
  spouseDob: "",
  spouseMobile: "",
  spouseGender: "female",
  businessName: "",
  employeeCount: "",
};

const BirthdayReminderForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Photo must be smaller than 2MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          // Max dimensions for optimization - reduced for reliability
          const MAX_SIZE = 600;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.5 quality (even more aggressive)
          const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.5);
          setFormData((prev) => ({ ...prev, photo: optimizedDataUrl }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      
      // Restrict mobile numbers to digits only
      if ((name === "vcehMobile" || name === "spouseMobile") && value !== "") {
        if (!/^\d*$/.test(value)) return;
      }

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
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Smart Gender Sync for Spouse
      if (name === "vcehGender") {
        if (value === "male") {
          newData.spouseGender = "female";
        } else if (value === "female") {
          newData.spouseGender = "male";
        } else {
          newData.spouseGender = ""; // Reset if other/prefer not to say
        }
      }
      
      return newData;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const addFamilyMember = useCallback(() => {
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name: "",
      dateOfBirth: "",
      gender: "",
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

    // VCEH Member validations
    if (!formData.vcehName.trim()) {
      newErrors.vcehName = "Name is required";
    }

    if (!formData.vcehMobile.trim()) {
      newErrors.vcehMobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.vcehMobile)) {
      newErrors.vcehMobile = "Enter a valid 10-digit mobile number";
    }

    if (formData.vcehEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.vcehEmail)) {
      newErrors.vcehEmail = "Enter a valid email address";
    }

    if (!formData.vcehDob) {
      newErrors.vcehDob = "Date of birth is required";
    }

    if (!formData.vcehGender) {
      newErrors.vcehGender = "Please select a gender";
    }

    if (!formData.maritalStatus) {
      newErrors.maritalStatus = "Please select marital status";
    }

    // Spouse validations - REQUIRED when married
    if (formData.maritalStatus === "married") {
      if (!formData.spouseName.trim()) {
        newErrors.spouseName = "Spouse name is required";
      }
      if (!formData.spouseDob) {
        newErrors.spouseDob = "Spouse date of birth is required";
      }
      if (!formData.anniversaryDate) {
        newErrors.anniversaryDate = "Anniversary date is required";
      }
      if (formData.spouseMobile && !/^\d{10}$/.test(formData.spouseMobile)) {
        newErrors.spouseMobile = "Enter a valid 10-digit mobile number";
      }
    }

    // Validate family members
    familyMembers.forEach((member) => {
      if (!member.name.trim()) {
        newErrors[`family-name-${member.id}`] = "Name is required";
      }
      if (!member.gender) {
        newErrors[`family-gender-${member.id}`] = "Gender is required";
      }
      if (!member.dateOfBirth) {
        newErrors[`family-dob-${member.id}`] = "Date of birth is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, familyMembers]);

  // IMPORTANT: Replace this with your Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyoGnjrVTjYPNi7qL4yBO7EQJjkUzCOtMnCadbTCt0HQax8fJR5T_sqM7JvR5EW0uneyg/exec";

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
      vcehName: formData.vcehName,
      vcehMobile: formData.vcehMobile,
      vcehEmail: formData.vcehEmail,
      vcehDob: formData.vcehDob,
      vcehGender: formData.vcehGender,
      maritalStatus: formData.maritalStatus,
      photo: formData.photo,
      anniversaryDate: formData.maritalStatus === "married" ? formData.anniversaryDate : "",
      spouseName: formData.maritalStatus === "married" ? formData.spouseName : "",
      spouseDob: formData.maritalStatus === "married" ? formData.spouseDob : "",
      spouseMobile: formData.maritalStatus === "married" ? formData.spouseMobile : "",
      spouseGender: formData.maritalStatus === "married" ? formData.spouseGender : "",
      businessName: formData.businessName,
      employeeCount: formData.employeeCount,
      familyMembers: familyMembers.map((m) => ({
        name: m.name,
        gender: m.gender,
        dateOfBirth: m.dateOfBirth,
        mobile: "NA",
      })),
    };

    try {
      // Submit to Google Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      // no-cors mode doesn't return response, so we assume success
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Your birthday reminder has been submitted successfully.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }

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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/50 via-background to-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex items-center gap-3 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              VCEH Family Registry
            </h1>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/80">Birthday & Anniversary Directory</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="container mx-auto px-4 pt-6">
        <div className="mx-auto max-w-2xl space-y-5">
          {/* VCEH Member Details */}
          <FormSection 
            title="Member Information" 
            icon={User}
            className="hover-elevate transition-all duration-300 focus-within:shadow-lg focus-within:border-primary/50"
          >
            {/* Photo Upload */}
            <div className="mb-6 flex flex-col items-center justify-center">
              <div 
                className={`relative group h-32 w-32 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30 overflow-hidden transition-all duration-300 ${formData.photo ? 'border-primary border-solid' : 'hover:border-primary/50'}`}
              >
                {formData.photo ? (
                  <>
                    <img src={formData.photo} alt="Member" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X className="h-6 w-6 text-white" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors"
                  >
                    <Camera className="h-8 w-8" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Upload Photo</span>
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground font-medium">Profile Picture (Max 2MB)</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Member Name"
                name="vcehName"
                value={formData.vcehName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                error={errors.vcehName}
              />

              <FormField
                label="Mobile Number"
                name="vcehMobile"
                type="tel"
                value={formData.vcehMobile}
                onChange={handleChange}
                required
                placeholder="10-digit mobile number"
                inputMode="numeric"
                maxLength={10}
                error={errors.vcehMobile}
              />

              <FormField
                label="Email ID"
                name="vcehEmail"
                type="email"
                value={formData.vcehEmail}
                onChange={handleChange}
                placeholder="email@example.com"
                inputMode="email"
                error={errors.vcehEmail}
              />

              <FormField
                label="Date of Birth"
                name="vcehDob"
                type="date"
                value={formData.vcehDob}
                onChange={handleChange}
                required
                error={errors.vcehDob}
              />
            </div>

            {/* Gender */}
            <div className="mt-4 space-y-3">
              <Label className="text-sm font-medium text-foreground">
                Gender <span className="text-destructive font-bold">*</span>
              </Label>
              <RadioGroup
                value={formData.vcehGender}
                onValueChange={(value) => handleSelectChange("vcehGender", value)}
                className="flex flex-wrap gap-2"
              >
                {["Male", "Female", "Other", "Prefer not to say"].map(
                  (option) => {
                    const optionValue = option.toLowerCase().replace(/\s+/g, "-");
                    const isSelected = formData.vcehGender === optionValue;
                    return (
                      <label
                        key={option}
                        htmlFor={`gender-${option}`}
                        className={`flex items-center justify-center rounded-lg border-2 px-6 py-3 cursor-pointer transition-all duration-200 text-sm font-medium ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-muted bg-background text-muted-foreground hover:border-muted-foreground hover:bg-muted/5"
                        }`}
                      >
                        <RadioGroupItem
                          value={optionValue}
                          id={`gender-${option}`}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    );
                  }
                )}
              </RadioGroup>
              {errors.vcehGender && (
                <p className="text-xs text-destructive">{errors.vcehGender}</p>
              )}
            </div>

            {/* Marital Status */}
            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Marital Status <span className="text-destructive font-bold">*</span>
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
            <FormSection 
              title="Spouse Details" 
              icon={Heart}
              className="hover-elevate transition-all duration-300 focus-within:shadow-lg focus-within:border-primary/50"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Anniversary Date"
                  name="anniversaryDate"
                  type="date"
                  value={formData.anniversaryDate}
                  onChange={handleChange}
                  required
                  error={errors.anniversaryDate}
                />

                <FormField
                  label="Spouse Name"
                  name="spouseName"
                  value={formData.spouseName}
                  onChange={handleChange}
                  placeholder="Enter spouse name"
                  required
                  error={errors.spouseName}
                />

                <FormField
                  label="Spouse Date of Birth"
                  name="spouseDob"
                  type="date"
                  value={formData.spouseDob}
                  onChange={handleChange}
                  required
                  error={errors.spouseDob}
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
                  error={errors.spouseMobile}
                />
              </div>
            </FormSection>
          )}

          {/* Children Section */}
          <FormSection 
            title="Children" 
            icon={Users}
            className="hover-elevate transition-all duration-300 focus-within:shadow-lg focus-within:border-primary/50"
          >
            <div className="space-y-4">
              {familyMembers.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No children added yet. Click the button below to add.
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
                Add Child
              </Button>
            </div>
          </FormSection>

          {/* Business Details */}
          <FormSection 
            title="Business Details" 
            icon={Briefcase}
            className="hover-elevate transition-all duration-300 focus-within:shadow-lg focus-within:border-primary/50"
          >
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
            </div>
          </FormSection>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-7 text-base font-semibold shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Details
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BirthdayReminderForm;
