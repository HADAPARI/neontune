import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Bug, Lightbulb, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { ContactFormData } from "@/lib/types";

const contactSchema = z.object({
  email: z.string().email("Email invalide"),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z.string().min(20, "Le message doit contenir au moins 20 caractères"),
  type: z.enum(["bug", "suggestion"]),
});

interface ContactFormProps {
  onClose: () => void;
}

export function ContactForm({ onClose }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ContactFormData>();

  const selectedType = watch("type");

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Une erreur est survenue lors de l'envoi du message");
      }

      setSubmitSuccess(true);
      setTimeout(onClose, 2000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-dark w-full max-w-lg rounded-lg border border-cyan-200/20 shadow-[0_0_25px_rgba(0,255,255,0.1)]">
        <div className="flex items-center justify-between p-4 border-b border-cyan-200/20">
          <h2 className="text-xl font-semibold text-white">Contactez-nous</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => register("type").onChange("bug")}
              className={cn(
                "flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2",
                "transition-all duration-200",
                selectedType === "bug"
                  ? "border-pink-600 bg-pink-600/10 text-white"
                  : "border-gray-700 text-gray-400 hover:border-pink-600/50"
              )}
            >
              <Bug size={24} />
              <span>Signaler un bug</span>
            </button>

            <button
              type="button"
              onClick={() => register("type").onChange("suggestion")}
              className={cn(
                "flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2",
                "transition-all duration-200",
                selectedType === "suggestion"
                  ? "border-cyan-200 bg-cyan-200/10 text-white"
                  : "border-gray-700 text-gray-400 hover:border-cyan-200/50"
              )}
            >
              <Lightbulb size={24} />
              <span>Suggestion</span>
            </button>
          </div>

          <div>
            <input
              type="email"
              placeholder="Votre email"
              className={cn(
                "w-full p-3 rounded-lg",
                "bg-dark border-2 border-gray-700",
                "text-white placeholder-gray-400",
                "focus:outline-none focus:border-cyan-200",
                "transition-colors"
              )}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-pink-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Sujet"
              className={cn(
                "w-full p-3 rounded-lg",
                "bg-dark border-2 border-gray-700",
                "text-white placeholder-gray-400",
                "focus:outline-none focus:border-cyan-200",
                "transition-colors"
              )}
              {...register("subject")}
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-pink-600">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <textarea
              placeholder="Votre message"
              rows={5}
              className={cn(
                "w-full p-3 rounded-lg",
                "bg-dark border-2 border-gray-700",
                "text-white placeholder-gray-400",
                "focus:outline-none focus:border-cyan-200",
                "transition-colors",
                "resize-none"
              )}
              {...register("message")}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-pink-600">{errors.message.message}</p>
            )}
          </div>

          {submitError && (
            <p className="text-pink-600 text-sm">{submitError}</p>
          )}

          {submitSuccess && (
            <p className="text-cyan-200 text-sm">
              Message envoyé avec succès !
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full p-3 rounded-lg",
              "bg-cyan-200/10 text-cyan-200",
              "border-2 border-cyan-200",
              "hover:bg-cyan-200/20",
              "transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
} 