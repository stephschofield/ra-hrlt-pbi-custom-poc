# HR Leadership Team AI Dashboard POC - Technical Requirements Document

**Prepared for:** Rockwell Automation
**Prepared by:** Technical Architecture Team
**Date:** January 14, 2026
**Version:** 1.0
**Status:** POC Design
**Related:** [Product Requirements Document](../prd.md)

---

## Executive Summary

This Technical Requirements Document (TRD) defines the technical architecture for a Proof of Concept (POC) implementation of the HR Leadership Team AI Dashboard. The POC validates the core user experience of combining Power BI analytics with conversational AI assistance in a single, secure web application.

### Architecture Overview

- **Frontend:** Next.js web application with Azure AD authentication
- **Power BI:** Embedded reports with hierarchical access controls
- **AI Assistant:** Copilot Studio agent connected to Power BI Service for data access
- **Data Layer:** Synthetic compliance data in Databricks Unity Catalog, Power BI semantic model providing data access layer
- **Security:** Role-based access enforcing organizational hierarchy

### Key Design Decisions

1. **Overlay UI Pattern:** Full-screen Power BI with collapsible AI chat panel
2. **Unified Data Access:** Both Power BI Embed and Copilot Studio connect through Power BI Service
3. **Unity Catalog Security:** Hierarchical data access enforced at database layer
4. **Synthetic Data Scope:** Leader + Region analysis with 6 months of realistic patterns

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js Web App                          │
│                    (Azure AD Authentication)                    │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐ │
│  │   Power BI Embed    │    │     Copilot Studio Widget       │ │
│  │   (Full Screen)     │    │     (Collapsible Overlay)       │ │
│  └─────────────────────┘    └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
           │                                   │
           │ Azure AD Token                    │ Azure AD Token
           │                                   │
           └───────────────┬───────────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │   Power BI Service       │
              │   (User-Owns-Data)       │
              └──────────────────────────┘
                           │
                           │ Power BI Semantic Model
                           │
                           ▼
              ┌──────────────────────────┐
              │  Databricks Unity        │
              │  Catalog (Data Source    │
              │  for Power BI)           │
              └──────────────────────────┘
```

**Key Data Flow Points:**
- **Next.js App** hosts both Power BI embed and Copilot Studio widget
- **Both components** connect to Power BI Service with Azure AD authentication
- **Power BI Service** → Databricks Unity Catalog (via Power BI semantic model)
- **Copilot Studio** queries data through Power BI Service (not direct to Databricks)
- Hierarchical access enforced via Unity Catalog RLS and Power BI security

### 1.2 Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| **Next.js App** | Authentication, UI orchestration, session management, **role-based view toggle** |
| **Power BI Embed** | Data visualization, basic filtering, hierarchical data access, **dynamic role filtering** |
| **Copilot Studio** | Natural language processing, conversation flows, AI responses via Power BI Service, **role-aware contextual responses** |
| **Power BI Service** | Data access layer, semantic model, security enforcement |
| **Unity Catalog** | Row-level security, organizational hierarchy enforcement |

---

## 2. Frontend Architecture

### 2.1 Next.js Application Structure

```
├── pages/
│   ├── index.tsx                 # Landing page with login
│   ├── hr-dashboard.tsx          # Main POC page (protected route)
│   └── api/
│       └── auth/
│           └── validate.ts       # Security group validation
├── components/
│   ├── PowerBIEmbed.tsx          # Power BI embedding component
│   ├── CopilotChat.tsx           # Copilot Studio widget wrapper
│   ├── LayoutOverlay.tsx         # Overlay UI management
│   └── RoleToggle.tsx            # Role-based view selector (Manager/Director/SVP)
├── lib/
│   ├── msal-config.ts            # Azure AD configuration
│   ├── hierarchy-service.ts      # User hierarchy lookup
│   └── role-filter-service.ts    # Role-based data filtering logic
└── styles/
    └── dashboard.module.css      # Overlay and responsive styles
