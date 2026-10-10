import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { contactContent } from "@/lib/content";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });

      // Reset form after delay
      setTimeout(() => {
        setIsSubmitted(false);
        (e.target as HTMLFormElement).reset();
      }, 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="gold-frame space-y-8 bg-ash/60 p-7 md:p-11">
      <div className="space-y-2.5">
        <Label htmlFor="name" className="credit gilt-label text-[0.66rem]">{contactContent.formLabels.name}</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          required
          disabled={isSubmitting}
          className="h-12 rounded-none border-0 border-b border-gold-dim bg-void/70 px-4 text-lg md:text-lg text-bone placeholder:text-bone-dim/80 focus-visible:border-fire focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="email" className="credit gilt-label text-[0.66rem]">{contactContent.formLabels.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          required
          disabled={isSubmitting}
          className="h-12 rounded-none border-0 border-b border-gold-dim bg-void/70 px-4 text-lg md:text-lg text-bone placeholder:text-bone-dim/80 focus-visible:border-fire focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="message" className="credit gilt-label text-[0.66rem]">{contactContent.formLabels.message}</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message here..."
          required
          disabled={isSubmitting}
          rows={5}
          className="resize-none rounded-none border-0 border-b border-gold-dim bg-void/70 px-4 py-3 text-lg text-bone placeholder:text-bone-dim/80 focus-visible:border-fire focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <Button
        type="submit"
        variant="hero"
        size="xl"
        disabled={isSubmitting || isSubmitted}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Sending...
          </>
        ) : isSubmitted ? (
          <>
            <CheckCircle />
            Message Sent!
          </>
        ) : (
          <>
            <Send />
            {contactContent.formLabels.submit}
          </>
        )}
      </Button>
    </form>
  );
}
