# FreshCart Template Integration Guide

## Overview
This document describes the complete process of integrating the FreshCart Tailwind CSS e-commerce template into the Angular e-commerce frontend application.

**Template Source**: https://github.com/codescandy/freshcart-tailwind-ecommerce-HTML-template

**Date Started**: 2026-02-18

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Product Image Placeholder Fix](#phase-1-product-image-placeholder-fix)
3. [Phase 2: FreshCart Template Setup](#phase-2-freshcart-template-setup)
4. [Phase 3: Tailwind CSS Configuration](#phase-3-tailwind-css-configuration)
5. [Phase 4: Dark Mode Implementation](#phase-4-dark-mode-implementation)
6. [Phase 5: Component Migration](#phase-5-component-migration)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+
- Git

---

## Phase 1: Product Image Placeholder Fix

### Problem
Backend API returns incomplete image URLs (`"productPicture": "https://"`), causing broken images in product listings.

### Solution

#### Step 1.1: Create Placeholder Image
**File**: `src/assets/images/placeholder-product.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <!-- Background -->
  <rect width="400" height="300" fill="#f8f9fa"/>
  
  <!-- Image icon outline -->
  <rect x="100" y="75" width="200" height="150" fill="none" stroke="#dee2e6" stroke-width="2" stroke-dasharray="5,5"/>
  
  <!-- Mountain shape -->
  <path d="M150 175 L200 125 L250 175 Z" fill="#e9ecef"/>
  <path d="M180 175 L220 135 L260 175 Z" fill="#dee2e6"/>
  
  <!-- Sun/Circle -->
  <circle cx="280" cy="100" r="15" fill="#ffc107"/>
  
  <!-- Text -->
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#6c757d" text-anchor="middle">Brak zdjęcia produktu</text>
</svg>
```

#### Step 1.2: Update shop-item.component.html
**File**: `src/app/shop/shop-item/shop-item.component.html`

**Changes**:
- Wrap image in container with fixed height and overflow hidden
- Add conditional loading of placeholder image
- Add overlay message when no image available
- Add error handler

```html
<div class="card h-100 shadow-sm">
  <div class="position-relative" style="height: 200px; overflow: hidden; background-color: #f8f9fa;">
    <img 
      [src]="product?.productPicture && product?.productPicture !== 'https://' && product?.productPicture !== ''
           ? product?.productPicture 
           : 'assets/images/placeholder-product.svg'" 
      alt="{{product?.name}}" 
      class="img-fluid w-100 h-100"
      style="object-fit: cover;"
      (error)="onImageError($event)">
    <div *ngIf="!product?.productPicture || product?.productPicture === 'https://' || product?.productPicture === ''" 
         class="position-absolute top-50 start-50 translate-middle text-muted">
      <i class="fa fa-image fa-3x"></i>
      <p class="mt-2 small">Brak zdjęcia</p>
    </div>
  </div>
  <!-- ... rest of card body ... -->
</div>
```

#### Step 1.3: Update shop-item.component.ts
**File**: `src/app/shop/shop-item/shop-item.component.ts`

**Add method**:
```typescript
onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  if (imgElement.src !== window.location.origin + '/assets/images/placeholder-product.svg') {
    imgElement.src = 'assets/images/placeholder-product.svg';
  }
}
```

#### Step 1.4: Commit
```bash
git add src/app/shop/shop-item/shop-item.component.html src/app/shop/shop-item/shop-item.component.ts src/assets/images/placeholder-product.svg
git commit -m "fix(shop): add placeholder for products with missing images

- Add fallback to placeholder SVG when productPicture is empty or invalid
- Add onImageError() handler for graceful error handling
- Create placeholder-product.svg with icon and 'Brak zdjęcia produktu' text
- Show overlay message when no image available
- Fixes backend issue where productPicture returns 'https://' incomplete URL"
git push origin develop
```

**Status**: ✅ Completed (2026-02-18)

---

## Phase 2: FreshCart Template Setup

### Step 2.1: Download FreshCart Template
```bash
cd /home/robert/projects/ecommerce-frontend
mkdir -p freshcart-template
cd freshcart-template
git clone --depth 1 https://github.com/codescandy/freshcart-tailwind-ecommerce-HTML-template.git .
```

**Result**: FreshCart template files in `freshcart-template/` folder

### Step 2.2: Install FreshCart Dependencies
```bash
cd freshcart-template
npm install
```

**Installed packages**: 1157 packages including:
- gulp (build system)
- tailwindcss v3.4.3
- @tailwindcss/forms
- @tailwindcss/typography
- bootstrap v5.3.3
- @tabler/icons
- swiper (carousel)
- tiny-slider
- simplebar

**Status**: ✅ Completed (2026-02-18)

---

## Phase 3: Tailwind CSS Configuration

### Step 3.1: Install Tailwind Dependencies in Angular Project
```bash
cd /home/robert/projects/ecommerce-frontend
npm install -D tailwindcss@3.4.3 @tailwindcss/forms@0.5.7 @tailwindcss/typography@0.5.12 postcss autoprefixer
```

**Status**: ✅ Completed

### Step 3.2: Copy Tailwind Config
```bash
cp freshcart-template/tailwind.config.js .
```

**Status**: ✅ Completed

### Step 3.3: Update Tailwind Config for Angular
**File**: `tailwind.config.js`

**Edit content paths**:
```javascript
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,ts}',
    './freshcart-template/src/**/*.html'
  ],
  // ... rest of config
}
```

**Status**: ✅ Completed

### Step 3.4: Add Tailwind Directives to styles.scss
**File**: `src/styles.scss`

```scss
/* Tailwind CSS */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* You can add global styles to this file, and also import other style files */

label.xng-breadcrumb-trail {
    color: red;
    font-weight: bold;
}

/* Dark mode support */
.dark {
  color-scheme: dark;
}
```

**Status**: ✅ Completed

### Step 3.5: Copy FreshCart Assets
```bash
cp -r freshcart-template/src/assets/images src/assets/freshcart-images
```

**Result**: Copied categories, products, logos, icons, etc.

**Status**: ✅ Completed

---

## Phase 4: Dark Mode Implementation

### Step 4.1: Create Theme Toggle Component
**Files created**:
- `src/app/core/components/theme-toggle/theme-toggle.component.ts`
- `src/app/core/components/theme-toggle/theme-toggle.component.html`
- `src/app/core/components/theme-toggle/theme-toggle.component.scss`

**theme-toggle.component.ts**:
```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode = false;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
```

**Status**: ✅ Completed

### Step 4.2: Register ThemeToggleComponent in CoreModule
**File**: `src/app/core/core.module.ts`

**Added**:
- Import: `import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';`
- Declaration: `ThemeToggleComponent` in declarations array
- Export: `ThemeToggleComponent` in exports array

**Status**: ✅ Completed

### Step 4.3: Add Theme Toggle to Navbar
**File**: `src/app/core/nav-bar/nav-bar.component.html`

**Added**:
```html
<!-- Theme Toggle -->
<app-theme-toggle></app-theme-toggle>
```

**Status**: ✅ Completed

### Step 4.4: Commit Changes
```bash
git add FRESHCART_INTEGRATION.md tailwind.config.js src/app/core/components/theme-toggle src/app/core/core.module.ts src/app/core/nav-bar/nav-bar.component.html src/styles.scss src/assets/freshcart-images package.json package-lock.json
git commit -m "feat(freshcart): integrate FreshCart template with dark mode support"
```

**Commit Hash**: 33e6ddb

**Status**: ✅ Completed (2026-02-18)

---

## Phase 5: Component Migration

### Step 5.1: Copy FreshCart Assets
**TO DO**: Copy required assets from `freshcart-template/src/assets/` to `src/assets/`

### Step 5.2: Migrate Shop Component
**File**: `src/app/shop/shop.component.html` (TO BE MODIFIED)

Adapt FreshCart product grid layout to Angular component.

### Step 5.3: Migrate Product Card Component
**File**: `src/app/shop/shop-item/shop-item.component.html` (TO BE MODIFIED)

Replace Bootstrap card with FreshCart Tailwind product card design.

### Step 5.4: Create FreshCart Layout Component
**File**: `src/app/shared/components/freshcart-layout/freshcart-layout.component.ts` (TO BE CREATED)

Wrapper component for FreshCart header, footer, and layout.

**Status**: ⏳ Pending

---

## Troubleshooting

### Issue: Tailwind styles not applying
**Solution**: 
1. Ensure `tailwind.config.js` content paths include all Angular template files
2. Run `ng serve` again to rebuild
3. Check that `@tailwind` directives are in `styles.scss`

### Issue: Dark mode not working
**Solution**:
1. Verify `darkMode: 'class'` in tailwind.config.js
2. Ensure `.dark` class is added to `<html>` or `<body>` element
3. Check that theme toggle service is properly injecting the class

### Issue: FreshCart images not loading
**Solution**:
1. Copy all image assets from `freshcart-template/src/assets/images/` to `src/assets/images/`
2. Update image paths in templates to use Angular asset path

---

## Git Commits Summary

| Commit | Description | Status |
|--------|-------------|--------|
| 11 | Product image placeholder fix | ✅ Done |
| 12 | FreshCart template download & setup | ⏳ Pending |
| 13 | Tailwind CSS configuration | ⏳ Pending |
| 14 | Dark mode implementation | ⏳ Pending |
| 15 | Component migration (shop) | ⏳ Pending |
| 16 | Component migration (product card) | ⏳ Pending |
| 17 | FreshCart layout integration | ⏳ Pending |

---

## Next Steps

1. ✅ Product image placeholder - DONE
2. ⏳ Install FreshCart dependencies - IN PROGRESS
3. ⏳ Configure Tailwind CSS
4. ⏳ Create dark mode toggle
5. ⏳ Migrate shop components to FreshCart design
6. ⏳ Test and commit changes

---

## Resources

- **FreshCart GitHub**: https://github.com/codescandy/freshcart-tailwind-ecommerce-HTML-template
- **FreshCart Demo**: https://freshcart.codescandy.com/
- **FreshCart Docs**: https://freshcart.codescandy.com/tailwindcss/docs/index.html
- **Tailwind CSS Dark Mode**: https://tailwindcss.com/docs/dark-mode
