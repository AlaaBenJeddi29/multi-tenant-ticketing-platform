import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { submitRequestSchema, type SubmitRequestFormData } from "../schemas/submit-request.schema";

import { useSubmitRequest } from "../hooks/useSubmitRequest";
import { toast } from "sonner";

export default function SubmitRequestPage() {
  const { organizationSlug } = useParams<{ organizationSlug: string }>();
  const submitMutation = useSubmitRequest();
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<number | null>(null);
  const [email, setEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitRequestFormData>({
    resolver: zodResolver(submitRequestSchema),
  });

  const onSubmit = (data: SubmitRequestFormData) => {
    const payload = {
      ...data,
      organizationSlug: organizationSlug || "",
    };

    submitMutation.mutate(payload, {
      onSuccess: (response) => {
        setSubmitted(true);
        setTicketNumber(response.ticketNumber);
        setEmail(data.email);
        toast.success("Your request has been submitted.");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to submit request");
      },
    });
  };

  if (!organizationSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Alert className="max-w-md">
          <AlertDescription>
            Invalid organization slug. Please check the URL.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg">
        {submitted ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Request Submitted Successfully
            </h1>
            <p className="text-gray-600 mb-4">
              Your request has been submitted. Ticket #{ticketNumber} has been created. We will be in touch at {email}.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setTicketNumber(null);
                setEmail("");
              }}
              variant="outline"
            >
              Submit Another Request
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Submit a Request
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Fill out the form below to submit your support request.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={cn("flex flex-col gap-6 w-full")}
            >
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="firstName">
                      First Name
                    </FieldLabel>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName")}
                      aria-invalid={!!errors.firstName}
                    />
                    <FieldError
                      errors={
                        errors.firstName
                          ? [{ message: errors.firstName.message }]
                          : []
                      }
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastName">
                      Last Name
                    </FieldLabel>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register("lastName")}
                      aria-invalid={!!errors.lastName}
                    />
                    <FieldError
                      errors={
                        errors.lastName
                          ? [{ message: errors.lastName.message }]
                          : []
                      }
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="email">
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  <FieldError
                    errors={
                      errors.email
                        ? [{ message: errors.email.message }]
                        : []
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="subject">
                    Subject
                  </FieldLabel>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    {...register("subject")}
                    aria-invalid={!!errors.subject}
                  />
                  <FieldError
                    errors={
                      errors.subject
                        ? [{ message: errors.subject.message }]
                        : []
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">
                    Description
                  </FieldLabel>
                  <Input
                    id="description"
                    placeholder="Please provide detailed information about your request..."
                    {...register("description")}
                    aria-invalid={!!errors.description}
                  />
                  <FieldError
                    errors={
                      errors.description
                        ? [{ message: errors.description.message }]
                        : []
                    }
                  />
                </Field>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending
                    ? "Submitting..."
                    : "Submit Request"}
                </Button>
              </FieldGroup>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
