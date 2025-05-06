'use client'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  CreditCard, 
  Clock, 
  FileSpreadsheet, 
  HelpCircle,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: string;
  question: string;
  answer: JSX.Element;
}

interface FaqCategory {
  id: string;
  icon: JSX.Element;
  title: string;
  questions: FaqItem[];
}

const faqCategories: FaqCategory[] = [
  {
    id: "pricing",
    icon: <CreditCard className="h-5 w-5" />,
    title: "Pricing & Billing",
    questions: [
      {
        id: "price-lock",
        question: "Is my pricing guaranteed to stay the same?",
        answer: (
          <>
            <p className="mb-3">
              <strong className="text-primary">Yes, we guarantee price lock-in.</strong> When you sign up, your rate is locked for as long as your subscription remains active.
            </p>
            <div className="bg-muted p-3 rounded-lg flex items-start gap-3 text-sm mb-3">
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                Early adopters who sign up before July 1, 2025 receive our special <strong>$79/mo rate</strong> that&apos;s guaranteed for the lifetime of your account — even as we add new features and raise prices for new customers.
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              If you ever need to pause your subscription, you can reactivate within 90 days and maintain your original pricing.
            </p>
          </>
        ),
      },
      {
        id: "hidden-fees",
        question: "Are there any hidden fees or transaction costs?",
        answer: (
          <>
            <p className="mb-3">
              <strong>Absolutely not.</strong> Your monthly subscription covers everything. We don&apos;t charge:
            </p>
            <ul className="list-none space-y-2 mb-3">
              {["Per-booking fees", "Transaction percentages", "Setup fees", "Data storage fees", "Support fees"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="text-sm text-muted-foreground">
              <strong>Note:</strong> Standard Stripe processing fees (2.9% + 30¢) apply for payments, which go directly to Stripe — we don&apos;t mark these up or take a cut.
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: "setup",
    icon: <Clock className="h-5 w-5" />,
    title: "Getting Started",
    questions: [
      {
        id: "setup-time",
        question: "How long does it take to set up my rental business?",
        answer: (
          <>
            <p className="mb-3">
              <strong className="text-primary">Less than 10 minutes</strong> to import your inventory and be ready for your first booking.
            </p>
            <div className="rounded-lg border border-border overflow-hidden mb-4">
              <div className="bg-muted px-4 py-2 font-medium">Quick-start process:</div>
              <div className="p-4 space-y-2">
                {[
                  "Import your inventory spreadsheet (Excel or CSV)",
                  "Set your pricing and availability rules",
                  "Connect your Stripe account",
                  "Customize your booking page with your logo and colors"
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">
                      {idx + 1}
                    </div>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Our setup wizard guides you through each step, and our support team can help with your import if needed.
            </p>
          </>
        ),
      },
      {
        id: "stripe-setup",
        question: "How does the Stripe connected account process work?",
        answer: (
          <>
            <p className="mb-4">
              Setting up Stripe takes about 5 minutes. Here&apos;s how it works:
            </p>
            <div className="space-y-4 mb-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-medium">1</div>
                <div>
                  <h4 className="font-medium">Create a connected account</h4>
                  <p className="text-sm text-muted-foreground">Click &quot;Connect with Stripe&quot; and follow the prompts to create or connect your account.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-medium">2</div>
                <div>
                  <h4 className="font-medium">Verify your identity</h4>
                  <p className="text-sm text-muted-foreground">Stripe requires basic business verification (EIN or SSN and address).</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-medium">3</div>
                <div>
                  <h4 className="font-medium">Start receiving payments</h4>
                  <p className="text-sm text-muted-foreground">Funds go directly to your bank account with the standard Stripe 2-day payout schedule.</p>
                </div>
              </div>
            </div>
            <div className="bg-primary/5 p-3 rounded-lg text-sm border border-primary/10">
              <strong>Security note:</strong> InflateMate never touches your money. Payments flow directly from your customers to your Stripe account, which ensures maximum security and faster access to your funds.
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: "data",
    icon: <FileSpreadsheet className="h-5 w-5" />,
    title: "Your Data & Security",
    questions: [
      {
        id: "data-ownership",
        question: "Who owns my business data?",
        answer: (
          <>
            <p className="mb-3">
              <strong className="text-primary">You own 100% of your data.</strong> We&apos;re simply processing it on your behalf.
            </p>
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Export anytime</h4>
                  <p className="text-sm text-muted-foreground">Download complete customer lists, booking history, and inventory data as CSV or Excel files whenever you want.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">No vendor lock-in</h4>
                  <p className="text-sm text-muted-foreground">We believe in earning your business every month, not trapping you with your own data.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Data deletion</h4>
                  <p className="text-sm text-muted-foreground">If you cancel your account, we provide a 30-day window to export your data before it&apos;s permanently deleted from our servers.</p>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              InflateMate is GDPR-compliant and follows industry best practices for data security. Your customer data is encrypted both in transit and at rest.
            </div>
          </>
        ),
      },
      {
        id: "data-import",
        question: "Can I import my existing customer and inventory data?",
        answer: (
          <>
            <p className="mb-4">
              <strong>Yes!</strong> We&apos;ve designed our import system to be as simple as possible:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg border border-border mb-4">
              <h4 className="font-medium mb-2">Import options:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center bg-primary/10 rounded-sm text-primary flex-shrink-0">
                    <FileSpreadsheet className="h-3 w-3" />
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Excel/CSV templates</span> — Download our templates, fill in your data, and upload
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center bg-primary/10 rounded-sm text-primary flex-shrink-0">
                    <FileSpreadsheet className="h-3 w-3" />
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Direct import</span> — We support direct imports from Inflatable Office, Goodshuffle, and other popular platforms
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center bg-primary/10 rounded-sm text-primary flex-shrink-0">
                    <HelpCircle className="h-3 w-3" />
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Concierge service</span> — Our team can help migrate your data for you (free for Growth Plan customers)
                  </div>
                </li>
              </ul>
            </div>
            <p className="text-sm">
              Most customers are able to import their inventory in less than 10 minutes and have their full customer database migrated within an hour.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "support",
    icon: <HelpCircle className="h-5 w-5" />,
    title: "Support & Training",
    questions: [
      {
        id: "support-options",
        question: "What kind of support do you offer?",
        answer: (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <h4 className="font-medium mb-2">Standard Support</h4>
                <ul className="space-y-2">
                  {[
                    "Email support within 24 hours",
                    "Comprehensive knowledge base",
                    "Video tutorials for all features",
                    "Weekly onboarding webinars"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium mb-2">Growth Plan Support</h4>
                <p className="text-xs text-primary mb-2">Everything in Standard plus:</p>
                <ul className="space-y-2">
                  {[
                    "Priority email support (4-hour response)",
                    "Live chat during business hours",
                    "Monthly 1-on-1 check-ins",
                    "Custom configuration assistance"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Our support team consists of people with actual bounce house rental experience — we understand your business challenges firsthand.
            </p>
          </>
        ),
      },
    ],
  },
];

export default function FAQSection() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("pricing");

  const toggleQuestion = (id: string) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about InflateMate&apos;s pricing, setup process, and data policies
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {category.icon}
              {category.title}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          {faqCategories
            .filter((category) => category.id === activeCategory)
            .map((category) => (
              <div key={category.id} className="divide-y divide-border/60">
                {category.questions.map((faq) => (
                  <div key={faq.id} className="border-border">
                    <button
                      onClick={() => toggleQuestion(faq.id)}
                      className="w-full text-left p-5 flex items-center justify-between gap-2 hover:bg-muted/30 transition-colors"
                    >
                      <h3 className="font-medium text-lg flex-1">{faq.question}</h3>
                      <motion.div
                        animate={{
                          rotate: openQuestion === faq.id ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0",
                          openQuestion === faq.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {openQuestion === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 bg-muted/10">
                            <div className="prose prose-sm max-w-none text-foreground">
                              {faq.answer}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-muted-foreground mb-4">
            Don&apos;t see your question here? We&apos;re happy to help!
          </p>
          <button className="bg-muted hover:bg-muted/70 text-foreground font-medium rounded-full px-6 py-2.5 inline-flex items-center gap-2 transition-colors">
            <HelpCircle className="h-4 w-4" />
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
