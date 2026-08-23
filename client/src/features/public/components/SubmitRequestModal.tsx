import { useState } from "react";
import { Loader2 } from "lucide-react";
import { submitRequest } from "../api/public.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";

interface SubmitRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationSlug: string;
}

type View = "form" | "success";

export function SubmitRequestModal({ isOpen, onClose, organizationSlug: urlSlug }: SubmitRequestModalProps) {
  const [view, setView] = useState<View>("form");
  const [organizationSlug, setOrganizationSlug] = useState(urlSlug || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ organizationSlug?: string; firstName?: string; lastName?: string; email?: string; phone?: string; company?: string; notes?: string; subject?: string; description?: string }>({});
  const [touched, setTouched] = useState<{ organizationSlug?: boolean; firstName?: boolean; lastName?: boolean; email?: boolean; phone?: boolean; company?: boolean; notes?: boolean; subject?: boolean; description?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  const validateOrganizationSlug = (value: string) => {
    if (!value) return "Organization is required";
    if (value.length < 2) return "Organization name must be at least 2 characters";
    return "";
  };

  const validateFirstName = (value: string) => {
    if (!value) return "First name is required";
    return "";
  };

  const validateLastName = (value: string) => {
    if (!value) return "Last name is required";
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Invalid email format";
    return "";
  };

  const validateSubject = (value: string) => {
    if (!value) return "Subject is required";
    if (value.length < 10) return "Subject must be at least 10 characters";
    if (value.length > 200) return "Subject must not exceed 200 characters";
    return "";
  };

  const validateDescription = (value: string) => {
    if (!value) return "Description is required";
    if (value.length < 20) return "Description must be at least 20 characters";
    if (value.length > 2000) return "Description must not exceed 2000 characters";
    return "";
  };

  const handleBlur = (field: "organizationSlug" | "firstName" | "lastName" | "email" | "phone" | "company" | "notes" | "subject" | "description") => {
    setTouched({ ...touched, [field]: true });
    let error = "";
    if (field === "organizationSlug") error = validateOrganizationSlug(organizationSlug);
    if (field === "firstName") error = validateFirstName(firstName);
    if (field === "lastName") error = validateLastName(lastName);
    if (field === "email") error = validateEmail(email);
    if (field === "subject") error = validateSubject(subject);
    if (field === "description") error = validateDescription(description);
    setErrors({ ...errors, [field]: error });
  };

  const isFormValid = () => {
    return !validateOrganizationSlug(organizationSlug) && !validateFirstName(firstName) && !validateLastName(lastName) && !validateEmail(email) && !validateSubject(subject) && !validateDescription(description);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize organization slug: convert spaces to hyphens and lowercase
    const normalizedSlug = organizationSlug.toLowerCase().replace(/\s+/g, '-');
    
    setTouched({ organizationSlug: true, firstName: true, lastName: true, email: true, subject: true, description: true });
    
    const orgSlugError = validateOrganizationSlug(organizationSlug);
    const firstNameError = validateFirstName(firstName);
    const lastNameError = validateLastName(lastName);
    const emailError = validateEmail(email);
    const subjectError = validateSubject(subject);
    const descriptionError = validateDescription(description);
    
    setErrors({ organizationSlug: orgSlugError, firstName: firstNameError, lastName: lastNameError, email: emailError, subject: subjectError, description: descriptionError });
    
    if (orgSlugError || firstNameError || lastNameError || emailError || subjectError || descriptionError) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await submitRequest(normalizedSlug, { 
        firstName,
        lastName,
        email,
        phone,
        company,
        notes,
        subject,
        description
      });
      setTicketNumber(response.ticketNumber);
      setView("success");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setView("form");
    setOrganizationSlug(urlSlug || "");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setNotes("");
    setSubject("");
    setDescription("");
    setErrors({});
    setTouched({});
    setSubmitError("");
    setTicketNumber("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[520px]">
        {view === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Submit a Support Request</DialogTitle>
              <DialogDescription>
                Fill in the details below and our team will get back to you as soon as possible.
              </DialogDescription>
            </DialogHeader>

            {submitError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Organization */}
              <Field>
                <FieldLabel htmlFor="organizationSlug">
                  Organization <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="organizationSlug"
                  type="text"
                  value={organizationSlug}
                  onChange={(e) => setOrganizationSlug(e.target.value)}
                  onBlur={() => handleBlur("organizationSlug")}
                  placeholder="e.g., acme-corp"
                  aria-invalid={!!errors.organizationSlug}
                />
                <FieldError errors={[errors.organizationSlug ? { message: errors.organizationSlug } : undefined]} />
                <FieldDescription>Your organization's identifier</FieldDescription>
              </Field>

              {/* First Name */}
              <Field>
                <FieldLabel htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  placeholder="e.g., John"
                  aria-invalid={!!errors.firstName}
                />
                <FieldError errors={[errors.firstName ? { message: errors.firstName } : undefined]} />
              </Field>

              {/* Last Name */}
              <Field>
                <FieldLabel htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  placeholder="e.g., Doe"
                  aria-invalid={!!errors.lastName}
                />
                <FieldError errors={[errors.lastName ? { message: errors.lastName } : undefined]} />
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="e.g., john.doe@example.com"
                  aria-invalid={!!errors.email}
                />
                <FieldError errors={[errors.email ? { message: errors.email } : undefined]} />
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  placeholder="e.g., +1 555-123-4567"
                  aria-invalid={!!errors.phone}
                />
                <FieldError errors={[errors.phone ? { message: errors.phone } : undefined]} />
              </Field>

              {/* Company */}
              <Field>
                <FieldLabel htmlFor="company">Company</FieldLabel>
                <Input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onBlur={() => handleBlur("company")}
                  placeholder="e.g., Acme Inc."
                  aria-invalid={!!errors.company}
                />
                <FieldError errors={[errors.company ? { message: errors.company } : undefined]} />
              </Field>

              {/* Notes */}
              <Field>
                <FieldLabel htmlFor="notes">Notes</FieldLabel>
                <Input
                  id="notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() => handleBlur("notes")}
                  placeholder="Additional notes..."
                  aria-invalid={!!errors.notes}
                />
                <FieldError errors={[errors.notes ? { message: errors.notes } : undefined]} />
              </Field>

              {/* Subject */}
              <Field>
                <FieldLabel htmlFor="subject">
                  Subject <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onBlur={() => handleBlur("subject")}
                  placeholder="Brief summary of your issue"
                  aria-invalid={!!errors.subject}
                />
                <FieldError errors={[errors.subject ? { message: errors.subject } : undefined]} />
                <div className="text-right text-xs text-muted-foreground">
                  {subject.length} / 200
                </div>
              </Field>

              {/* Description */}
              <Field>
                <FieldLabel htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  onBlur={() => handleBlur("description")}
                  placeholder="Please describe your issue in as much detail as possible. Include any relevant information that might help our team assist you."
                  rows={5}
                  aria-invalid={!!errors.description}
                />
                <FieldError errors={[errors.description ? { message: errors.description } : undefined]} />
                <div className="text-right text-xs text-muted-foreground">
                  {description.length} / 2000
                </div>
              </Field>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-center py-6">
              {/* Animated Checkmark */}
              <div className="mb-6 flex justify-center">
                <svg className="size-20" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: "226",
                      strokeDashoffset: "0",
                      animation: "draw-circle 0.6s ease-out forwards",
                    }}
                  />
                  <path
                    d="M 24 40 L 36 52 L 56 28"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: "40",
                      strokeDashoffset: "40",
                      animation: "checkmark-pop 0.3s ease-out 0.6s forwards",
                    }}
                  />
                  <style>{`
                    @keyframes draw-circle {
                      from { stroke-dashoffset: 226; }
                      to { stroke-dashoffset: 0; }
                    }
                    @keyframes checkmark-pop {
                      0% { stroke-dashoffset: 40; transform: scale(0); }
                      70% { transform: scale(1.1); }
                      100% { stroke-dashoffset: 0; transform: scale(1); }
                    }
                  `}</style>
                </svg>
              </div>

              <DialogTitle className="text-center mb-4">Request Submitted!</DialogTitle>

              <p
                className="font-mono text-lg text-primary mb-4"
                style={{
                  opacity: 0,
                  animation: "fade-up 0.4s ease-out 0.2s forwards",
                }}
              >
                Your ticket number is #{ticketNumber}
              </p>

              <DialogDescription className="mb-6">
                We will contact you at {email} as soon as possible. Our team typically responds within 24 hours.
              </DialogDescription>

              <Button
                onClick={handleClose}
                className="w-full"
                style={{
                  opacity: 0,
                  animation: "fade-up 0.4s ease-out 0.4s forwards",
                }}
              >
                Done
              </Button>

              <style>{`
                @keyframes fade-up {
                  from {
                    opacity: 0;
                    transform: translateY(12px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

