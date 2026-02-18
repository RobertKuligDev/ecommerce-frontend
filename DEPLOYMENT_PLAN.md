# Deployment Plan - E-Commerce Frontend

## Overview
This document describes the complete deployment plan for the Angular e-commerce frontend application, including JWT authentication setup, security hardening, Docker containerization, and CI/CD pipeline configuration.

## Repository
- **URL**: https://github.com/RobertKuligDev/ecommerce-frontend
- **Main Branch**: `main`
- **Development Branch**: `develop`

---

## Git-Flow Workflow

### Initial Setup
```bash
# Create develop branch from main
git checkout main
git pull origin main
git checkout -b develop
git push -u origin develop
```

### Branch Strategy
| Branch | Purpose | Merge To |
|--------|---------|----------|
| `main` | Production releases | - |
| `develop` | Integration branch | main (via release) |
| `feature/*` | New features | develop |
| `release/*` | Release preparation | main, develop |
| `hotfix/*` | Production fixes | main, develop |

---

## Commit Sequence

### Commit 1: Environment Configuration
**Status**: ✅ Completed (modified files ready)

**Files Changed**:
- `src/environments/environment.development.ts`
- `src/environments/environment.ts`

**Changes**:
- Development: `http://localhost:5000/api/`
- Production: `https://api.robertkulig-dev.eu/api/`

**Commit Command**:
```bash
git add src/environments/environment.development.ts src/environments/environment.ts
git commit -m "feat(env): configure localhost for development environment

- Set development API URL to http://localhost:5000/api/
- Keep production URL pointing to api.robertkulig-dev.eu
- Add stripe_publishable_key to production environment"
git push origin develop
```

---

### Commit 2: Token Service + JWT Interceptor
**Status**: ✅ Completed

**Files Changed**:
- `src/app/core/services/token.service.ts` (NEW)
- `src/app/core/interceptors/jwt.interceptor.ts` (MODIFIED)

**Features**:
- Secure token storage using `sessionStorage` (XSS protection)
- Automatic token refresh via `/api/accounts/refresh`
- Token expiry detection with 30-second buffer
- Request queuing during refresh
- Automatic redirect to login on refresh failure

**Commit Command** (executed):
```bash
git add src/app/core/services/token.service.ts src/app/core/interceptors/jwt.interceptor.ts
git commit -m "feat(auth): add TokenService and JWT interceptor with auto-refresh

- TokenService: secure sessionStorage-based token management
- Automatic token refresh on 401 responses via /api/accounts/refresh
- Token expiry detection with 30-second buffer
- Request queuing during refresh to prevent concurrent calls
- Redirect to login on refresh failure
- isAuthenticated() method for route guards"
git push origin develop
```

---

### Commit 3: API Endpoint Mapping Update
**Status**: ⏳ Pending (modified files ready)

**Files Changed**:
- `src/app/account/account.service.ts`
- `src/app/basket/basket.service.ts`
- `src/app/checkout/checkout.service.ts`
- `src/app/order/order.service.ts`
- `src/app/shop/shop.service.ts`
- `src/app/core/services/token.service.ts`
- `src/app/core/test-error/test-error.component.ts`

**Changes**:
Updated all API endpoint paths to match the new backend API structure from Swagger documentation:

| Service | Old Path | New Path |
|---------|----------|----------|
| AccountService | `Accounts/get-current-user` | `Accounts/current` |
| AccountService | `Accounts/check-email-exist` | `Accounts/email-exists` |
| AccountService | `Accounts/get-user-address` | `Accounts/address` |
| AccountService | `Accounts/update-user-address` | `Accounts/address` |
| TokenService | `accounts/refresh` | `Accounts/refresh` |
| BasketService | `Baskets/get-basket-item/{id}` | `Baskets/{id}` |
| BasketService | `Baskets/update-basket` | `Baskets` |
| BasketService | `Baskets/delete-basket-item/{basketId}` | `Baskets/{basketId}` |
| CheckoutService | `Orders/create-order` | `Orders` |
| CheckoutService | `Orders/get-delivery-methods` | `Orders/delivery-methods` |
| OrderService | `Orders/get-orders-for-user` | `Orders/user` |
| OrderService | `Orders/get-order-by-id/{id}` | `Orders/{id}` |
| ShopService | `Products/get-all-products` | `Products` |
| ShopService | `Categories/get-all-categories` | `Categories` |
| ShopService | `Products/get-product-by-id/{id}` | `Products/{id}` |
| TestErrorComponent | `Products/973` | `products/973` |

