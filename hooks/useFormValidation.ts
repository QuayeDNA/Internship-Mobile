import { useState } from "react";
import { ZodError, ZodSchema } from "zod";

export function useFormValidation(schema: ZodSchema) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: unknown): boolean => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const formErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path && e.path.length > 0) {
            formErrors[e.path.join(".")] = e.message;
          }
        });
        setErrors(formErrors);
      }
      return false;
    }
  };

  const clearErrors = () => setErrors({});

  return { errors, validate, clearErrors };
}
