# HR Leadership Team AI Dashboard POC - Agent Guidelines

**Project:** HR Leadership Team AI Dashboard POC
**Version:** 1.0
**Date:** January 15, 2026
**Purpose:** Guide AI agents in building beautiful, secure React interfaces for the HRLT POC

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Development Guidelines](#development-guidelines)
4. [UI/UX Design System](#uiux-design-system)
5. [Component Architecture](#component-architecture)
6. [Security Requirements](#security-requirements)
7. [Integration Guidelines](#integration-guidelines)
8. [Testing & Quality](#testing--quality)
9. [Common Patterns](#common-patterns)

---

## Project Overview

### Mission
Build a Proof of Concept web application that combines Power BI analytics with conversational AI to help HR leaders monitor and improve workplace compliance with return-to-office policies.

### Core User Experience
- **Full-screen Power BI dashboard** displaying compliance metrics
- **Collapsible AI chat panel** for natural language insights
- **Hierarchical access control** ensuring managers only see their team data
- **Privacy-first design** with 6-person minimum rule and anonymization

### Success Criteria
- Beautiful, professional interface matching enterprise standards
- Seamless integration of Power BI embed and Copilot Studio
- Sub-5-second dashboard load times
- Sub-15-second AI response times
- Zero training required for basic usage

---

## Technical Architecture

### Frontend Stack
```
Framework: Next.js 14+ (App Router)
Language: TypeScript
Styling: Tailwind CSS + CSS Modules
Auth: MSAL (Microsoft Authentication Library)
State: React Context + SWR for data fetching
UI Components: shadcn/ui + Custom Components
```

### Project Structure
```
├── app/
│   ├── page.tsx                          # Landing page with login
│   ├── dashboard/
│   │   └── page.tsx                      # Main dashboard (protected)
│   └── api/
│       ├── auth/
│       │   └── validate/route.ts         # Security validation
│       └── powerbi/
│           └── token/route.ts            # Token refresh
├── components/
│   ├── dashboard/
│   │   ├── PowerBIEmbed.tsx              # Power BI embedding
│   │   ├── CopilotChat.tsx               # Copilot Studio widget
│   │   ├── ChatToggle.tsx                # Floating chat button
│   │   └── DashboardLayout.tsx           # Overlay orchestration
│   ├── auth/
│   │   ├── LoginButton.tsx
│   │   └── ProtectedRoute.tsx
│   └── ui/                               # shadcn/ui components
├── lib/
│   ├── msal-config.ts                    # Azure AD configuration
│   ├── hierarchy-service.ts              # User hierarchy lookup
│   └── powerbi-client.ts                 # Power BI embed utilities
└── styles/
    └── dashboard.module.css              # Dashboard-specific styles
```

### Data Flow
```
User Authentication (Azure AD)
    ↓
Next.js App (Session Management)
    ↓
    ├─→ Power BI Embed (User-Owns-Data)
    │       ↓
    │   Power BI Service
    │       ↓
    │   Power BI Semantic Model
    │       ↓
    │   Databricks Unity Catalog
    │
    └─→ Copilot Studio Widget (Authenticated)
            ↓
        Power BI Service (via semantic model)
            ↓
        Databricks Unity Catalog
```

---

## Development Guidelines

### Code Style & Best Practices

#### TypeScript Standards
```typescript
// ✅ GOOD: Explicit types, clear interfaces
interface DashboardProps {
  userId: string;
  userEmail: string;
  hierarchyLevel: 'VP' | 'Director' | 'Manager';
  allowedTeams: string[];
}

export function Dashboard({ userId, userEmail, hierarchyLevel, allowedTeams }: DashboardProps) {
  // Implementation
}

// ❌ BAD: Implicit any, unclear types
export function Dashboard(props: any) {
  // Implementation
}
```

#### React Component Patterns
```typescript
// ✅ GOOD: Server components by default, client only when needed
// app/dashboard/page.tsx
import { PowerBIEmbed } from '@/components/dashboard/PowerBIEmbed';

export default async function DashboardPage() {
  const session = await getServerSession();
  return <PowerBIEmbed userId={session.user.id} />;
}

// components/dashboard/PowerBIEmbed.tsx
'use client';
import { useEffect, useRef } from 'react';
import { models } from 'powerbi-client';

export function PowerBIEmbed({ userId }: { userId: string }) {
  // Client component for Power BI JavaScript API
}
```

#### Error Handling
```typescript
// ✅ GOOD: Comprehensive error handling with user-friendly messages
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.userId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Process request
    const result = await processData(body);
    return Response.json({ success: true, data: result });

  } catch (error) {
    console.error('[Dashboard API Error]', error);
    return Response.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}

// ❌ BAD: Silent failures or raw error exposure
export async function POST(request: Request) {
  const result = await processData(await request.json());
  return Response.json(result);
}
```

#### Data Fetching with SWR
```typescript
// ✅ GOOD: Use SWR for client-side data fetching
import useSWR from 'swr';

export function ComplianceCard() {
  const { data, error, isLoading } = useSWR(
    '/api/compliance/current',
    fetcher,
    { refreshInterval: 60000 } // Refresh every minute
  );

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState />;
  return <ComplianceDisplay data={data} />;
}

// ❌ BAD: Fetching in useEffect
export function ComplianceCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/compliance/current')
      .then(res => res.json())
      .then(setData);
  }, []);

  return data ? <ComplianceDisplay data={data} /> : null;
}
```

### File Organization

#### Component Files
```typescript
// Each component in its own file with co-located styles and tests
// components/dashboard/PowerBIEmbed.tsx
'use client';
import { useEffect, useRef } from 'react';
import { models, service } from 'powerbi-client';
import styles from './PowerBIEmbed.module.css';

export function PowerBIEmbed({ userId }: PowerBIEmbedProps) {
  // Component implementation
}

// components/dashboard/PowerBIEmbed.module.css
.embedContainer {
  width: 100%;
  height: 100vh;
  position: relative;
}

// components/dashboard/PowerBIEmbed.test.tsx
import { render } from '@testing-library/react';
import { PowerBIEmbed } from './PowerBIEmbed';
```

#### Utility Files
```typescript
// lib/powerbi-client.ts - Power BI utilities
export const getPowerBIToken = async (userId: string) => { /* ... */ };
export const getEmbedConfig = (reportId: string, token: string) => { /* ... */ };

// lib/hierarchy-service.ts - User hierarchy utilities
export const getUserHierarchy = async (userEmail: string) => { /* ... */ };
export const getDirectReports = async (userId: string) => { /* ... */ };
```

---

## UI/UX Design System

### Color Palette

The HR Dashboard uses a professional, enterprise-grade color system with **exactly 4-5 colors total**.

#### Primary Colors
```css
/* Primary Brand - Professional Blue */
--primary: #0078d4;              /* Microsoft Blue - trust, professionalism */
--primary-hover: #106ebe;
--primary-active: #005a9e;

/* Neutrals - Clean Background */
--background: #ffffff;           /* Pure white */
--surface: #f5f5f5;             /* Light gray for cards */
--surface-hover: #e8e8e8;
--border: #e0e0e0;              /* Subtle borders */

/* Text Hierarchy */
--text-primary: #1a1a1a;        /* Primary text - near black */
--text-secondary: #666666;       /* Secondary text - medium gray */
--text-tertiary: #999999;        /* Tertiary text - light gray */

/* Status Colors (Compliance Indicators) */
--success: #107c10;              /* Green ≥75% compliance */
--warning: #ffb900;              /* Yellow 70-74.9% compliance */
--alert: #f7630c;                /* Orange 65-69.9% compliance */
--danger: #d13438;               /* Red <65% compliance */

/* Interactive States */
--focus-ring: #0078d4;           /* Focus indicator */
--disabled: #a6a6a6;             /* Disabled state */
```

#### Color Usage Rules
```typescript
// ✅ GOOD: Use semantic color variables
<Button className="bg-primary hover:bg-primary-hover text-white">
  View Dashboard
</Button>

// ✅ GOOD: Status-based coloring
const getComplianceColor = (percentage: number) => {
  if (percentage >= 75) return 'text-success';
  if (percentage >= 70) return 'text-warning';
  if (percentage >= 65) return 'text-alert';
  return 'text-danger';
};

// ❌ BAD: Direct color values or too many colors
<Button className="bg-purple-500">Click Me</Button>
```

### Typography

**Font System: Maximum 2 font families**

```css
/* Primary Font - UI and Body Text */
--font-sans: 'Segoe UI', system-ui, -apple-system, sans-serif;

/* Monospace - Data and Code */
--font-mono: 'Consolas', 'Monaco', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px - small labels */
--text-sm: 0.875rem;   /* 14px - body text, secondary */
--text-base: 1rem;     /* 16px - primary body text */
--text-lg: 1.125rem;   /* 18px - subheadings */
--text-xl: 1.25rem;    /* 20px - card titles */
--text-2xl: 1.5rem;    /* 24px - section headers */
--text-3xl: 1.875rem;  /* 30px - page titles */
--text-4xl: 2.25rem;   /* 36px - hero numbers */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

#### Typography Implementation
```typescript
// ✅ GOOD: Use Tailwind typography classes
<h1 className="text-3xl font-semibold text-text-primary">
  HR Leadership Dashboard
</h1>

<p className="text-base leading-relaxed text-text-secondary">
  Monitor compliance across your organization
</p>

// ✅ GOOD: Readable body text
<div className="text-sm leading-relaxed text-text-primary">
  {content}
</div>

// ❌ BAD: Line height too tight
<p className="text-base leading-tight">
  Long paragraph of text that's hard to read...
</p>
```

### Spacing System

```css
/* Consistent 4px/8px spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */

/* Component-Specific Spacing */
--card-padding: var(--space-6);
--section-gap: var(--space-8);
--page-padding: var(--space-8);
```

### Layout Patterns

#### Dashboard Overlay Pattern
```css
/* Full-screen Power BI with collapsible chat overlay */
.dashboardContainer {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.powerbiEmbed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Backdrop when chat is open */
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.backdrop.active {
  opacity: 1;
}

/* Floating chat button */
.chatToggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 10;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.chatToggle:hover {
  background: var(--primary-hover);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

/* Collapsible chat panel */
.chatPanel {
  position: fixed;
  top: 0;
  right: 0;
  width: 35%;
  min-width: 400px;
  max-width: 600px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  z-index: 11;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.chatPanel.open {
  transform: translateX(0);
}

/* Responsive breakpoints */
@media (max-width: 1024px) {
  .chatPanel {
    width: 50%;
    min-width: 320px;
  }
}

@media (max-width: 768px) {
  .chatPanel {
    width: 100%;
    min-width: unset;
  }
}
```

### Component Styling

#### Cards
```typescript
// Card component with consistent styling
export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      "bg-surface rounded-lg border border-border p-6",
      "hover:shadow-md transition-shadow duration-200",
      className
    )}>
      {children}
    </div>
  );
}

// Usage
<Card>
  <h3 className="text-xl font-semibold text-text-primary mb-2">
    Compliance Overview
  </h3>
  <p className="text-sm text-text-secondary">
    Current performance metrics
  </p>
</Card>
```

#### Buttons
```typescript
// Button variants matching design system
const buttonVariants = {
  primary: "bg-primary hover:bg-primary-hover text-white",
  secondary: "bg-surface hover:bg-surface-hover text-text-primary border border-border",
  danger: "bg-danger hover:bg-red-700 text-white",
  ghost: "hover:bg-surface text-text-primary"
};

export function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        buttonVariants[variant]
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## Component Architecture

### Core Dashboard Components

#### 1. DashboardLayout.tsx
```typescript
'use client';
import { useState } from 'react';
import { PowerBIEmbed } from './PowerBIEmbed';
import { CopilotChat } from './CopilotChat';
import { ChatToggle } from './ChatToggle';
import styles from './DashboardLayout.module.css';

export function DashboardLayout({ userId, userEmail, allowedTeams }: DashboardLayoutProps) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className={styles.dashboardContainer}>
      {/* Full-screen Power BI embed */}
      <div className={styles.powerbiEmbed}>
        <PowerBIEmbed
          userId={userId}
          allowedTeams={allowedTeams}
        />
      </div>

      {/* Backdrop overlay when chat is open */}
      <div
        className={cn(styles.backdrop, chatOpen && styles.active)}
        onClick={() => setChatOpen(false)}
      />

      {/* Floating chat toggle button */}
      <ChatToggle
        isOpen={chatOpen}
        onClick={() => setChatOpen(!chatOpen)}
      />

      {/* Collapsible chat panel */}
      <div className={cn(styles.chatPanel, chatOpen && styles.open)}>
        <CopilotChat
          userEmail={userEmail}
          onClose={() => setChatOpen(false)}
        />
      </div>
    </div>
  );
}
```

#### 2. PowerBIEmbed.tsx
```typescript
'use client';
import { useEffect, useRef, useState } from 'react';
import { models, service, factories } from 'powerbi-client';
import { Loader2 } from 'lucide-react';

interface PowerBIEmbedProps {
  userId: string;
  allowedTeams: string[];
}

export function PowerBIEmbed({ userId, allowedTeams }: PowerBIEmbedProps) {
  const embedContainer = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const embedReport = async () => {
      try {
        // Get embed token
        const tokenResponse = await fetch('/api/powerbi/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to get embed token');
        }

        const { token, embedUrl, reportId } = await tokenResponse.json();

        // Configure hierarchical filters
        const hierarchicalFilters: models.IBasicFilter[] = [{
          $schema: "http://powerbi.com/product/schema#basic",
          target: {
            table: "employees",
            column: "employee_id"
          },
          operator: "In",
          values: allowedTeams,
          filterType: models.FilterType.Basic
        }];

        // Embed configuration
        const embedConfig: models.IReportEmbedConfiguration = {
          type: 'report',
          id: reportId,
          embedUrl: embedUrl,
          accessToken: token,
          tokenType: models.TokenType.Aad,
          settings: {
            filterPaneEnabled: false,
            navContentPaneEnabled: false,
            background: models.BackgroundType.Transparent,
            bars: {
              statusBar: { visible: false }
            }
          },
          filters: hierarchicalFilters
        };

        // Embed the report
        const powerbi = new service.Service(
          factories.hpmFactory,
          factories.wpmpFactory,
          factories.routerFactory
        );

        const report = powerbi.embed(
          embedContainer.current!,
          embedConfig
        );

        // Handle loaded event
        report.on('loaded', () => {
          console.log('[Power BI] Report loaded successfully');
          setLoading(false);
        });

        // Handle errors
        report.on('error', (event) => {
          console.error('[Power BI] Error:', event.detail);
          setError('Failed to load dashboard');
          setLoading(false);
        });

      } catch (err) {
        console.error('[Power BI] Embed error:', err);
        setError('Failed to initialize dashboard');
        setLoading(false);
      }
    };

    embedReport();
  }, [userId, allowedTeams]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-danger text-lg font-medium mb-2">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Loading dashboard...</p>
          </div>
        </div>
      )}
      <div ref={embedContainer} className="w-full h-full" />
    </div>
  );
}
```

#### 3. CopilotChat.tsx
```typescript
'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface CopilotChatProps {
  userEmail: string;
  onClose: () => void;
}

export function CopilotChat({ userEmail, onClose }: CopilotChatProps) {
  const chatContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Copilot Studio web chat
    const script = document.createElement('script');
    script.src = 'https://cdn.botframework.com/botframework-webchat/latest/webchat.js';
    script.async = true;

    script.onload = async () => {
      try {
        // Get Direct Line token
        const tokenResponse = await fetch('/api/copilot/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail })
        });

        const { token } = await tokenResponse.json();

        // Initialize web chat
        window.WebChat.renderWebChat(
          {
            directLine: window.WebChat.createDirectLine({ token }),
            userID: userEmail,
            username: userEmail,
            styleOptions: {
              botAvatarInitials: 'AI',
              userAvatarInitials: 'You',
              primaryFont: "'Segoe UI', sans-serif",
              bubbleBackground: '#f5f5f5',
              bubbleFromUserBackground: '#0078d4',
              bubbleFromUserTextColor: '#ffffff'
            }
          },
          chatContainer.current
        );
      } catch (error) {
        console.error('[Copilot] Failed to initialize:', error);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [userEmail]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            HR Compliance Assistant
          </h2>
          <p className="text-sm text-text-secondary">
            Ask questions about your team's compliance
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-surface rounded-md transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      {/* Chat container */}
      <div ref={chatContainer} className="flex-1 overflow-hidden" />

      {/* Suggested prompts (shown on first load) */}
      <div className="p-4 border-t border-border bg-surface">
        <p className="text-xs text-text-secondary mb-2">
          Try asking:
        </p>
        <div className="space-y-2">
          <button className="w-full text-left text-sm text-primary hover:underline">
            What's my team's current compliance?
          </button>
          <button className="w-full text-left text-sm text-primary hover:underline">
            Which countries improved most last month?
          </button>
          <button className="w-full text-left text-sm text-primary hover:underline">
            Are there patterns in Friday compliance?
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### 4. ChatToggle.tsx
```typescript
'use client';
import { MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ChatToggle({ isOpen, onClick }: ChatToggleProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-8 right-8 z-10",
        "w-16 h-16 rounded-full",
        "bg-primary hover:bg-primary-hover",
        "text-white shadow-lg",
        "flex items-center justify-center",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2",
        "hover:scale-105 active:scale-95"
      )}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <MessageSquare className="w-6 h-6" />
      )}
    </button>
  );
}
```

---

## Security Requirements

### Authentication Flow

#### MSAL Configuration
```typescript
// lib/msal-config.ts
import { Configuration, PublicClientApplication } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ['User.Read', 'Directory.Read.All']
};
```

#### Protected Route Pattern
```typescript
// components/auth/ProtectedRoute.tsx
'use client';
import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { instance, accounts } = useMsal();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        if (accounts.length === 0) {
          router.push('/');
          return;
        }

        // Validate security group membership
        const response = await fetch('/api/auth/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: accounts[0].username
          })
        });

        if (!response.ok) {
          throw new Error('Not authorized');
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('[Auth] Validation failed:', error);
        router.push('/');
      } finally {
        setIsValidating(false);
      }
    };

    validateAccess();
  }, [accounts, router]);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Validating access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
