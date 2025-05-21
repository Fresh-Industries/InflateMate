# Step-by-Step Guide: Building a Great Modern/Minimal Theme (with User-Generated Colors)

This guide breaks down the process of creating a visually appealing, clean, and maintainable Modern/Minimal theme for your multi-tenant app, **using user-generated color palettes**. Follow each step to ensure best practices, great color usage, and clean code.

---

## 1. Preparation

- [ ] **Review the Modern Theme Design Guidelines**  
  Reference `docs/themes.md` for the Modern/Minimalistic section to align on the visual direction.
- [ ] **Understand User Color Input**  
  Users select base colors for primary, secondary, accent, background, and text via the `ColorSettings` component.

---

## 2. Generate Color Shades Using Chroma

- [ ] **Use the Existing `makeScale` Utility**  
  Your `app/[domain]/_themes/utils.ts` file provides a `makeScale` function using `chroma-js`:
  ```ts
  export function makeScale(baseHex: string): ColorScale {
      const clampL = (c: chroma.Color, delta: number) => {
        const [l] = c.lab();
        return c.set('lab.l', Math.min(100, Math.max(0, l + delta)));
      };
    
      const light = clampL(chroma(baseHex), +20);
      const dark  = clampL(chroma(baseHex), -20);
      const scale = chroma.scale([light, baseHex, dark]).mode('lab').domain([0, 0.5, 1]);
    
      return {
        100: scale(0.2).hex(),
        500: baseHex,
        900: scale(0.8).hex(),
      };
    }
  ```
- [ ] **Integrate `makeScale` in Theme Setup**  
  When a user updates their palette, generate `{100, 500, 900}` shades for each color and pass them to your theme system:
  ```ts
  const themeColors = {
    primary: makeScale(userPrimary),
    secondary: makeScale(userSecondary),
    accent: makeScale(userAccent),
    background: makeScale(userBackground),
    text: makeScale(userText),
  };
  ```

---

## 3. Refactor Theme Color Types

- [ ] **Update `ThemeColors` to Use `{100, 500, 900}` Shades**  
  ```ts
  export type ColorScale = {
    100: string;
    500: string;
    900: string;
  };
  export interface ThemeColors {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    background: ColorScale;
    text: ColorScale;
  }
  ```
- [ ] **Update All Theme Files to Use These Shades**  
  Refactor theme overrides and base theme to use `c.primary[100]`, `c.accent[900]`, etc.

---

## 4. Base Theme Setup

- [ ] **Review and Clean Up `baseTheme`**  
  Ensure the base theme is minimal, with sensible defaults for all UI elements.
- [ ] **Remove Redundant or Overly Specific Styles**  
  Keep only what's necessary for a clean foundation.

---

## 5. Modern Theme Overrides

- [ ] **Header**
  - Use a nearly white or very light background (`c.primary[100]` or `c.background[100]`).
  - Add a subtle box-shadow only on scroll.
  - Add a minimal divider (e.g., `border-bottom: 1px solid c.primary[100]`).

- [ ] **Buttons**
  - Use a smooth gradient background (e.g., `linear-gradient(90deg, c.accent[100], c.accent[500])`).
  - Ensure text color uses `getContrastColor` for accessibility.
  - Add gentle hover transitions and rounded corners.

- [ ] **Cards**
  - Set background to white or `c.background[100]`.
  - Use a thin border with a low-opacity primary shade.
  - Add a subtle drop shadow for depth.
  - Use dark text for readability (`c.text[900]`).

- [ ] **Images**
  - Add a subtle border and rounded corners.
  - Use a soft box-shadow for depth.

- [ ] **Links**
  - Keep backgrounds transparent with a subtle border.
  - On hover, change background and border color using a secondary shade.
  - Use smooth transitions.

- [ ] **Section Backgrounds**
  - Alternate between very light shades for visual separation (e.g., `c.background[100]`, `c.background[500]`).

---

## 6. Accessibility

- [ ] **Use `getContrastColor` for All Text/Background Combos**  
  Your `getContrastColor` utility in `utils.ts` ensures readable text.
- [ ] **Test All Color Combos with a Contrast Checker**
- [ ] **Adjust Colors as Needed for Readability**

---

## 7. Testing & Preview

- [ ] **Add or Update a Storybook/Preview Page**
  - Render all theme variants and key components.
  - Visually verify color usage, spacing, and effects.

---

## 8. Code Cleanliness

- [ ] **Use Factories/Utilities for Repeated Logic**
  - E.g., `makeButtonStyles`, `makeLinkStyles`.
- [ ] **Add JSDoc Comments to Theme Functions**
  - Document what each override does and why.

---

## 9. Iterate & Polish

- [ ] **Gather Feedback from Stakeholders or Users**
- [ ] **Tweak Shades, Spacing, and Effects Based on Feedback**
- [ ] **Refactor for Simplicity and Maintainability**

---

## References

- [Theme Design Guidelines](./themes.md)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Palette Generator](https://coolors.co/)
- [chroma-js](https://gka.github.io/chroma.js/)

---

**Tip:** Commit after each major step to track progress and make rollbacks easy. 