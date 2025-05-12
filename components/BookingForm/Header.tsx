import { Calendar } from "lucide-react";

import { User } from "lucide-react";

import { CreditCard } from "lucide-react";

interface HeaderProps {
  currentStep: number;
}

  // Steps for progress indicator
  const steps = [
    { number: 1, title: "Event Details", icon: Calendar },
    { number: 2, title: "Customer Info", icon: User },
    { number: 3, title: "Review & Pay", icon: CreditCard },
  ];

const Header = ({ currentStep }: HeaderProps) => {
  return (
    <div className="relative mb-12">
      <div className="flex justify-between items-center z-10 relative">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                currentStep >= step.number
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-primary-foreground shadow-lg"
                  : "border-gray-300 text-gray-300"
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                currentStep >= step.number ? "text-primary" : "text-gray-400"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute top-6 left-0 w-full h-[2px] bg-gray-200 -z-10"></div>
      <div
        className="absolute top-6 left-0 h-[2px] bg-primary -z-10 transition-all"
        style={{ width: `${((currentStep - 1) * 100) / (steps.length - 1)}%` }}
      ></div>
    </div>
  );
};

export default Header;