```

### Hierarchical Access Control

#### User Hierarchy Service
```typescript
// lib/hierarchy-service.ts
export interface UserHierarchy {
  userId: string;
  userEmail: string;
  managerId: string | null;
  hierarchyLevel: 'VP' | 'Director' | 'Manager';
  directReports: string[];
  allowedTeams: string[];
  region: string;
  country: string;
}

export async function getUserHierarchy(userEmail: string): Promise<UserHierarchy> {
  try {
    const response = await fetch('/api/hierarchy/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user hierarchy');
    }

    return await response.json();
  } catch (error) {
    console.error('[Hierarchy] Error:', error);
    throw error;
  }
}

export function getHierarchicalFilters(allowedTeams: string[]): any[] {
  return [{
    $schema: "http://powerbi.com/product/schema#basic",
    target: {
      table: "employees",
      column: "employee_id"
    },
    operator: "In",
    values: allowedTeams,
    filterType: 1 // Basic filter
  }];
}
```

### Privacy Protection

#### Six-Person Minimum Rule
```typescript
// lib/privacy-rules.ts
export const MINIMUM_TEAM_SIZE = 6;

export function shouldShowData(teamSize: number): boolean {
  return teamSize >= MINIMUM_TEAM_SIZE;
}

export function getPrivacyMessage(teamSize: number): string {
  if (teamSize < MINIMUM_TEAM_SIZE) {
    return `Insufficient data (privacy protection - minimum ${MINIMUM_TEAM_SIZE} team members required)`;
  }
  return '';
}

