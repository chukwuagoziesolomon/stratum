import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brass">Contact</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-high">
          Talk to a human, on your terms.
        </h1>
        <p className="mt-5 font-body text-lg leading-relaxed text-ink-muted">
          The AI assistant in the corner can answer most questions instantly. For account-specific or
          regulated advice, reach us here and a licensed advisor will follow up.
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.1} className="space-y-8">
          <div className="flex items-start gap-4">
            <Mail size={18} className="mt-1 text-brass" />
            <div>
              <p className="font-display text-sm font-medium text-ink-high">Email</p>
              <p className="font-body text-sm text-ink-muted">support@aeronexoilandgas.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone size={18} className="mt-1 text-brass" />
            <div>
              <p className="font-display text-sm font-medium text-ink-high">Phone</p>
              <p className="font-body text-sm text-ink-muted">+61 8 5555 0148 (Mon–Fri, 8am–6pm AWST)</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin size={18} className="mt-1 text-brass" />
            <div>
              <p className="font-display text-sm font-medium text-ink-high">Office</p>
              <p className="font-body text-sm text-ink-muted">Allendale Square, Perth, Australia</p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
