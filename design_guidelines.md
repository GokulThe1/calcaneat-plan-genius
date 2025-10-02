# Design Guidelines: Premium Meal Delivery Platform

## Design Approach

**Reference-Based Approach** drawing inspiration from premium health and meal delivery services (HelloFresh, Factor, Trifecta) combined with modern health tech interfaces (BetterMe). The design emphasizes trust, wellness, and personalization through clean aesthetics with strategic use of food photography.

**Core Principles:**
- Health-forward visual language conveying freshness and vitality
- Premium but approachable aesthetic balancing clinical precision with warmth
- Clear differentiation between the two service paths (Clinical vs AI)
- Data visualization that makes nutritional information digestible and motivating

---

## Color Palette

### Light Mode
- **Primary:** 142 71% 45% (Fresh green - health, vitality)
- **Primary Hover:** 142 71% 38%
- **Secondary:** 24 100% 50% (Warm orange - energy, appetite)
- **Background:** 0 0% 100%
- **Surface:** 0 0% 98%
- **Text Primary:** 0 0% 13%
- **Text Secondary:** 0 0% 45%
- **Border:** 0 0% 89%

### Dark Mode
- **Primary:** 142 65% 55%
- **Primary Hover:** 142 65% 48%
- **Secondary:** 24 95% 60%
- **Background:** 0 0% 9%
- **Surface:** 0 0% 13%
- **Text Primary:** 0 0% 95%
- **Text Secondary:** 0 0% 65%
- **Border:** 0 0% 23%

### Accent Colors (Sparingly)
- **Success/Health:** 142 71% 45% (matches primary)
- **Warning/Premium:** 45 93% 47% (Gold for premium tier badges)
- **Info/Data:** 217 91% 60% (Blue for nutritional charts)

---

## Typography

**Font Families:**
- **Display/Headings:** 'Plus Jakarta Sans' (Modern, friendly, health-tech feel)
- **Body/UI:** 'Inter' (Excellent readability for data and forms)
- **Accent/Numbers:** 'JetBrains Mono' (For nutritional data, calories)

**Scale:**
- Hero Headline: text-5xl md:text-7xl font-bold
- Section Headers: text-3xl md:text-4xl font-semibold
- Subsection Headers: text-xl md:text-2xl font-semibold
- Body Large: text-lg leading-relaxed
- Body Regular: text-base leading-relaxed
- Small/Meta: text-sm
- Nutritional Data: text-lg md:text-xl font-mono font-semibold

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20 consistently
- Component padding: p-4 md:p-6 lg:p-8
- Section vertical spacing: py-16 md:py-20 lg:py-24
- Card spacing: p-6 md:p-8
- Grid gaps: gap-6 md:gap-8

**Container Strategy:**
- Full-width sections with inner max-w-7xl mx-auto px-4 md:px-6
- Content sections: max-w-6xl
- Text content: max-w-3xl
- Forms/Quiz: max-w-2xl

**Grid Patterns:**
- Features/Plans: grid-cols-1 md:grid-cols-2 gap-8
- Meal cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Nutritional breakdown: grid-cols-2 md:grid-cols-4 gap-4

---

## Component Library

### Navigation
- Transparent header with backdrop-blur-md on scroll
- Logo + primary navigation + CTA buttons (Login, Get Started)
- Mobile: Hamburger menu with full-screen overlay
- Sticky positioning with subtle shadow on scroll

### Hero Section
- Split layout: 60/40 text-to-image on desktop
- Large hero image showcasing vibrant, healthy meal
- Prominent headline with tagline
- Two distinct CTAs: "Premium Clinical Plan" (primary) and "AI-Assisted Plan" (secondary outline)
- Trust indicators below CTAs: "Trusted by 10,000+ health-conscious individuals"

### Plan Comparison Cards
- Side-by-side cards with subtle elevation (shadow-lg)
- Icon at top (medical cross for Clinical, AI brain for AI-Assisted)
- Clear feature lists with checkmark icons
- Differentiated visual treatment (Clinical has subtle gold accent border)
- "Learn More" CTA at bottom

### Interactive Quiz (AI Path)
- Progress bar at top showing completion (1/8, 2/8, etc.)
- Single question per screen with smooth transitions
- Large, tappable option buttons (min-h-16) with hover states
- Visual icons accompanying each option
- "Next" button appears after selection
- Background with subtle meal imagery at 10% opacity

### Meal Plan Display
- Card-based layout with meal imagery
- Nutritional badge overlay (calories, protein, carbs, fats in compact format)
- Swap/customize button on hover
- Weekly calendar view with day selector
- Color-coded meal types (breakfast, lunch, dinner, snacks)

### Nutritional Dashboard
- Circular progress charts for macro tracking
- Bar charts for weekly calorie trends
- Card-based stat displays (protein, carbs, fats, fiber)
- Color-coded to match brand palette (green for protein, orange for carbs, blue for fats)

### Testimonials Section
- Three-column grid on desktop, single on mobile
- Customer photo (circular) + name + transformation metric
- Star rating display
- Quote in large, italic text
- Before/after meal photos in some cards

### Footer
- Four-column layout: Company, Resources, Plans, Contact
- Newsletter signup with inline form
- Social media icons
- Trust badges (organic, non-GMO, etc.)
- Payment method icons

### Forms
- Floating label inputs with focus states
- Clear error states with red border and helper text
- Success states with green checkmark
- Radio buttons and checkboxes with custom styling matching brand
- Date/time pickers for consultation booking

---

## Animations

**Minimal Motion Strategy:**
- Subtle fade-in on scroll for sections (opacity 0 to 1, 400ms)
- Smooth transitions on interactive elements (150ms ease-in-out)
- Progress bar animations for quiz completion
- No parallax, no elaborate scroll-triggered animations
- Hover states: subtle scale (1.02) and shadow increase

---

## Images

**Hero Section:** Large, high-quality image of a beautifully plated healthy meal (salmon, vegetables, quinoa) with natural lighting. Image should be 1920x1080, positioned on right side of hero split layout.

**Plan Cards:** Icon-style illustrations for each plan type (medical professional for Clinical, AI chip/brain for AI-Assisted)

**Meal Cards:** High-quality food photography showing variety of meals from different angles. Each meal should look fresh, colorful, and appetizing. Minimum 800x600 resolution.

**Testimonials:** Customer headshots (circular crop, 120x120) and optional before/after meal selection images

**Process Steps (Clinical Path):** Illustrated icons or photos showing: consultation, test kit, report, nutritionist meeting, meal delivery

**Dashboard:** Chart visualizations using libraries (Chart.js or Recharts), meal thumbnail images in calendar view

**Trust Indicators:** Logo badges for certifications (organic, nutritionist-approved, etc.)

This design creates a premium, health-forward experience that balances clinical precision with approachable warmth, using strategic imagery and clean layouts to build trust and drive conversions.