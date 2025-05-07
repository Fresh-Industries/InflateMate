
import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'signature-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        role?: string;
        name?: string;
        required?: boolean;
      };
      'date-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        role?: string;
        name?: string;
        required?: boolean;
      };
      'text-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        role?: string;
        name?: string;
        required?: boolean;
      };
      'phone-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        role?: string;
        name?: string;
        required?: boolean;
      };
      // Add other DocuSeal custom field tags here if you use them
    }
  }
}

// Add this line if your file is not already treated as a module
// (e.g., if you get errors about augmenting global scope)
export {};