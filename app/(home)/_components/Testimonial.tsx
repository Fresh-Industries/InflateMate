import { Quote } from "lucide-react";

export default function Testimonial() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg">
              <Quote className="w-8 h-8" />
            </span>
          </div>
          <blockquote className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
            “I built InflateMate because I was tired of clunky, overpriced rental software. If you run a bounce house business, this is the tool I wish I had years ago.”
          </blockquote>
          <div className="text-gray-600 text-lg font-medium">Nikolas, Founder & First User</div>
        </div>
      </div>
    </section>
  );
} 