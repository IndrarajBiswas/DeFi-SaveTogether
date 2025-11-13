# SaveTogether Design System

## Overview

This design system provides a comprehensive, production-ready framework for building the SaveTogether DeFi microfinance platform. It features a **dark-mode-first** approach with high-contrast typography, modern Web3 aesthetics, and accessibility built-in.

---

## 🎨 Color Tokens

### Background Colors
All background colors are optimized for dark mode with proper contrast ratios:

| Token | Tailwind Class | Hex Value | Usage |
|-------|---------------|-----------|-------|
| **Page Background** | `bg-page-bg` | `#0a0a0b` | Main application background |
| **Card Background** | `bg-card-bg` | `#18181b` | Elevated surfaces, cards, panels |
| **Card Hover** | `bg-card-hover` | `#27272a` | Interactive element hover states |
| **Muted Background** | `bg-muted-bg` | `#09090b` | Recessed areas, disabled states |

### Border Colors

| Token | Tailwind Class | Hex Value | Usage |
|-------|---------------|-----------|-------|
| **Subtle Border** | `border-border-subtle` | `#27272a` | Light separation between elements |
| **Default Border** | `border-border-default` | `#3f3f46` | Standard borders on cards and inputs |
| **Accent Border** | `border-accent` | `#14b8a6` | Active/focused states |

### Text Colors
**CRITICAL: All text colors guarantee minimum 4.5:1 contrast ratio on dark backgrounds**

| Token | Tailwind Class | Hex Value | Contrast Ratio | Usage |
|-------|---------------|-----------|----------------|-------|
| **Primary Text** | `text-text-primary` | `#fafafa` | **18:1** | Main content, headings |
| **Secondary Text** | `text-text-secondary` | `#d4d4d8` | **12:1** | Labels, supporting text |
| **Muted Text** | `text-text-muted` | `#a1a1aa` | **7:1** | Captions, placeholders |
| **Inverse Text** | `text-text-inverse` | `#18181b` | N/A | Text on light backgrounds |

### Accent Colors (Teal Theme)

| Token | Tailwind Class | Hex Value | Usage |
|-------|---------------|-----------|-------|
| **Primary Accent** | `bg-accent` / `text-accent` | `#14b8a6` | CTAs, links, primary actions |
| **Accent Hover** | `bg-accent-hover` | `#0d9488` | Hover states for accent elements |
| **Accent Soft** | `bg-accent-soft` | `#2dd4bf` | Subtle highlights, secondary accents |
| **Accent Light** | `bg-accent-light` | `#5eead4` | Very subtle backgrounds |

### Status Colors

| Status | Background | Text | Border | Usage |
|--------|-----------|------|--------|-------|
| **Success** | `bg-emerald-500/20` | `text-emerald-400` | `border-emerald-500/30` | Successful operations |
| **Warning** | `bg-amber-500/20` | `text-amber-400` | `border-amber-500/30` | Warnings, cautions |
| **Error** | `bg-red-500/20` | `text-red-400` | `border-red-500/30` | Errors, failures |
| **Info** | `bg-blue-500/20` | `text-blue-400` | `border-blue-500/30` | Informational messages |

---

## 📝 Typography

### Font Family
- **Sans-serif**: Inter (primary)
- **Monospace**: SF Mono, Monaco, Courier New (for addresses, hashes, numbers)

### Type Scale

| Element | Tailwind Class | Size | Weight | Usage |
|---------|---------------|------|--------|-------|
| **H1** | `text-5xl font-extrabold` | 48px | 800 | Page titles |
| **H2** | `text-4xl font-bold` | 36px | 700 | Section headings |
| **H3** | `text-2xl font-semibold` | 24px | 600 | Subsection headings |
| **H4** | `text-xl font-semibold` | 20px | 600 | Card titles |
| **Large Body** | `text-lg` | 18px | 400 | Emphasis text |
| **Body** | `text-base` | 16px | 400 | Default text |
| **Small** | `text-sm` | 14px | 400 | Supporting text |
| **Caption** | `text-xs uppercase tracking-wide` | 12px | 500 | Labels, badges |

---

## 📐 Spacing System

Uses Tailwind's default 4px-based scale:

| Token | Value | Common Usage |
|-------|-------|--------------|
| `space-1` | 4px | Tight spacing (icon gaps) |
| `space-2` | 8px | Compact spacing |
| `space-3` | 12px | Default gaps |
| `space-4` | 16px | Standard padding |
| `space-6` | 24px | Card padding, section gaps |
| `space-8` | 32px | Large section padding |
| `space-12` | 48px | Hero padding |
| `space-16` | 64px | Extra large spacing |

### Layout Padding
- **Cards**: `p-6` (24px) standard, `p-8` (32px) for prominent cards
- **Sections**: `py-12` (48px) desktop, `py-8` (32px) mobile
- **Page Container**: `max-w-container` (1280px) with `px-6` padding

---

## 🧩 Component Patterns

### 1. Cards

```tsx
// Basic Card
<div className="card">
  <h3 className="text-xl font-semibold mb-4">Card Title</h3>
  <p className="text-text-secondary">Card content</p>
</div>

// Interactive Card (clickable)
<div className="card-interactive">
  ...
</div>

// Hero Card
<div className="card-hero">
  <h1 className="text-5xl font-extrabold mb-4">Hero Title</h1>
  <p className="text-text-secondary max-w-2xl mx-auto">Subtitle</p>
</div>

// Stat Card
<div className="stat-card">
  <div className="stat-value">1,234</div>
  <div className="stat-label">Total Value</div>
</div>
```

### 2. Buttons

