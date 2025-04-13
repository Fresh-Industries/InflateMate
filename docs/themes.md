# Theme Descriptions for Inflatemate

This document outlines the design guidelines and aesthetics for the three themes in the Inflatemate app: **Modern/Minimalistic**, **Retro (Neobrutalism)**, and **Playful**. All components (headers, buttons, cards, images, and links) will draw their styling from the centralized theme configuration to ensure consistency across the application. Colors are chosen dynamically by users through their selected primary, accent, and secondary colors, with text color automatically set to either black or white based on contrast calculations.

---

## 1. Modern / Minimalistic

### Overview
The **Modern** theme is designed to be clean, refined, and understated. It emphasizes simplicity with a minimal color palette and subtle gradients. Components have crisp edges and well-balanced spacing. The goal is to create a polished, professional interface that feels light and uncluttered.

### Design Guidelines

- **Header:**  
  - Use a nearly white background with a subtle opacity.
  - Minimal box-shadow that appears only when scrolled.
  - A single, centered horizontal divider acts as a decorative element.

- **Buttons:**  
  - Use a smooth gradient background (e.g., a blend between primary and secondary colors).
  - Text is always set to pure white or black based on the contrast of the primary color.
  - Hover effects include a gentle transition to a reversed gradient.
  - Rounded corners with subtle curves are preferred.

- **Cards:**  
  - White background with a thin border (using a slight opacity of primary color).
  - Subtle drop shadows give a clean layered effect.
  - Text is dark (almost near black) to ensure readability.

- **Images:**  
  - Images have a subtle border and rounded corners.
  - A soft box-shadow creates depth without drawing too much attention away from the content.

- **Links:**  
  - Simple and understated; transparent background with a subtle border.
  - Hover states subtly change the background and border color using the secondary color.
  - Transitions are smooth and unobtrusive.

---

## 2. Retro (Neobrutalism)

### Overview
The **Retro (Neobrutalism)** theme is all about bold, raw, and unapologetic aesthetics. Inspired by the neobrutalist design movement, it embraces simple, flat elements with thick borders and heavy shadows. The design is aggressive and unrefined with a sense of architectural austerity.

### Design Guidelines

- **Header:**  
  - Use a solid color background (primary color) without gradients.
  - A thick, prominent bottom border (6px) reinforces the raw, blocky aesthetic.
  - When scrolled, an inset shadow with greater thickness is applied.

- **Buttons & Links:**  
  - Buttons and links have chunky, aggressive styling.
  - Use bold, solid colors for backgrounds.
  - Borders are significantly thicker (3px solid) and shadows have a larger offset (6px).
  - Hover effects reverse the color order with thicker borders and more pronounced shadows.
  - Text color is dynamically set to pure white or black for strong contrast.

- **Cards:**  
  - Card backgrounds have a light tint (e.g., off-white) with a thick border (4px solid) to create a rugged separation between elements.
  - Shadows are heavier to simulate a raw, unpolished look.
  - Typography is bold with little to no feathering.

- **Images:**  
  - Images take on a neobrutalist styling, with **no border-radius** and a heavy border (4px solid) using the accent color.
  - Use larger, more pronounced shadows for a “cut-out” effect.
  - Transitions should be straightforward and emphasize the raw nature of the design.

- **Decorative Elements:**  
  - Use raw, geometric shapes (e.g., thick horizontal or diagonal blocks) placed off-center.
  - Rotated elements add visual interest without mimicking overly polished designs.

---

## 3. Playful

### Overview
The **Playful** theme is vibrant, bold, and creative. It combines colorful gradients, whimsical elements, and unexpected design choices to create a fun and engaging user experience. It’s designed to evoke a sense of joy and energy.

### Design Guidelines

- **Header:**  
  - Use a multi-color gradient that transitions between the primary, accent, and secondary colors.
  - Light shadow effects make the header pop, and a subtle border detail (like a dashed line) adds to the hand-crafted feel.

- **Buttons & Links:**  
  - Buttons and links use vivid gradients with a playful twist.
  - Irregular, creative borders (such as dashed or slightly skewed) add character.
  - Hover effects include smooth scaling and a shift in gradient direction for added dynamism.
  - Text color is either pure black or white based on the background contrast, ensuring readability with a fun twist.

- **Cards:**  
  - Cards have a clean white background with playful accents using borders or background overlays that cycle through the user’s chosen colors.
  - Shadows and rounded corners are used more liberally, evoking a handcrafted aesthetic.
  - Typography is lively, combining bold headlines with light body text.

- **Images:**  
  - Images in this theme feature soft, rounded corners and a gentle border.
  - A slightly elevated shadow effect ensures that images feel integrated and playful.
  - Transitions are smooth with subtle scaling effects on hover.

- **Decorative Elements:**  
  - Rotated or slightly skewed design accents create a sense of imperfection and charm.
  - Colors change dynamically on hover to add a lively feel.

---

## Implementation Summary

- All theme styles are centralized in the **themeConfig** file.
- Color values are based on user-selected primary, accent, and secondary colors.
- Text contrast is calculated dynamically using the **getContrastColor** helper function to ensure readability.
- Image styling can be applied by calling the `imageStyles` function from the theme (for example, within your inventory cards).
- The components (headers, buttons, cards, images, and links) read these style definitions, making it easy to swap themes dynamically without modifying component code.

Use this document as a design reference when implementing or updating the components in Inflatemate. Adjust specific numeric values (e.g., border thickness, shadow offsets, border-radius) as needed to meet your final design requirements.

---