// Usage in components
export function ComplianceCard({ teamSize, compliance }: ComplianceCardProps) {
  if (!shouldShowData(teamSize)) {
    return (
      <Card>
        <p className="text-text-secondary text-center py-8">
          {getPrivacyMessage(teamSize)}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <ComplianceDisplay compliance={compliance} />
    </Card>
  );
}
```

---

## Integration Guidelines

### Power BI Embed

#### Token Management
```typescript
// app/api/powerbi/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as msal from '@azure/msal-node';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    // Validate user session
    // ... authentication validation ...

    // Get Power BI embed token using service principal
    const tokenResponse = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${process.env.POWERBI_WORKSPACE_ID}/reports/${process.env.POWERBI_REPORT_ID}/GenerateToken`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${servicePrincipalToken}`
        },
        body: JSON.stringify({
          accessLevel: 'View',
          identities: [{
            username: userId,
            roles: ['Manager'],
            datasets: [process.env.POWERBI_DATASET_ID]
          }]
        })
      }
    );

    const tokenData = await tokenResponse.json();

    return NextResponse.json({
      token: tokenData.token,
      embedUrl: tokenData.embedUrl,
      reportId: process.env.POWERBI_REPORT_ID,
      expiresAt: tokenData.expiration
    });

  } catch (error) {
    console.error('[Power BI Token] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate embed token' },
      { status: 500 }
    );
  }
}
```

### Copilot Studio

#### Direct Line Token
```typescript
// app/api/copilot/token/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userEmail } = await request.json();

    // Get Direct Line token from Copilot Studio
    const tokenResponse = await fetch(
      'https://directline.botframework.com/v3/directline/tokens/generate',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.COPILOT_DIRECT_LINE_SECRET}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            id: userEmail,
            name: userEmail
          }
        })
      }
    );

    const tokenData = await tokenResponse.json();

    return NextResponse.json({
      token: tokenData.token,
      conversationId: tokenData.conversationId,
      expiresIn: tokenData.expires_in
    });

  } catch (error) {
    console.error('[Copilot Token] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate chat token' },
      { status: 500 }
    );
  }
}
```

---

## Testing & Quality

### Unit Testing

```typescript
// components/dashboard/PowerBIEmbed.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { PowerBIEmbed } from './PowerBIEmbed';