```tsx
// Primary Button
<button className="btn-primary">
  Primary Action
</button>

// Secondary Button
<button className="btn-secondary">
  Secondary Action
</button>

// Outline Button
<button className="btn-outline">
  Outline Action
</button>

// Ghost Button
<button className="btn-ghost">
  Ghost Action
</button>

// Sizes
<button className="btn-primary btn-sm">Small</button>
<button className="btn-primary">Default</button>
<button className="btn-primary btn-lg">Large</button>

// With Icon (using lucide-react)
<button className="btn-primary">
  <Save className="w-4 h-4" />
  Save Changes
</button>
```

### 3. Badges

```tsx
// Status Badges
<span className="badge-success">
  <span className="status-dot-success" />
  Active
</span>

<span className="badge-warning">Warning</span>
<span className="badge-error">Error</span>
<span className="badge-info">Info</span>
<span className="badge-default">Default</span>
```

### 4. Forms

```tsx
<div className="space-y-4">
  <div>
    <label className="label">Field Label</label>
    <input
      type="text"
      className="input"
      placeholder="Enter value..."
    />
  </div>
</div>
```

### 5. Tables

```tsx
<div className="table-container">
  <table className="table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 6. Empty States

```tsx
<div className="empty-state">
  <div className="empty-state-icon">📭</div>
  <h3 className="empty-state-title">No Data Yet</h3>
  <p className="empty-state-message">
    Get started by creating your first item.
  </p>
  <button className="btn-primary mt-6">Create Item</button>
</div>
```

### 7. Loading States

```tsx
// Skeleton Loader
<div className="space-y-4">
  <div className="skeleton-title" />
  <div className="skeleton-text" />
  <div className="skeleton-text w-4/5" />
  <div className="skeleton-card" />
</div>
```

---

## 🎭 Micro-Interactions

### Hover States
- **Cards**: Subtle lift (`hover:-translate-y-1`) with shadow increase
- **Buttons**: Slight lift (`hover:-translate-y-0.5`) with shadow enhancement
- **Interactive elements**: Border color change to accent

### Focus States
All interactive elements have visible focus rings:
- **Ring**: `focus:ring-2 focus:ring-accent`
- **Ring Offset**: `focus:ring-offset-2 focus:ring-offset-page-bg`

### Transitions
- **Default**: `transition-all duration-200` for most interactions
- **Slow**: `transition-all duration-300` for cards and large elements
- **Instant**: `transition-colors` for simple color changes

---

## ♿ Accessibility Guidelines

### Contrast Ratios
- **Normal text**: Minimum 4.5:1 (WCAG AA)
- **Large text (18px+)**: Minimum 3:1 (WCAG AA)
- **All our text tokens exceed these requirements**

### Focus Management
- All interactive elements have visible focus states
- Skip-to-main-content link for keyboard users
- Proper heading hierarchy (h1 → h2 → h3)

### Semantic HTML
- Use semantic elements (`<nav>`, `<main>`, `<section>`, `<article>`)
- Proper `<label>` associations for all form inputs
- ARIA labels where needed

### Font Sizes
- **Minimum**: 14px (text-sm) for body text
- **Base**: 16px (text-base) for default readability
- Never use font sizes below 12px except for specific UI elements (badges)

---

## 📱 Responsive Breakpoints

Tailwind's default breakpoints:

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets, desktop navigation |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile-First Patterns
```tsx
// Stack on mobile, grid on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  ...
</div>

// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Different padding on mobile vs desktop
<div className="px-4 md:px-6 py-8 md:py-12">
  ...
</div>
```

---

## 🔧 Implementation Notes

### Dark Mode Setup
The application uses **class-based dark mode** with `darkMode: 'class'` in Tailwind config. All styles are dark-mode-first, so no `dark:` prefixes are needed for the base design.

### Icon System
Use **lucide-react** for consistent, modern icons:
```tsx
import { Wallet, Users, TrendingUp } from 'lucide-react'

<Wallet className="w-5 h-5" />
```

### Animation Performance
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (causes layout reflow)
- Respect `prefers-reduced-motion` media query

---

## 📦 Component File Structure

```
components/
├── ui/
│   ├── Card.tsx              # Reusable card components
│   ├── Button.tsx            # Button variants
│   ├── Badge.tsx             # Status badges
│   ├── Input.tsx             # Form inputs
│   ├── EmptyState.tsx        # Empty state patterns
│   └── SkeletonLoader.tsx    # Loading skeletons
├── layout/
│   ├── AppLayout.tsx         # Main layout wrapper
│   ├── Header.tsx            # Site header
│   └── Footer.tsx            # Site footer
└── features/
    ├── Dashboard/
    ├── Savings/
    ├── Groups/
    └── Loans/
```

---

## ✅ Testing Checklist

Before deploying:

- [ ] Test all text is legible on dark backgrounds (no black-on-black)
- [ ] Verify contrast ratios meet WCAG AA standards
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Test screen reader compatibility
- [ ] Verify responsive behavior on mobile (320px), tablet (768px), desktop (1280px)
- [ ] Test all interactive states (hover, focus, active, disabled)
- [ ] Verify loading states don't cause layout shift
- [ ] Test with reduced motion preference enabled

---

## 🚀 Quick Start

1. All styles are in `styles/globals.css`
2. Color tokens are in `tailwind.config.js`
3. Use component classes (`.card`, `.btn-primary`, etc.) for consistency
4. Follow the responsive patterns for mobile-first design
5. Always test in dark mode (it's the only mode!)

---

**Design Philosophy**: Clean, premium, accessible Web3 fintech design that welcomes newcomers while providing power-user features.
