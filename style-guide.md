# Livo Cozy SaaS Style Guide

## Design Philosophy

- **Cozy, warm, and inviting**: The interface should feel like a friendly, safe space.
- **Simplicity**: Minimal clutter, clear hierarchy, and generous spacing.
- **Modern SaaS/PWA**: Responsive, accessible, and visually appealing.
- **Orange as accent**: Orange is the primary accent, used for CTAs, highlights, and icons.

## Color Palette

- **Background**: `#FFF9F5` (warm, creamy off-white)
- **Primary/Accent (Orange)**: `#F97316` (Tailwind orange-500)
- **Primary Light**: `#FDBA74` (orange-300)
- **Primary Dark**: `#EA580C` (orange-600)
- **Card/Surface**: `#FFFFFF` (white)
- **Border**: `#FED7AA` (orange-100)
- **Text Main**: `#1F2937` (gray-800)
- **Text Secondary**: `#4B5563` (gray-600)
- **Text Light**: `#9CA3AF` (gray-400)

## Typography

- **Font**: System UI sans-serif stack
- **Hero Title**: 3xl–7xl, bold, gray-800, with orange accent
- **Section/Card Title**: 2xl–3xl, semibold, gray-800
- **Body**: base–xl, gray-600
- **Small**: sm, gray-400/600

## Components

### Buttons

- **Primary**: Orange background, white text, rounded-xl, shadow, hover: darker orange, larger shadow.
- **Secondary**: White/transparent background, orange border, orange text, rounded-xl, hover: orange-50 background.

### Cards

- White background, orange-100 border, rounded-2xl, shadow-sm, hover: border orange-200, shadow-md.

### Inputs

- White background, orange-100 border, rounded-xl, px-4 py-3, focus: orange-500 border and orange-200 ring.

### Badges

- Orange-100 background, orange-600 text, rounded-full, px-4 py-2, small font.

### Icons

- Use Lucide icons.
- Orange-500 for accent, gray-800 for neutral.
- Sizes: h-5 w-5 (small), h-7 w-7 (large).

## Layout

- **Container**: max-w-7xl, mx-auto, px-4 sm:px-6 lg:px-8
- **Section**: py-20
- **Card**: p-8
- **Grid**: grid-cols-1 md:grid-cols-3 gap-8

## Effects

- **Shadows**: Subtle, increase on hover for cards and buttons.
- **Transitions**: transition-all, duration-200, ease-in-out.
- **Hover**: Color and shadow changes for interactive elements.

## Responsive

- Mobile-first, breakpoints at sm (640px), md (768px), lg (1024px).
- Fluid typography and spacing.

## Accessibility

- Sufficient color contrast.
- Semantic HTML.
- Keyboard accessible.
- ARIA labels as needed.

## Example Tailwind Classes

```css
/* Primary Button */
.inline-flex items-center px-8 py-4 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200

/* Card */
.p-8 rounded-2xl bg-white border-2 border-orange-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md

/* Input */
.w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all
```

---

**Summary:**  
This style is warm, simple, and modern, with orange as the accent. Use generous spacing, soft rounded corners, and subtle shadows. All interactive elements should feel inviting and friendly. Use the above palette and component styles to recreate this look in any environment.

---

Let me know if you want this style guide saved as a file, or if you need any further adjustments!