// Mock Power BI service
jest.mock('powerbi-client', () => ({
  service: {
    Service: jest.fn().mockImplementation(() => ({
      embed: jest.fn().mockReturnValue({
        on: jest.fn()
      })
    }))
  },
  factories: {
    hpmFactory: {},
    wpmpFactory: {},
    routerFactory: {}
  },
  models: {
    TokenType: { Aad: 0 },
    BackgroundType: { Transparent: 0 },
    FilterType: { Basic: 1 }
  }
}));

describe('PowerBIEmbed', () => {
  it('shows loading state initially', () => {
    render(<PowerBIEmbed userId="test-user" allowedTeams={['team1']} />);
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('embeds report with hierarchical filters', async () => {
    // Test implementation
  });

  it('handles errors gracefully', async () => {
    // Test implementation
  });
});
```

### Integration Testing

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('authenticated user can access dashboard', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.click('button:has-text("Sign In")');

    // Fill Azure AD credentials
    // ... authentication flow ...

    // Verify dashboard loads
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="powerbi-embed"]')).toBeVisible();
  });

  test('chat panel opens and closes', async ({ page }) => {
    await page.goto('/dashboard');

    // Open chat
    await page.click('[aria-label="Open chat"]');
    await expect(page.locator('[data-testid="chat-panel"]')).toBeVisible();

    // Close chat
    await page.click('[aria-label="Close chat"]');
    await expect(page.locator('[data-testid="chat-panel"]')).not.toBeVisible();
  });

  test('hierarchical filtering prevents unauthorized access', async ({ page }) => {
    // Test with different user personas
  });
});
```

### Performance Testing

```typescript
// Performance budgets
export const PERFORMANCE_BUDGETS = {
  dashboardLoad: 5000,      // 5 seconds max
  chatResponse: 15000,      // 15 seconds max
  tokenRefresh: 2000,       // 2 seconds max
  componentRender: 100      // 100ms max
};

// Monitor performance
export function measurePerformance(label: string, fn: () => Promise<void>) {
  const start = performance.now();

  return fn().finally(() => {
    const duration = performance.now() - start;
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);

    // Send to analytics if duration exceeds budget
    if (duration > PERFORMANCE_BUDGETS[label]) {
      sendAnalytics('performance_budget_exceeded', {
        label,
        duration,
        budget: PERFORMANCE_BUDGETS[label]
      });
    }
  });
}
```

---

## Common Patterns

### Loading States

```typescript
// Skeleton loader for cards
export function CardSkeleton() {
  return (
    <div className="bg-surface rounded-lg border border-border p-6 animate-pulse">
      <div className="h-6 bg-border rounded w-1/3 mb-4"></div>
      <div className="h-12 bg-border rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-border rounded w-2/3"></div>
    </div>
  );
}

// Loading overlay for full-screen components
export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-text-secondary">{message}</p>
      </div>
    </div>
  );
}
```

### Error Boundaries

```typescript
// components/ErrorBoundary.tsx
'use client';
import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[Error Boundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-danger mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-text-primary mb-2">
              Something went wrong
            </h2>
            <p className="text-text-secondary mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-md font-medium"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Responsive Design

```typescript
// hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Usage
export function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <div className={cn(
      isMobile && 'flex-col',
      isTablet && !isMobile && 'grid grid-cols-2'
    )}>
      {/* Content */}
    </div>
  );
}
```

---

## Key Reminders

### ✅ DO

- **Use TypeScript** for all components and utilities
- **Follow the design system** - 4-5 colors max, 2 fonts max
- **Implement hierarchical access** on all data views
- **Enforce privacy rules** - 6-person minimum, team anonymization
- **Handle errors gracefully** with user-friendly messages
- **Test with multiple personas** (VP, Director, Manager)
- **Optimize performance** - measure against budgets
- **Use semantic HTML** and ARIA labels for accessibility
- **Implement loading states** for all async operations
- **Document complex logic** with clear comments

### ❌ DON'T

- **Don't skip authentication** checks on protected routes
- **Don't expose raw errors** to users
- **Don't use more than 5 colors** in the UI
- **Don't allow access** to peer or superior data
- **Don't fetch in useEffect** - use SWR or Server Components
- **Don't create gradient backgrounds** unless explicitly requested
- **Don't use emojis** as icons
- **Don't mix margin/padding** with gap classes
- **Don't create abstract decorative shapes** as filler
- **Don't skip error boundaries** on major components

---

## Quick Reference

### Environment Variables
```bash
# Azure AD
NEXT_PUBLIC_AZURE_CLIENT_ID=
NEXT_PUBLIC_AZURE_TENANT_ID=
NEXT_PUBLIC_REDIRECT_URI=