```

### 2.2 UI Design Specification

**Overlay Pattern:**
- **Full-screen Power BI** embedded iframe (100% width/height)
- **Floating chat button** (bottom-right corner, always visible)
- **Collapsible chat panel** slides from right (35% width when expanded)
- **Backdrop overlay** dims Power BI (opacity: 0.1) when chat active
- **Responsive design** adapts panel size for mobile/tablet

**Role Toggle Component:**
- **Dropdown selector** in header: "View as: Manager | Director | SVP"
- **State management** using React context for role selection
- **Dynamic filtering** triggers Power BI filter update on role change
- **Visual indicator** shows current role with badge/icon
- **Default role** determined by user's actual Azure AD role/group

**Power BI Integration:**
- **User-owns-data** embedding model with Azure AD tokens
- **JavaScript API** for programmatic control (not basic iframe)
- **Basic filtering** exposed in clean top bar (date range, team selector)
- **Hierarchical filtering** applied automatically based on user identity
- **Role-based filtering** adjusts data scope based on demo role selection

**Chat Interface:**
- **Copilot Studio** authenticated web chat widget
- **Suggested prompts** displayed on first load
- **Session persistence** maintains conversation during browser session
- **Loading indicators** show when Genie API is processing queries

---

## 3. Authentication & Authorization

### 3.1 Azure AD Applications

**Application 1: Next.js SPA**
```
App Name: HR-Dashboard-POC-Frontend
App Type: Single Page Application
Redirect URI: https://hr-dashboard-poc.com/auth/callback
Permissions:
- User.Read (Microsoft Graph)
- Directory.Read.All (Microsoft Graph)
```

**Application 2: Copilot Studio Authentication**
```
App Name: HR-Dashboard-POC-Copilot
App Type: Web Application (Confidential Client)
Permissions:
- User.Read (Microsoft Graph)
- Custom Databricks scope (if required)
```

### 3.2 Security Group Configuration

**HR Security Group:** `HR-Dashboard-POC-Users`
- **Members:** Your account + teammate accounts for testing
- **Assignment:** Required for both Azure AD applications
- **Conditional Access:** Optional but recommended for POC demonstration

### 3.3 Hierarchical Access Control

**Implementation:**
```typescript
// User hierarchy lookup with role-based demo toggle
const getUserHierarchy = async (userEmail: string, demoRole?: 'Manager' | 'Director' | 'SVP') => {
  // Query synthetic org data to get user's position
  const userInfo = await databricksQuery(`
    SELECT employee_id, manager_id, region, country, role_level
    FROM employees
    WHERE employee_email = '${userEmail}'
  `);

  // Determine effective role (demo override or actual role)
  const effectiveRole = demoRole || userInfo.role_level;

  // Get allowed data scope based on role
  let dataScope;
  switch (effectiveRole) {
    case 'SVP':
      // SVPs see all organizational data
      dataScope = await getAllOrganizationalData();
      break;
    case 'Director':
      // Directors see department/region level
      dataScope = await getDepartmentData(userInfo.employee_id);
      break;
    case 'Manager':
    default:
      // Managers see only direct reports
      dataScope = await getDirectReports(userInfo.employee_id);
      break;
  }

  return {
    userLevel: userInfo,
    effectiveRole,
    allowedTeams: dataScope.teams,
    allowedRegions: dataScope.regions,
    allowedCountries: dataScope.countries
  };
};
```

**Enforcement Points:**
1. **Power BI filters** applied automatically on dashboard load based on role
2. **Unity Catalog RLS** enforces same hierarchy in Databricks
3. **API validation** ensures all queries respect organizational boundaries
4. **Role toggle** updates filters dynamically without page reload

---

## 4. Power BI Integration

### 4.1 Embedding Configuration

```typescript
const embedConfig: models.IReportEmbedConfiguration = {
  type: 'report',
  id: process.env.POWERBI_REPORT_ID,
  embedUrl: process.env.POWERBI_EMBED_URL,
  accessToken: userAzureAdToken,
  tokenType: models.TokenType.Aad,
  settings: {
    filterPaneEnabled: false,       // Clean UI for POC
    navContentPaneEnabled: false,   // Single page focus
    bars: {
      statusBar: { visible: false }
    }
  },
  filters: getRoleBasedFilters(selectedRole, hierarchicalData)  // Dynamic filters based on role toggle
};

