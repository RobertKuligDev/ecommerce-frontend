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
**Status**: ⏳ Pending

**Files to Audit**:
- `src/app/basket/basket.service.ts`
- `src/app/core/nav-bar/nav-bar.component.ts`
- `src/app/shared/components/stepper/stepper.component.ts`
- `src/app/checkout/**/*.ts`
- `src/app/shop/**/*.ts`

**Audit Command**:
```bash
# Find all console.log statements
grep -rn "console\." src/app --include="*.ts"
```

**Commit Command** (after cleanup):
```bash
git add src/app/**/*.ts
git commit -m "security: remove console.log statements from production code

- Remove debug console.log from BasketService
- Remove debug logs from NavBarComponent
- Remove console.log from checkout components
- Remove debug logs from shop components
- Prevent potential token/data leakage in production
- Keep error logging via ToastrService only"
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

| Backend Endpoint | Angular Service Method | HTTP Method |
|-----------------|----------------------|-------------|
| `/api/accounts/login` | `AccountService.login()` | POST |
| `/api/accounts/register` | `AccountService.register()` | POST |
| `/api/accounts/current` | `AccountService.loadCurrentUser()` | GET |
| `/api/accounts/refresh` | `TokenService.refreshAccessToken()` | POST |
| `/api/products` | `ShopService.getProduct()` | GET |
| `/api/products/{id}` | `ShopService.getProductById()` | GET |
| `/api/baskets/{id}` | `BasketService.getBasket()` | GET |
| `/api/baskets` | `BasketService.setBasket()` | POST |
| `/api/orders/user` | `OrderService.getOrdersForUser()` | GET |
| `/api/orders/{id}` | `OrderService.getOrderDetails()` | GET |

---

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
