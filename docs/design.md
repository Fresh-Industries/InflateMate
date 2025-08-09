# InflateMate Design Guidelines (Short Version)

InflateMate is a modern, user-friendly bounce house business management system built with Tailwind CSS. Our design focuses on a clean, minimal, and mobile-friendly experience—using shadcn components that can be edited in the `@ui` folder as needed.

---

## 1. Brand & Philosophy

- **Personality:**  
  - Approachable, modern, and professional.
- **Core Principles:**  
  - **Simplicity:** Keep the UI uncluttered and focus on key actions.  
  - **Consistency:** Unified visual language (colors, typography, spacing, icons).  
  - **Accessibility & Mobile-Friendly:** Ensure responsive design with proper contrast and touch-friendly elements.  
  - **Delight:** Use subtle animations and hover effects.

---

## 2. Color Palette & Typography

**Color Palette:**  
- **Primary Colors:**  
  - Blue: `#3B82F6` → `bg-blue-600`  
  - Purple: `#6366F1` → `bg-purple-600`
- **Accents:** Optional use of pink (`bg-pink-500/600`), green (`bg-green-500/600`), and yellow (`bg-yellow-500`).
- **Backgrounds:** Light shades (`bg-gray-50`, `bg-gray-100`).

**Typography:**  
- **Fonts:** Use a clean sans-serif (e.g., Inter, Roboto, SF Pro).  
- **Scale:**  
  - H1: `text-5xl sm:text-6xl`, **bold**  
  - H2: `text-4xl`, **bold**  
  - Body: `text-base` or `text-lg`  
  - Captions/Labels: `text-sm` / `text-xs uppercase`

---

## 3. Layout, Components & Mobile Design

**Responsive Layout:**  
- **Container:** `max-w-7xl mx-auto px-4`  
- **Spacing:** Generous vertical padding (`py-20`/`py-24`) and multiples of 4 for margin/padding.

**Key Components:**  
- **Buttons:**  
  - Primary:  
    ```html
    bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300
    ```
  - Secondary:  
    ```html
    border-2 border-blue-600 text-blue-600 rounded-full bg-transparent hover:bg-white/10 transition-all
    ```
- **Cards:**  
  ```html
  rounded-xl border border-gray-100 bg-white shadow-md p-6 hover:shadow-xl transition-all
Badges:

html
Copy
rounded-full bg-blue-500/10 text-blue-700 px-4 py-2 text-sm shadow-sm
Mobile-Friendly Focus:

Use Tailwind’s responsive prefixes (sm:, md:, lg:) to adjust layouts.

Utilize single-column grids on mobile (grid-cols-1) and expand to multiple columns on larger screens.

Ensure touch targets are at least 44px by 44px.

## 4. Shadcn Components & Customization
Utilize shadcn Components:
Build your UI using shadcn components for a consistent look and behavior.

Editable in @ui Folder:
Customize or extend your components by editing them in the @/components/ui folder

## 5. Layout & Responsive Design
- **Grid System:**  
  Define the grid layout, breakpoints, and responsive container sizes to use across the application.
- **Responsive Utilities:**  
  Detail how to use Tailwind’s responsive classes (e.g., `sm:`, `md:`, `lg:`) to ensure components adapt gracefully.
- **Mobile-First Approach:**  
  Emphasize designing with a mobile-first mindset, including touch target sizes, spacing adjustments, and stackable layouts.


## 6. Usage Guidelines for shadcn Components
- **Component Customization:**  
  Explain that the UI leverages shadcn components for consistency, and detail how developers can edit and extend these components in the `@/components/ui` folder.
- **Component Variants & Patterns:**  
  Provide examples of common patterns and how to use or modify specific shadcn components (e.g., modals, dropdowns, form elements).

## 7. Content Strategy & Tone
- **Voice & Tone:**  
  Define the style of copywriting, including vocabulary, formality, and consistency of language across the UI.
- **Microcopy:**  
  Offer examples and guidelines for error messages, tooltips, button labels, and call-to-action text that align with the brand.

## 8. Interaction & Micro-Interactions
- **Feedback Mechanisms:**  
  Specify how the UI should provide instant feedback on actions (e.g., loading states, button presses, form submissions).
- **Transitions:**  
  Document the use of smooth transitions for state changes using Tailwind’s transition utilities.

## 9. Accessibility & Usability
- **Contrast & Legibility:**  
  Specify minimum contrast ratios and recommended practices to ensure text is readable on all backgrounds.
- **Focus Indicators:**  
  Define clear focus outlines or animations for keyboard navigation.
- **ARIA & Semantic HTML:**  
  Provide guidelines on the use of ARIA roles and landmarks within your UI components.
- **Motion & Reduced Motion:**  
  Incorporate guidelines for animations that respect user motion preferences.