// Role-based filter generation
const getRoleBasedFilters = (role: 'Manager' | 'Director' | 'SVP', data: HierarchyData) => {
  const filters = [];
  
  switch (role) {
    case 'SVP':
      // No filters - SVPs see all data
      break;
    case 'Director':
      // Filter to department/region
      filters.push({
        $schema: "http://powerbi.com/product/schema#basic",
        target: { table: "employees", column: "region" },
        operator: "In",
        values: data.allowedRegions
      });
      break;
    case 'Manager':
    default:
      // Filter to direct reports only
      filters.push({
        $schema: "http://powerbi.com/product/schema#basic",
        target: { table: "employees", column: "manager_id" },
        operator: "In",
        values: [data.userLevel.employee_id]
      });
      break;
  }
  
  return filters;
};
```

### 4.2 Hierarchical Filtering

**Filter Application:**
- **Automatic on load** based on authenticated user
- **Team-level filtering** shows only direct reports
- **Region/country filters** applied when appropriate
- **No manual override** - users cannot see peer or superior data

**Basic Interactive Filters:**
- **Date range picker:** Last 30/60/90 days
- **Team selector:** Dropdown limited to user's direct reports
- **Reset button:** Returns to default view (still hierarchically filtered)

---

## 5. Copilot Studio Integration

### 5.1 Agent Configuration

**Authentication Method:** Azure AD (not anonymous iframe)
**Data Connection:** Power BI Service (via Power BI semantic model)
**Conversation Scope:** HR compliance analysis only

### 5.2 Priority Conversation Flows

**Role-Aware AI Responses:**
The AI assistant adapts its responses based on the selected demo role, providing insights appropriate to each level.

**1. Trend Analysis:**
- "Which countries show most improvement or decline month-over-month?"
- **SVP response:** Complete organizational view with strategic recommendations
- **Director response:** Department/region focused with tactical actions
- **Manager response:** Team-specific trends with operational guidance

**2. Pattern Recognition:**
- "Are there regional patterns in non-compliance?"
- **SVP response:** Cross-regional patterns, organizational initiatives needed
- **Director response:** Regional/departmental patterns, resource allocation suggestions
- **Manager response:** Team-level patterns, immediate coaching opportunities

**3. Benchmark Comparison:**
- "How does regional compliance compare to global benchmarks?"
- **SVP response:** Full organizational benchmarking, competitive positioning
- **Director response:** Department vs peer departments, improvement targets
- **Manager response:** Team vs department average, specific action items

**4. Location Analysis:**
- "Are there specific locations with recurring compliance issues?"
- **SVP response:** All locations ranked, strategic facility decisions
- **Director response:** Locations within scope, tactical interventions
- **Manager response:** Team's primary location, day-to-day adjustments

### 5.3 Copilot Studio Setup

```yaml
Agent Configuration:
  Name: "HR Compliance Assistant"
  Description: "AI assistant for analyzing workforce compliance data with role-aware insights"
  Authentication: Azure AD
  Data Sources:
    - Power BI Service (via semantic model)
  Role Context:
    - Current demo role (Manager/Director/SVP)
    - User's actual organizational level
    - Allowed data scope based on role
  Conversation Topics:
    - Compliance trends (role-appropriate scope)
    - Regional analysis (filtered by role access)
    - Performance benchmarking (peer-level comparisons)
    - Location-specific insights (within role purview)
  Response Adaptation:
    - Strategic language for SVP queries
    - Tactical language for Director queries  
    - Operational language for Manager queries
