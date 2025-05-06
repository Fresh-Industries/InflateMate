import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do I need tech skills to use InflateMate?",
    a: "Nope! InflateMate is designed for business owners, not techies. If you can use a smartphone, you can use this."
  },
  {
    q: "How do waivers work?",
    a: "Waivers are sent automatically after booking. Customers sign online, and you get a PDF copy in your dashboard."
  },
  {
    q: "Can I use my own website?",
    a: "Yes! You can embed our booking widget on your existing site, or use your free InflateMate site."
  },
  {
    q: "Is there a free trial?",
    a: "Yep — 14 days, no credit card required. Cancel anytime."
  },
  {
    q: "How do payments work?",
    a: "We use Stripe for secure payments. Customers can pay deposits or in full, and you get paid out fast."
  },
  {
    q: "What if I need help?",
    a: "Email support is included. Plus, we have guides and video tutorials."
  }
];

export default function FAQAccordion() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-blue-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-6">
            Frequently Asked <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Everything you need to know about InflateMate
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-lg font-semibold text-gray-800">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-base">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
} 