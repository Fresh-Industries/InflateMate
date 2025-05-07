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
  HardDrive, // Using for Data/Security
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
        id: "hidden-fees",
        question: "Are there any hidden fees, setup costs, or booking limits?", // Added more detail to question
        answer: (
          <>
            <p className="mb-3">
              <strong>Absolutely not.</strong> Our pricing is transparent. Your monthly subscription covers everything needed to run your rental business using InflateMate. We do not charge:
            </p>
            <ul className="list-none space-y-2 mb-3">
              {["Per-booking fees (Unlimited bookings included!)", "Transaction percentages (We don't take a cut)", "Setup fees", "Data storage fees", "Support fees"].map((item) => ( // Added Unlimited bookings and clarification on transaction fees
                <li key={item} className="flex items-start gap-2 text-sm text-foreground"> {/* Ensured text color */}
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> {/* Added mt-0.5 */}
                  {item}
                </li>
              ))}
            </ul>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg border border-border"> {/* Added border */}
              <strong>Note on Payment Processing:</strong> Standard Stripe processing fees (currently 2.9% + 30¢ per transaction, subject to change by Stripe) apply when you accept online payments. These fees are charged directly by Stripe and go to Stripe — <strong>InflateMate does not mark these up or take any percentage of your payment volume.</strong>
            </div>
          </>
        ),
      },
       {
        id: "addons",
        question: "What about add-ons like extra users or SMS credits?", // New question based on pricing context
        answer: (
          <>
            <p className="mb-3">
              Our core plans (Solo and Growth) include generous limits on users and features designed for most rental businesses.
            </p>
            <ul className="list-none space-y-2 mb-3">
              <li className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                 <strong>Solo Plan:</strong> Includes 1 user account.
              </li>
              <li className="flex items-start gap-2 text-sm text-foreground">
                 <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                 <strong>Growth Plan:</strong> Includes up to 5 user accounts and a bundle of SMS credits each month.
              </li>
            </ul>
            <p className="mb-3 text-sm">
               If your business needs require more than what&apos;s included (e.g., more than 5 team members, or higher SMS volume), we offer simple, low-cost add-ons.
            </p>
             <div className="bg-primary/5 p-3 rounded-lg text-sm border border-primary/10"> {/* Added border */}
              You can view the specific pricing for extra users and SMS credit bundles on our <Link href="/pricing" className="text-primary underline hover:no-underline font-medium">full pricing page</Link>. We aim to keep these add-ons affordable and transparent.
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: "setup",
    icon: <Clock className="h-5 w-5" />,
    title: "Getting Started & Setup",
    questions: [
      {
        id: "setup-time",
        question: "How long does it take to set up InflateMate for my rental business?",
        answer: (
          <>
            <p className="mb-3">
              You can have your inflatable inventory imported and your online booking live in <strong className="text-primary">less than 15 minutes</strong>!
            </p>
            <div className="rounded-lg border border-border overflow-hidden mb-4 bg-card"> {/* Added bg-card */}
              <div className="bg-muted/50 px-4 py-3 font-medium text-foreground">Quick-start process steps:</div> {/* Adjusted bg and text color */}
              <div className="p-4 space-y-3"> {/* Adjusted spacing */}
                {[
                  "Import your inflatable inventory (using our template or direct upload)", // More specific
                  "Set your rental pricing, availability rules, and delivery zones", // More specific
                  "Connect your Stripe account for online payments",
                  "Customize your included booking website with your logo, colors, and content" // More specific
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3"> {/* Adjusted spacing */}
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold"> {/* Slightly larger, bolder text */}
                      {idx + 1}
                    </div>
                    <p className="text-sm text-foreground">{step}</p> {/* Ensured text color */}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Our guided setup wizard makes it easy. If you need a hand with importing large datasets, our support team is ready to assist!
            </p>
          </>
        ),
      },
      {
        id: "stripe-setup",
        question: "Tell me about setting up Stripe for online payments.", // More direct question
        answer: (
          <>
            <p className="mb-4">
              Connecting your Stripe account is straightforward and typically takes about 5 minutes. InflateMate uses Stripe Connect for maximum security and direct payment flow:
            </p>
            <div className="space-y-4 mb-4">
              <div className="flex gap-3 items-start"> {/* Added items-start */}
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-medium">1</div>
                <div>
                  <h4 className="font-medium text-foreground">Initiate Connection</h4> {/* Ensured text color */}
                  <p className="text-sm text-muted-foreground">From your InflateMate dashboard, click the &quot;Connect with Stripe&quot; button to begin the secure process.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start"> {/* Added items-start */}
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-medium">2</div>
                <div>
                  <h4 className="font-medium text-foreground">Complete Stripe&apos;s Onboarding</h4> {/* Ensured text color */}
                  <p className="text-sm text-muted-foreground">You&apos;ll be securely redirected to Stripe to enter your business details (like EIN/SSN, address) and link your bank account.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start"> {/* Added items-start */}
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-medium">3</div>
                <div>
                  <h4 className="font-medium text-foreground">Start Accepting Payments</h4> {/* Ensured text color */}
                  <p className="text-sm text-muted-foreground">Once connected, customers can pay online directly through your InflateMate booking portal or invoices. Funds are deposited into your linked bank account by Stripe, typically within 2 business days after a transaction.</p> {/* Added more detail */}
                </div>
              </div>
            </div>
            <div className="bg-primary/5 p-3 rounded-lg text-sm border border-primary/10 text-foreground"> {/* Ensured text color */}
              <strong className="text-primary">Your Money, Secured:</strong> InflateMate utilizes industry-standard Stripe Connect. This means payments flow directly from your customers to your verified Stripe account. <strong>We never hold or have direct access to your funds</strong>, ensuring security and giving you faster access to your revenue.
            </div>
          </>
        ),
      },
       {
        id: "existing-data",
        question: "Can I import my existing customer, inventory, or booking data?", // Combined and clarified question
        answer: (
          <>
            <p className="mb-4">
              <strong className="text-primary">Absolutely!</strong> We make it easy to transition to InflateMate. You have several options for bringing your historical data:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg border border-border mb-4">
              <h4 className="font-medium mb-3 text-foreground">Simple Import Options:</h4> {/* Ensured text color and adjusted mb */}
              <ul className="space-y-4"> {/* Adjusted spacing */}
                <li className="flex items-start gap-3"> {/* Adjusted spacing */}
                  <div className="h-6 w-6 flex items-center justify-center bg-primary/10 rounded-sm text-primary flex-shrink-0">
                    <FileSpreadsheet className="h-4 w-4" /> {/* Slightly larger icon */}
                  </div>
                  <div className="text-sm text-foreground"> {/* Ensured text color */}
                    <span className="font-medium">Import with Templates:</span> Use our easy-to-follow Excel or CSV templates to structure and upload your customer lists, inventory details, and past booking data.
                  </div>
                </li>
                <li className="flex items-start gap-3"> {/* Adjusted spacing */}
                  <div className="h-6 w-6 flex items-center justify-center bg-primary/10 rounded-sm text-primary flex-shrink-0">
                    <FileSpreadsheet className="h-4 w-4" /> {/* Slightly larger icon */}
                  </div>
                   <div className="text-sm text-foreground"> {/* Ensured text color */}
                    <span className="font-medium">Direct Migration:</span> We support direct imports specifically designed for popular rental platforms like Inflatable Office and Goodshuffle Pro to make switching even smoother.
                  </div>
                </li>
                <li className="flex items-start gap-3"> {/* Adjusted spacing */}
                  <div className="h-6 w-6 flex items-center justify-center bg-primary/10 rounded-sm text-primary flex-shrink-0">
                    <HelpCircle className="h-4 w-4" /> {/* Slightly larger icon */}
                  </div>
                  <div className="text-sm text-foreground"> {/* Ensured text color */}
                    <span className="font-medium">Concierge Data Migration:</span> For Growth Plan customers, we offer a free white-glove service where our team assists you directly with migrating your data, ensuring everything is set up correctly.
                  </div>
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Our goal is to get you up and running quickly. Most rental businesses can complete their initial setup and data import within an hour or two.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "data",
    icon: <HardDrive className="h-5 w-5" />, // Changed icon to HardDrive
    title: "Your Data & Security",
    questions: [
      {
        id: "data-ownership",
        question: "Who owns the data for my rental business?", // More specific question
        answer: (
          <>
            <p className="mb-3">
              <strong className="text-primary">You own 100% of your business data, always.</strong> InflateMate acts only as a service provider to process and store it securely on your behalf.
            </p>
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3"> {/* Adjusted gap */}
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Full Data Exportability</h4> {/* Ensured text color */}
                  <p className="text-sm text-muted-foreground">Download complete customer lists, booking history, inventory details, and other critical business data as standard CSV or Excel files whenever you need to, with no restrictions.</p> {/* More specific */}
                </div>
              </div>

              <div className="flex items-start gap-3"> {/* Adjusted gap */}
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">No Vendor Lock-in</h4> {/* Ensured text color */}
                  <p className="text-sm text-muted-foreground">We believe InflateMate should be the best solution for you because of its value and ease of use, not because your data is held hostage. Your data is always yours to take.</p> {/* More relatable wording */}
                </div>
              </div>

              <div className="flex items-start gap-3"> {/* Adjusted gap */}
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Secure Data Deletion</h4> {/* Ensured text color */}
                  <p className="text-sm text-muted-foreground">If you decide to cancel your account, you&apos;ll have a minimum 30-day window to export all of your data before it&apos;s permanently and securely deleted from our servers, adhering to strict data retention policies.</p> {/* More specific details */}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg border border-border"> {/* Added border */}
               <strong className="text-foreground">Security & Compliance:</strong> InflateMate is built with security first. We follow industry best practices, utilize encryption for data both in transit (when it&apos;s being sent) and at rest (when it&apos;s stored), and comply with relevant data protection regulations like GDPR.
            </div>
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
        question: "What kind of customer support do you offer for rental businesses?", // More specific
        answer: (
          <>
            <p className="mb-4">We&apos;re committed to helping you succeed. Our support is designed to get you the help you need, fast:</p> {/* Added intro sentence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <h4 className="font-medium mb-3 text-foreground">Standard Support (Included in all plans)</h4> {/* Clarified inclusion */}
                <ul className="space-y-2">
                  {[
                    "Email support within 24 business hours", // Added 'business hours'
                    "Comprehensive help center & knowledge base", // More descriptive
                    "Easy-to-follow video tutorials", // More descriptive
                    "Regular onboarding webinars for new users" // More descriptive
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground"> {/* Ensured text color */}
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> {/* Added mt-0.5 */}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium mb-3 text-primary">Growth Plan Priority Support</h4> {/* Highlighted text color */}
                <p className="text-xs text-muted-foreground mb-3">Everything in Standard Support plus:</p> {/* Adjusted text color */}
                <ul className="space-y-2">
                  {[
                    "Priority email support (Response typically within 4 business hours)", // More specific ETA
                    "Live chat support during business hours", // Clarified hours
                    "Dedicated monthly check-ins (optional)", // Added optional
                    "Personalized configuration assistance" // More descriptive
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-foreground"> {/* Ensured text color */}
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> {/* Added mt-0.5 */}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Our support team members understand the unique challenges of running a bounce house rental business – we&apos;re here to help you succeed.
            </p>
          </>
        ),
      },
    ],
  },
  // Add more categories if needed, based on your sitemap or common questions:
  // {
  //   id: "features",
  //   icon: <Zap className="h-5 w-5" />, // Example icon
  //   title: "Features & Functionality",
  //   questions: [
  //     { id: "feature-x", question: "Does InflateMate handle X?", answer: (...) },
  //   ]
  // }
];

export default function FAQSection() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("pricing"); // Default to pricing

  const toggleQuestion = (id: string) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

   // Close any open question when the category changes
   const changeCategory = (categoryId: string) => {
      if (activeCategory !== categoryId) {
         setActiveCategory(categoryId);
         setOpenQuestion(null); // Close current question on category change
      }
   };


  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find quick answers to the most common questions about InflateMate.
          </p> {/* Simplified subtitle */}
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => changeCategory(category.id)} // Use the changeCategory function
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border", // Added border
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-md border-primary" // Added border-primary
                  : "bg-muted/50 hover:bg-muted/80 text-muted-foreground border-transparent" // Adjusted bg/hover, added border-transparent
              )}
            >
              {category.icon}
              {category.title}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          {/* Filter and map categories - should only be one active category */}
          {faqCategories
            .filter((category) => category.id === activeCategory)
            .map((category) => (
              <motion.div
                 key={category.id}
                 initial={{ opacity: 0, y: 10 }} // Animation for category content appearing
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }} // Assuming AnimatePresence wraps this block if needed for exit animation
                 transition={{ duration: 0.3 }}
                 className="divide-y divide-border/60"
              >
                {category.questions.map((faq) => (
                  <div key={faq.id} className="border-border">
                    <button
                      onClick={() => toggleQuestion(faq.id)}
                      className="w-full text-left p-5 flex items-center justify-between gap-2 hover:bg-muted/30 transition-colors text-foreground" // Ensured text color
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

                    {/* Use AnimatePresence around the collapsible answer */}
                    <AnimatePresence initial={false}> {/* initial={false} prevents exit animation on mount */}
                      {openQuestion === faq.id && (
                        <motion.div
                           key="answer" // Key required for AnimatePresence
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 bg-muted/10">
                            {/* Content within the answer */}
                            <div className="text-foreground"> {/* Use text-foreground for content */}
                              {faq.answer}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            ))}
        </div>

        {/* Contact Support */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Still have questions about getting started, features, or anything else?
          </p> {/* More inviting prompt */}
          {/* Link or Button to Contact */}
          {/* Assuming this links to a contact page or opens a support widget */}
          <Link href="/contact" passHref>
             <button className="bg-muted hover:bg-muted/70 text-foreground font-medium rounded-full px-6 py-2.5 inline-flex items-center gap-2 transition-colors border border-border"> {/* Added border */}
                <HelpCircle className="h-4 w-4" />
                Contact Support
              </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