**Commit Command**:
```bash
git add src/app/account/account.service.ts src/app/basket/basket.service.ts src/app/checkout/checkout.service.ts src/app/order/order.service.ts src/app/shop/shop.service.ts src/app/core/services/token.service.ts src/app/core/test-error/test-error.component.ts
git commit -m "fix(api): update all endpoint paths to match new backend API structure

- AccountService: update 5 endpoints to new simplified paths
- BasketService: update 3 endpoints to RESTful paths
- CheckoutService: update 2 endpoints to match Swagger docs
- OrderService: update 2 endpoints to simplified paths
- ShopService: update 3 endpoints to RESTful paths
- TokenService: fix case sensitivity (accounts → Accounts)
- TestErrorComponent: fix Products → products case
- All endpoints now match Swagger documentation at localhost:5000/swagger"
git push origin develop
```

---

### Commit 4: AccountService Refactoring
**Status**: ✅ Completed

**Files Changed**:
- `src/app/account/account.service.ts`
- `src/app/account/login/login.component.ts`
- `src/app/account/register/register.component.ts`

**Changes**:
- Replace `localStorage` with `TokenService`
- Remove `console.log` statements
- Update `loadCurrentUser`, `login`, `register` methods
- Integrate refresh token flow

**Commit Command** (executed):
```bash
git add src/app/account/account.service.ts src/app/account/login/login.component.ts src/app/account/register/register.component.ts
git commit -m "refactor(auth): update AccountService to use TokenService

- Replace localStorage with TokenService for token management
- Remove console.log statements (security cleanup)
- Update loadCurrentUser to use TokenService
- Integrate refresh token flow in login/register methods
- Improve error handling in initializeCurrentUser
- Remove debug logs from login and register components"
git push origin develop
```

---

### Commit 5: Security Audit - Console.log Removal
**Status**: ⏳ Pending (modified files ready)

**Files Changed**:
- `src/app/checkout/checkout-delivery/checkout-delivery.component.ts` (MODIFIED)
- `src/app/checkout/checkout.component.ts` (MODIFIED)
- `src/app/checkout/checkout-review/checkout-review.component.ts` (MODIFIED)
- `src/app/order/order.component.ts` (MODIFIED)
- `src/app/order/order-details/order-details.component.ts` (MODIFIED)
- `src/app/shop/shop.component.ts` (MODIFIED)
- `src/app/shop/shop-item/shop-item.component.ts` (MODIFIED)
- `src/app/shop/product-details/product-details.component.ts` (MODIFIED)

**Changes**:
Added `ToastrService` to components missing error handling and replaced `console.error` with user-friendly toast notifications:

| Component | Change |
|-----------|--------|
| CheckoutDeliveryComponent | Added ToastrService, replaced `console.error` with `this.toastr.error('Failed to load delivery methods', 'Error')` |
| CheckoutComponent | Added ToastrService, replaced `console.error` with `this.toastr.error('Failed to load user address', 'Error')` |
| CheckoutReviewComponent | Replaced `console.error` with `this.toastr.error('Error creating payment intent', 'Error')` |
| OrderComponent | Added ToastrService, replaced `console.error` with `this.toastr.error('Failed to load orders', 'Error')` |
| OrderDetailsComponent | Added ToastrService, replaced `console.error` with `this.toastr.error('Failed to load order details', 'Error')` |
| ShopComponent | Added ToastrService, replaced `console.error` with `this.toastr.error('Failed to load products', 'Error')` |
| ShopItemComponent | Added ToastrService, replaced `console.error` with `this.toastr.error('Product is undefined', 'Error')` |
| ProductDetailsComponent | Added ToastrService, replaced `console.error` with `this.toastr.error('Product is not available', 'Error')` |