```

---

## 6. Data Architecture

### 6.1 Synthetic Data Schema

**Table 1: employees**
```sql
CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  manager_id INT,
  employee_email VARCHAR(100),  -- Maps to Azure AD
  employee_name VARCHAR(100),
  manager_name VARCHAR(100),
  role_level VARCHAR(20),       -- Manager, Director, SVP (for demo toggle)
  region VARCHAR(50),           -- North America, EMEA, APAC
  country VARCHAR(50),          -- USA, Canada, UK, Germany, Singapore
  location VARCHAR(50),         -- Austin, Milwaukee, London, Munich
  department VARCHAR(50),       -- Engineering, Sales, Operations
  hire_date DATE,
  status VARCHAR(20)            -- Active, Inactive
);
```

**Table 2: badge_events**
```sql
CREATE TABLE badge_events (
  event_id BIGINT PRIMARY KEY,
  employee_id INT,
  badge_swipe_date DATE,
  location VARCHAR(50),
  region VARCHAR(50),
  country VARCHAR(50),
  is_workday BOOLEAN,
  is_pto BOOLEAN,
  is_holiday BOOLEAN,
  swipe_count INT
);
```

**Table 3: global_benchmarks**
```sql
CREATE TABLE global_benchmarks (
  benchmark_id INT PRIMARY KEY,
  region VARCHAR(50),
  country VARCHAR(50),
  benchmark_compliance_pct DECIMAL(5,2),
  global_average_pct DECIMAL(5,2),
  calculation_date DATE,
  peer_group VARCHAR(50)
);
```

### 6.2 Realistic Data Patterns

**Organizational Hierarchy:**
- **150-200 employees** across 3 regions
- **3-4 management levels** with proper reporting structure
- **6+ people per team** (ensures privacy compliance)
- **Test accounts** mapped to your Azure AD security group

**Compliance Patterns:**
- **Regional variance:** North America (75%), EMEA (68%), APAC (72%)
- **Day-of-week patterns:** Friday dips (55-60%), Monday high (80%+)
- **Location performance:** Austin (82%), London (64%), Munich (71%)
- **Monthly trends:** Singapore improving (+3%), London declining (-2%)

**Data Volume:**
- **6 months** of historical data (July 2025 - December 2025)
- **~18,000 badge events** (150 employees × 22 workdays × 6 months × 70% avg compliance)
- **Holidays included:** US, UK, German, Singaporean national holidays

### 6.3 Unity Catalog Security

**Row-Level Security Implementation:**
```sql
-- Example RLS function
CREATE FUNCTION get_user_teams(user_email STRING)
RETURNS ARRAY<STRING>
RETURN (
  SELECT collect_list(CAST(employee_id AS STRING))
  FROM employees
  WHERE manager_email = user_email
    OR employee_email = user_email
);