# Power BI
POWERBI_WORKSPACE_ID=
POWERBI_REPORT_ID=
POWERBI_DATASET_ID=
POWERBI_SERVICE_PRINCIPAL_ID=
POWERBI_SERVICE_PRINCIPAL_SECRET=

# Copilot Studio
COPILOT_DIRECT_LINE_SECRET=
COPILOT_BOT_ID=

# Databricks
DATABRICKS_WORKSPACE_URL=
DATABRICKS_ACCESS_TOKEN=
```

### Key Commands
```bash
# Development
npm run dev

# Build
npm run build

# Test
npm run test
npm run test:e2e

# Lint
npm run lint

# Type check
npm run type-check
```

### Important Files
- `app/dashboard/page.tsx` - Main dashboard page
- `components/dashboard/DashboardLayout.tsx` - Layout orchestration
- `lib/msal-config.ts` - Authentication configuration
- `lib/hierarchy-service.ts` - Access control logic
- `.env.local` - Environment variables (never commit!)

---

**Document Version:** 1.0
**Last Updated:** January 15, 2026
**Maintained By:** Technical Architecture Team

**For questions or updates, please refer to:**
- [Product Requirements Document](../docs/prd.md)
- [Technical Requirements Document](../docs/plans/2026-01-14-hr-dashboard-poc-trd.md)