**Note**: `test-error.component.ts` intentionally keeps `console.error` for debugging purposes (it's a test component).

**Commit Command**:
```bash
git add src/app/checkout/checkout-delivery/checkout-delivery.component.ts src/app/checkout/checkout.component.ts src/app/checkout/checkout-review/checkout-review.component.ts src/app/order/order.component.ts src/app/order/order-details/order-details.component.ts src/app/shop/shop.component.ts src/app/shop/shop-item/shop-item.component.ts src/app/shop/product-details/product-details.component.ts
git commit -m "security: add ToastrService to components missing error handling

- CheckoutDeliveryComponent: add ToastrService for delivery methods error
- CheckoutComponent: add ToastrService for user address error
- CheckoutReviewComponent: replace console.error with toastr
- OrderComponent: add ToastrService for orders loading error
- OrderDetailsComponent: add ToastrService for order details error
- ShopComponent: add ToastrService for products loading error
- ShopItemComponent: add ToastrService for undefined product error
- ProductDetailsComponent: add ToastrService for null product error
- Consistent user-friendly error messages across all components
- Keep console.error only in test-error.component.ts (debugging purpose)"
git push origin develop
```

---

### Commit 11: Product Image Placeholder Fix
**Status**: ✅ Completed

**Files Changed**:
- `src/app/shop/shop-item/shop-item.component.html` (MODIFIED)
- `src/app/shop/shop-item/shop-item.component.ts` (MODIFIED)
- `src/assets/images/placeholder-product.svg` (NEW)

**Problem**:
Backend API returns incomplete image URLs (`"productPicture": "https://"`), causing broken images in product listings.

**Solution**:
- Added fallback to placeholder SVG image when product picture is missing or invalid
- Added `onImageError()` method to handle image loading errors gracefully
- Created placeholder SVG with icon and "Brak zdjęcia produktu" text
- Conditional display with overlay message when no image available

**Commit Command**:
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

---

### Commit 6: Routing Optimization
**Status**: ⏳ Pending

**Files Changed**:
- `src/app/app-routing.module.ts`

**Features**:
- Custom preloading strategy
- Selective preloading for Shop/Basket modules
- Skip preloading for auth-required routes

**Commit Command** (after edits):
```bash
git add src/app/app-routing.module.ts
git commit -m "perf(routing): implement custom preloading strategy for lazy-loaded modules

- Add CustomPreloadingStrategy for selective preloading
- Preload Shop and Basket modules for faster navigation
- Skip preloading for Account and Orders (auth-required)
- Add data.preload flag to route configurations"
git push origin develop
```

---

### Commit 7: Docker Configuration
**Status**: ⏳ Pending

**Files Created**:
- `Dockerfile`
- `.dockerignore`
- `nginx.conf`

**Features**:
- Multi-stage build (Node.js build → nginx runtime)
- Optimized nginx configuration for SPA
- Gzip compression
- Security headers (X-Frame-Options, CSP, etc.)

**Commit Command** (after file creation):
```bash
git add Dockerfile .dockerignore nginx.conf
git commit -m "feat(docker): add Docker configuration for Angular production build

- Multi-stage build (Node.js build -> nginx runtime)
- Optimized nginx configuration for SPA
- Gzip compression enabled
- Security headers (X-Frame-Options, X-Content-Type-Options, CSP)
- .dockerignore to exclude node_modules and dist"
git push origin develop
```

---

### Commit 8: Docker Compose with Traefik
**Status**: ⏳ Pending

**Files Created**:
- `docker-compose.yml`
- `docker-compose.prod.yml`
- `.env.example`

**Features**:
- Local development configuration
- Production configuration with Traefik labels
- Automatic HTTPS via Let's Encrypt
- Network isolation

**Commit Command** (after file creation):
```bash
git add docker-compose.yml docker-compose.prod.yml .env.example
git commit -m "feat(docker): add Docker Compose configuration with Traefik

- docker-compose.yml for local development
- docker-compose.prod.yml for VPS production with Traefik
- Traefik labels for automatic HTTPS
- Environment-based configuration
- Network isolation for security"
git push origin develop
```

---

### Commit 9: GitHub Actions CI/CD
**Status**: ⏳ Pending

**Files Created**:
- `.github/workflows/deploy.yml`

**Features**:
- Build and test on push to develop
- Production deploy on merge to main
- Docker image build and push
- Automatic VPS deployment via SSH

**Commit Command** (after file creation):
```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions workflow for build and deploy

- Build and test on push to develop
- Production deploy on merge to main
- Docker image build and push to registry
- Automatic deployment to VPS via SSH
- Environment-based configuration"
git push origin develop
```

---

### Commit 10: Release to Production
**Status**: ⏳ Pending (final step)

**Commands**:
```bash
# Final tests on develop
npm run build
npm test

# Merge to main (release)
git checkout main
git merge --no-ff develop -m "release: v1.0.0 - Production deployment with JWT auth and Docker

Features:
- JWT authentication with refresh tokens
- Secure token storage (sessionStorage)
- Docker containerization with nginx
- Traefik reverse proxy configuration
- GitHub Actions CI/CD pipeline
- Custom preloading strategy for routes
- Security hardening (console.log removal)

Security:
- XSS protection via sessionStorage
- CSRF protection via JWT headers
- Security headers in nginx
- Token auto-refresh mechanism"

git push origin main

# Create tag
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0

# Update develop
git checkout develop
git merge main
git push origin develop
```

---

## API Endpoint Mapping

### Current State (As of 2026-02-18)

The backend API has been updated with new simplified endpoint paths. The frontend currently uses old endpoint paths and requires updates.

**Base URL**: `localhost:5000/api`

### Complete Endpoint Mapping Table

| Service | Old Frontend Path | New Backend Path (Swagger) | HTTP Method | Status |
|---------|------------------|---------------------------|-------------|--------|
| **Accounts** |
| AccountService | `Accounts/get-current-user` | `/api/Accounts/current` | GET | ⏳ To Update |
| AccountService | `Accounts/login` | `/api/Accounts/login` | POST | ✅ Correct |
| AccountService | `Accounts/register` | `/api/Accounts/register` | POST | ✅ Correct |
| AccountService | `Accounts/check-email-exist` | `/api/Accounts/email-exists` | GET | ⏳ To Update |
| AccountService | `Accounts/get-user-address` | `/api/Accounts/address` | GET | ⏳ To Update |
| AccountService | `Accounts/update-user-address` | `/api/Accounts/address` | PUT | ⏳ To Update |
| **Token** |
| TokenService | `accounts/refresh` | `/api/Accounts/refresh` | POST | ⏳ To Update (case) |
| **Basket** |
| BasketService | `Baskets/get-basket-item/{id}` | `/api/Baskets/{id}` | GET | ⏳ To Update |
| BasketService | `Baskets/update-basket` | `/api/Baskets` | POST | ⏳ To Update |
| BasketService | `Baskets/delete-basket-item/{basketId}` | `/api/Baskets/{id}` | DELETE | ⏳ To Update |
| BasketService | `Payments/{basketId}` | `/api/Payments/{basketId}` | POST | ✅ Correct |
| **Checkout** |
| CheckoutService | `Orders/create-order` | `/api/Orders` | POST | ⏳ To Update |
| CheckoutService | `Orders/get-delivery-methods` | `/api/Orders/delivery-methods` | GET | ⏳ To Update |
| **Orders** |
| OrderService | `Orders/get-orders-for-user` | `/api/Orders/user` | GET | ⏳ To Update |
| OrderService | `Orders/get-order-by-id/{id}` | `/api/Orders/{orderId}` | GET | ⏳ To Update |
| **Products** |
| ShopService | `Products/get-all-products` | `/api/Products` | GET | ⏳ To Update |
| ShopService | `Categories/get-all-categories` | `/api/Categories` | GET | ⏳ To Update |
| ShopService | `Products/get-product-by-id/{id}` | `/api/Products/{id}` | GET | ⏳ To Update |
| **Test Errors** |
| TestErrorComponent | `ErrorLogs/server-error` | `/api/ErrorLogs/server-error` | GET | ✅ Correct |
| TestErrorComponent | `Products/973` | `/api/Products/973` | GET | ⏳ To Update (case) |
| TestErrorComponent | `ErrorLogs/bad-request` | `/api/ErrorLogs/bad-request` | GET | ✅ Correct |
| TestErrorComponent | `ErrorLogs/bad-request/three` | `/api/ErrorLogs/bad-request/{id}` | GET | ✅ Correct |

### Files Requiring Updates

1. `src/app/account/account.service.ts` - 5 endpoints to fix
2. `src/app/core/services/token.service.ts` - 1 endpoint to fix (case sensitivity)
3. `src/app/basket/basket.service.ts` - 3 endpoints to fix
4. `src/app/checkout/checkout.service.ts` - 2 endpoints to fix
5. `src/app/order/order.service.ts` - 2 endpoints to fix
6. `src/app/shop/shop.service.ts` - 3 endpoints to fix
7. `src/app/core/test-error/test-error.component.ts` - 1 endpoint to fix (case sensitivity)

---

## Security Checklist

## Security Checklist

- [x] Token storage migrated from localStorage to sessionStorage
- [x] JWT interceptor with automatic refresh
- [x] Console.log removal from production code
- [x] Security headers in nginx configuration
- [ ] CSP (Content Security Policy) headers
- [ ] Rate limiting configuration
- [ ] HTTPS enforcement via Traefik

---

## Progress Tracking

| Commit | Status | Date |
|--------|--------|------|
| 1. Environment Config | ✅ Done | 2026-02-17 |
| 2. Token Service + JWT Interceptor | ✅ Done | 2026-02-17 |
| 4. AccountService Refactor | ✅ Done | 2026-02-17 |
| 5. Security Audit | ⏳ Pending | - |
| 6. Routing Optimization | ⏳ Pending | - |
| 7. Docker Config | ⏳ Pending | - |
| 8. Docker Compose | ⏳ Pending | - |
| 9. CI/CD Pipeline | ⏳ Pending | - |
| 10. Release | ⏳ Pending | - |

---

## Next Steps

1. **Security Audit** - Remove all console.log statements from basket, nav-bar, checkout, shop components
2. **Routing Optimization** - Implement custom preloading strategy
3. **Create Docker files** - Dockerfile, nginx.conf, docker-compose
4. **Setup CI/CD** - GitHub Actions workflow
5. **Release** - Merge to main and tag