-- Apply to badge_events table
ALTER TABLE badge_events
SET ROW FILTER get_user_teams(current_user()) ON (employee_id);
```

---

## 7. Implementation Plan

### 7.1 Development Phases

**Phase 1: Foundation (Week 1)**
- Azure AD app registrations and security group setup
- Next.js application scaffolding with MSAL integration
- Basic authentication flow and protected routing

**Phase 2: Data Layer (Week 1-2)**
- Databricks workspace setup and Unity Catalog configuration
- Synthetic data generation script development
- Data validation and RLS testing

**Phase 3: Power BI Integration (Week 2)**
- Power BI report development with synthetic data
- Embedding implementation with hierarchical filtering
- Basic filter controls (date range, team selector)

**Phase 4: Copilot Integration (Week 2-3)**
- Copilot Studio agent creation and configuration
- Databricks Genie workspace setup and testing
- Conversation flow development and testing

**Phase 5: UI Polish & Testing (Week 3-4)**
- Overlay UI implementation and responsive design
- End-to-end testing with multiple user personas
- Performance optimization and bug fixes

**Phase 6: Demo Preparation (Week 4)**
- Demo script development and rehearsal
- Stakeholder training and feedback collection
- Final adjustments based on user testing

### 7.2 Success Criteria

**Technical Validation:**
- [ ] Authentication works for all security group members
- [ ] Hierarchical filtering prevents unauthorized data access
- [ ] Role toggle switches between Manager/Director/SVP views smoothly
- [ ] Data filtering adjusts correctly for each role level
- [ ] AI responses adapt contextually to selected role
- [ ] Power BI reports load within 5 seconds
- [ ] Copilot responds to priority questions within 15 seconds
- [ ] Overlay UI works on desktop, tablet, and mobile

**Business Validation:**
- [ ] Customer can see realistic compliance dashboard
- [ ] AI provides actionable insights on compliance patterns
- [ ] Security model demonstrates enterprise-grade controls
- [ ] User experience showcases production potential
- [ ] Stakeholders approve production investment

---

## 8. Technical Constraints & Limitations

### 8.1 POC Limitations

**Out of Scope for POC:**
- Integration with live RokFusion data
- Advanced security controls beyond basic Azure AD
- Export functionality (PDF/CSV reports)
- Multi-language support
- Advanced Power BI features (bookmarks, drill-through)
- Automated alerting or notifications

**Technical Constraints:**
- **Databricks Genie API:** ~5 questions per minute rate limit
- **Synthetic data:** 6 months maximum historical range
- **Power BI:** Single report page for POC
- **Copilot Studio:** Basic conversation flows only

### 8.2 Known Issues & Mitigations

**Issue 1: Genie API Rate Limiting**
- **Mitigation:** Client-side throttling, conversation caching, user education

**Issue 2: Power BI Token Expiration**
- **Mitigation:** Automatic token refresh, graceful degradation UI

**Issue 3: Synthetic Data Realism**
- **Mitigation:** Base patterns on actual anonymized distributions

---

## 9. Security Considerations

### 9.1 Data Protection

**Privacy Controls:**
- **Six-person minimum rule** enforced at Unity Catalog level
- **Team anonymization** in dashboard displays
- **No individual identification** in AI responses
- **Audit logging** for all data access (built into Databricks)

**Access Controls:**
- **Azure AD B2C** single sign-on authentication
- **Security group membership** required for application access
- **Hierarchical filtering** prevents lateral data access
- **Session timeout** (8 hours) with automatic logout

### 9.2 Compliance

**Data Governance:**
- **Synthetic data only** - no real employee information
- **GDPR considerations** addressed through data anonymization
- **SOX compliance** through proper access controls and audit trails
- **Corporate security** aligned with Rockwell Automation standards

---

## 10. Future Work & Production Considerations

### 10.1 Production Enhancements

**Data Integration:**
- Replace synthetic data with live RokFusion integration
- Implement real-time data refresh and streaming updates
- Add data quality monitoring and validation

**Advanced Features:**
- Multi-page Power BI reports with drill-through capabilities
- Report sync with chat (highlight data mentioned by AI)
- Automated alerting for compliance threshold breaches
- Advanced analytics (predictive modeling, what-if scenarios)

**Security & Governance:**
- Enterprise data governance platform integration
- Advanced audit logging and compliance reporting
- Multi-factor authentication and conditional access policies
- Data loss prevention (DLP) and information protection

### 10.2 Scalability Planning

**Performance Optimization:**
- CDN implementation for global report delivery
- Power BI Premium capacity for large user base
- Databricks serverless for elastic query processing
- Application performance monitoring and optimization

**User Experience:**
- Mobile-first responsive design
- Progressive web app (PWA) capabilities
- Multi-language support and localization
- Advanced accessibility features (WCAG 2.1 AAA)

---

## Appendices

### Appendix A: Environment Configuration

**Development Environment:**
```bash
# Environment variables
AZURE_CLIENT_ID=<next-js-spa-client-id>
AZURE_TENANT_ID=<your-tenant-id>
POWERBI_REPORT_ID=<report-id>
POWERBI_EMBED_URL=<embed-url>
DATABRICKS_WORKSPACE_URL=<workspace-url>
COPILOT_STUDIO_BOT_ID=<bot-id>
```

### Appendix B: API Endpoints

**Next.js API Routes:**
- `GET /api/auth/validate` - Validate security group membership
- `GET /api/hierarchy/teams` - Get user's allowed teams
- `POST /api/powerbi/token` - Refresh Power BI embed token

### Appendix C: Testing Scenarios

**User Personas for Testing:**
1. **Regional VP** - Can see all teams in their region
2. **Country Director** - Can see country-level teams only
3. **Location Manager** - Can see direct reports only
4. **Individual Contributor** - No dashboard access (should be blocked)

**Test Questions for Copilot:**
1. "What's our current compliance percentage?"
2. "Which country improved the most last month?"
3. "Are there patterns in Friday compliance?"
4. "How do we compare to the 70% benchmark?"
5. "Show me individual employee data" (should be declined)

**Role Toggle Demo Scenarios:**
1. **Manager View:**
   - Shows: Direct reports only (Team A, B, C)
   - AI answers: "Your team's compliance is 72.3%"
   - Data scope: 20-30 employees

2. **Director View:**
   - Shows: All teams in department (5-7 teams)
   - AI answers: "Your department's compliance is 74.1% across 6 teams"
   - Data scope: 80-100 employees

3. **SVP View:**
   - Shows: Full organization (all regions)
   - AI answers: "Organizational compliance is 71.8% across North America (75%), EMEA (68%), APAC (72%)"
   - Data scope: 150-200 employees

**Toggle Test Cases:**
- Switch from Manager → Director (filter updates within 3 seconds)
- Switch from Director → SVP (shows additional regions)
- Switch from SVP → Manager (restricts data appropriately)
- Verify privacy rules enforced at all role levels

---

**Document Prepared By:** Technical Architecture Team
**Review Date:** January 14, 2026
**Next Review:** After POC completion
**Approval Required:** Technical Lead, Product Manager, Security Team