# HR Leadership Team AI Dashboard
## Product Requirements Document - POC Phase

**Prepared for:** Rockwell Automation  
**Prepared by:** Stephanie Schofield, Technical Product Manager  
**Date:** December 1, 2025  
**Version:** 1.0  
**Status:** Draft for Review  
**Project Code:** RA-HRLT-2025

---

## Executive Summary

The HR Leadership Team (HR LT) AI Dashboard project delivers an intelligent analytics solution that enables people managers at Rockwell Automation to monitor and improve in-office compliance with the company's Return-to-Office (RTO) policy. This document defines requirements for a Proof of Concept (POC) implementation.

### Business Context

Rockwell Automation has established a 70% in-office attendance threshold for employees. Managers currently lack visibility into team compliance patterns, making it difficult to identify trends, coach underperforming teams, and ensure policy adherence while maintaining employee privacy and data security.

### Solution Approach

This project delivers a Proof of Concept using synthetic data and Microsoft Copilot Studio to validate the AI assistant concept, user experience, and core calculation logic before proceeding to full production implementation.

### Key Differentiators

- **Privacy-First Design:** Six-person minimum rule prevents individual identification while maintaining analytical value
- **AI-Powered Insights:** Natural language interface provides actionable recommendations, not just raw data
- **Hierarchical Access Control:** Managers see only their team's data, ensuring organizational boundaries
- **Actionable Intelligence:** System identifies problems, suggests interventions, and tracks improvement

### Expected Outcomes

**POC Phase (4-6 weeks):**
- Validate AI assistant usability with 10-15 manager users
- Confirm compliance calculation accuracy against business rules
- Demonstrate value proposition for production investment
- Gather user feedback for production feature prioritization

---

## 1. Overview

### 1.1 Purpose

The POC phase validates the core value proposition of an AI-powered compliance dashboard for HR leadership. Using synthetic data and Microsoft Copilot Studio, this phase tests:

- Manager interaction patterns with conversational AI
- Accuracy of compliance calculation logic
- Effectiveness of privacy protection mechanisms
- User experience and feature desirability

### 1.2 Scope

**In Scope:**
- Copilot Studio agent with pre-configured conversation flows
- Single synthetic CSV data source with 100-200 employee records
- Basic compliance calculations (badge swipes ÷ eligible days)
- Simple visual dashboard showing team-level metrics
- 10-15 pilot users (selected managers)
- 4-6 week timeline

**Out of Scope:**
- Integration with live RokFusion data
- Advanced security controls (beyond basic Azure AD authentication)
- Export functionality (PDF/CSV)
- Historical trending beyond 3 months
- Multi-language support
- Mobile optimization

### 1.3 Success Criteria for POC

The POC will be deemed successful if:

1. 80% of pilot users rate the AI assistant as "useful" or "very useful"
2. Compliance calculations match manual validation within ±0.5%
3. Privacy rules prevent any individual identification in test scenarios
4. Stakeholders approve production investment based on POC results
5. At least 5 actionable improvements identified for production phase

---

## 2. Goals and Objectives

### 2.1 Primary Goals

**Goal 1: Validate AI Assistant Concept**  
Demonstrate that managers can successfully interact with a conversational AI to understand team compliance without requiring training on dashboard navigation or query syntax.

**Goal 2: Prove Calculation Accuracy**  
Verify that the compliance calculation engine correctly implements business rules including badge swipe counting, workday exclusions (weekends, holidays, PTO), and threshold determination.

**Goal 3: Test Privacy Mechanisms**  
Confirm that the six-person minimum rule and team name anonymization effectively protect individual privacy while preserving analytical utility.

### 2.2 Secondary Objectives

- Gather user feedback on desired features for production release
- Identify technical constraints or limitations in Copilot Studio platform
- Estimate resource requirements for full production build
- Build stakeholder confidence for production budget approval

### 2.3 Non-Goals for POC

- Integration with enterprise data governance platforms
- Support for complex what-if scenario modeling
- Automated alerting or notification systems
- Benchmarking against external industry standards

---

## 3. Target Audience

### 3.1 Primary Users - People Managers

**Role:** Front-line managers with 6+ direct reports

**Use Cases:**
- Weekly compliance monitoring
- Identifying teams or patterns requiring intervention
- Preparing for coaching conversations with underperforming team leads

**Technical Proficiency:** Moderate - comfortable with Microsoft Teams, email, and basic web applications

**Frequency:** 1-2 times per week (typically Monday mornings)

### 3.2 Secondary Users - Senior Leaders

**Role:** Directors and VPs overseeing multiple manager teams

**Use Cases:**
- Organizational-level compliance trending
- Identifying systemic issues across departments
- Setting organizational goals and expectations

### 3.3 POC Pilot Group Selection

For the POC, select 10-15 managers with these characteristics:

- Mix of high-performing and low-performing teams (based on current compliance)
- Representation from at least 3 different business units
- At least 2 senior leaders (Director+)
- Known "early adopters" comfortable providing candid feedback
- Team sizes ranging from 6-30 employees

---

## 4. Key Features

### 4.1 Conversational AI Assistant

**Capability:** Natural language query interface powered by Copilot Studio

**Sample Interactions:**
- "What's my team's current compliance?"
- "Show me trends over the last 3 months"
- "Which day of the week is our lowest?"
- "Give me suggestions to improve"

**Response Format:** Text with embedded data points, 2-3 actionable recommendations when compliance <70%

### 4.2 Team Compliance Dashboard

**Components:**
- Overall team compliance % with color coding (Green ≥75%, Yellow 70-74.9%, Orange 65-69.9%, Red <65%)
- 3-month trend line chart with 70% threshold reference line
- Sub-team breakdown bar chart (anonymized as Team A, B, C, etc.)
- Day-of-week heatmap showing average compliance by weekday

**Update Frequency:** Weekly refresh (simulated Sunday 2:00 AM ET)

### 4.3 Privacy Protection Layer

**Six-Person Minimum Rule:**  
Teams with ≤5 members display "Insufficient data (privacy protection)" with no numerical data

**Team Name Anonymization:**  
All team identifiers shown as "Team A", "Team B", etc. (sorted by compliance, highest = Team A)

**Individual Protection:**  
AI assistant will not answer questions about specific individuals by name

### 4.4 Basic Calculation Engine

**Formula:** Compliance % = (Badge Swipe Days / Eligible Work Days) × 100%

**Badge Swipe Rules:**
- Any swipe on a date = full day present
- Multiple swipes = 1 day (no duplicates)

**Eligible Days Exclusions:**
- Weekends (all Saturdays and Sundays)
- US federal holidays (10 company-observed)
- Approved PTO days (from synthetic dataset)

### 4.5 Role-Based View Toggle (Demo Feature)

**Capability:** Toggle control to switch between different role views for demonstration purposes

**Role Hierarchy (Highest to Lowest Access):**
1. **SVP (Senior Vice President)** - Full organizational access
   - View all regions, countries, and locations
   - Access to global benchmarks and cross-organizational comparisons
   - Complete leadership hierarchy visibility
   - Strategic-level aggregated insights

2. **Director** - Multi-team/departmental access
   - View all teams within their department or region
   - Access to country and location-level data within scope
   - Leadership team performance comparisons
   - Tactical-level insights

3. **Manager** - Team-level access
   - View only direct reports and immediate sub-teams
   - Location-specific data for their team
   - Day-to-day operational insights
   - Individual team performance metrics

**Demo Toggle Behavior:**
- **Dropdown selector** in dashboard header: "View as: SVP | Director | Manager"
- **Data filtering** adjusts automatically based on selected role
- **AI assistant context** adapts responses to role-appropriate insights
- **Visual emphasis** on role-specific KPIs and recommendations
- **Privacy rules** still enforced at all role levels (6-person minimum)

**Use Case:** Enables single demo to showcase different stakeholder experiences without switching users or browsers

---

## 5. AI Query Categories

The AI assistant must be capable of answering specific analytical questions across four key dimensions: Leader, Region, Country, and Location. These represent the core insights managers need for compliance monitoring and improvement.

### 5.1 Leader-Level Compliance Questions

**Core Questions:**
- What is the current in-office compliance for each leader's team?
- Which leaders have the highest and lowest compliance this month?
- Are there any leaders whose teams consistently fall below the expected in-office threshold of 70%?
- How does compliance vary across direct reports of each leader?

**Implementation Notes:**
- Queries must respect hierarchical access (manager can only see their downward org tree)
- Privacy protection applies (6-person minimum rule)
- Team anonymization required ("Team A, B, C" vs. real names)

### 5.2 Region-Level Compliance Questions

**Core Questions:**
- What is the average in-office compliance by region?
- Which regions are trending upward or downward in compliance over the past quarter?
- Are there regional patterns in non-compliance (e.g., specific days or weeks, hybrid vs on-site employees)?
- How does regional compliance compare to global benchmarks?

**Implementation Notes:**
- Requires aggregation across multiple office locations within regions
- Trend analysis needs 3-month historical data minimum
- Pattern detection for day-of-week, week-of-month variations

### 5.3 Country-Level Compliance Questions

**Core Questions:**
- What is the in-office compliance by country?
- Are there country-specific holidays affecting compliance?
- Which countries show the most improvement or decline in compliance month-over-month?

**Implementation Notes:**
- Holiday calendar integration required for accurate compliance calculation
- Country grouping may span multiple regions/locations
- Excludes US federal holidays from eligible days calculation

### 5.4 Location-Level Compliance Questions

**Core Questions:**
- What is the daily/weekly in-office compliance at each office location?
- Which locations are consistently underutilized or over capacity?
- Are there specific locations with recurring compliance issues?

**Implementation Notes:**
- Office capacity data may need external integration (real estate systems)
- Daily granularity requires more detailed badge swipe analysis
- Location-specific patterns may indicate infrastructure or policy issues

### 5.5 Data Requirements for AI Queries

| Query Type | Required Data Fields | Data Source |
|---|---|---|
| Leader-Level | manager_key, employee_key, badge_swipe_date, org_hierarchy | Employee data + Badge data |
| Region-Level | location, region_mapping, badge_swipe_date | Location master + Badge data |
| Country-Level | location, country_mapping, holiday_calendar, badge_swipe_date | Location master + Badge data + Holiday data |
| Location-Level | location, office_capacity, badge_swipe_date | Location master + Badge data + Real estate data |

---

## 6. Functional Requirements

| ID | Requirement | Description | Priority |
|---|---|---|---|
| FR-1 | User Authentication | System authenticates users via Azure AD B2C with valid Rockwell credentials | P0 |
| FR-2 | Data Access Control | Users can only view data for their team and subordinate teams (hierarchical filtering) | P0 |
| FR-3 | Compliance Calculation | System calculates compliance per Rule 1.2 (badge swipes ÷ eligible days) | P0 |
| FR-4 | Privacy Enforcement | System enforces 6-person minimum rule across all views and queries | P0 |
| FR-5 | Team Anonymization | System displays teams as "Team A, B, C" sorted by compliance (high to low) | P0 |
| FR-6 | AI Query Handling | Copilot Studio agent responds to natural language queries with contextual data | P0 |
| FR-7 | Dashboard Rendering | System displays 4 core visuals: KPI card, trend chart, team bars, day heatmap | P0 |
| FR-8 | Threshold Color Coding | System applies color rules: Green (≥75%), Yellow (70-74.9%), Orange (65-69.9%), Red (<65%) | P0 |
| FR-9 | AI Recommendations | AI provides 2-3 actionable suggestions when user's compliance <70% | P1 |
| FR-10 | Historical Data | System displays 3 months of historical trend data | P1 |
| FR-11 | Data Refresh Indicator | UI shows "Last updated: [date]" timestamp | P2 |
| FR-12 | Help Documentation | In-app help explains calculation methodology and privacy rules | P2 |
| FR-13 | Leader-Level Queries | AI handles team-specific questions: current compliance per leader, highest/lowest compliance leaders, leaders below 70% threshold, direct report compliance variance | P1 |
| FR-14 | Region-Level Queries | AI provides regional analytics: average compliance by region, regional trends over quarters, regional non-compliance patterns, regional vs global benchmark comparisons | P1 |
| FR-15 | Country-Level Queries | AI supports country-specific analysis: compliance by country, holiday impact analysis, month-over-month country improvements/declines | P1 |
| FR-16 | Location-Level Queries | AI answers location questions: daily/weekly compliance per office, location utilization patterns, recurring compliance issues by location | P2 |
| FR-17 | Role-Based View Toggle | System provides dropdown toggle to switch between Manager, Director, and SVP views for demo purposes | P0 |
| FR-18 | Dynamic Data Filtering | System automatically adjusts data access and AI context based on selected demo role | P0 |
| FR-19 | Role-Appropriate Insights | AI assistant provides recommendations and insights appropriate to the selected role level | P1 |

**Priority Legend:** P0 = Must Have (POC Blocker) | P1 = Should Have | P2 = Nice to Have

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | POC Target | Measurement Method |
|---|---|---|
| Dashboard Load Time | < 5 seconds | Browser DevTools Network tab |
| AI Response Time | < 15 seconds | Application Insights timing |
| Concurrent Users | 20 users | Load testing tool |

### 6.2 Reliability

- **Uptime:** 95% during business hours (M-F, 7 AM - 6 PM ET)
- **Data accuracy:** ±0.5% vs. manual calculation validation
- **Error handling:** Graceful degradation with user-friendly error messages

### 6.3 Security

- **Authentication:** Azure AD B2C single sign-on
- **Authorization:** Role-based access at org hierarchy level
- **Data at rest:** Synthetic data stored in Azure SQL with encryption
- **Data in transit:** HTTPS/TLS 1.2+ for all communications
- **Session timeout:** 8 hours

### 6.4 Usability

- Zero training requirement for basic AI queries
- Mobile responsive (basic support for tablet/phone viewing)
- Accessibility: WCAG 2.1 AA compliance for dashboard (not AI chat)
- Browser support: Latest 2 versions of Chrome, Edge, Safari

### 6.5 Maintainability

- Code documentation: Inline comments for all business logic
- Configuration management: Environment variables for all settings
- Logging: Application Insights for errors and performance

---

## 7. User Stories

### US-1: Check Team Compliance

**As a** people manager, **I want to** view my team's current compliance percentage **so that** I can quickly determine if we're meeting the 70% threshold.

**Acceptance Criteria:**
- Compliance % displays with 1 decimal place (e.g., 72.3%)
- Color coding matches threshold (Green, Yellow, Orange, or Red)
- "Last updated" date is visible
- Response time < 5 seconds

### US-2: Ask AI for Insights

**As a** people manager, **I want to** ask the AI "Why is my compliance dropping?" **so that** I can understand root causes without analyzing raw data.

**Acceptance Criteria:**
- AI responds within 15 seconds
- Response includes specific data points (e.g., "Friday compliance dropped from 58% to 48%")
- AI suggests 2-3 potential causes
- Language is non-technical and actionable

### US-3: View Team Breakdown

**As a** senior leader, **I want to** see compliance for each of my sub-teams **so that** I can identify which teams need manager coaching.

**Acceptance Criteria:**
- Teams displayed as "Team A, B, C..." (anonymized)
- Teams sorted from highest to lowest compliance
- Color bars match threshold colors
- Teams with <6 people show "Insufficient data" message

### US-4: Get Improvement Suggestions

**As a** manager with low compliance, **I want to** receive AI recommendations on how to improve **so that** I have concrete actions to take this week.

**Acceptance Criteria:**
- Recommendations appear automatically when compliance <70%
- Suggestions are specific (e.g., "Schedule team events on Fridays")
- Prioritized as "Immediate" vs. "Short-term"
- Include expected impact estimates

### US-5: Understand Calculation

**As a** people manager, **I want to** understand how compliance is calculated **so that** I can confidently explain it to my team.

**Acceptance Criteria:**
- Help documentation accessible from dashboard
- Explains numerator (badge swipes) and denominator (eligible days)
- Lists what's excluded (weekends, holidays, PTO)
- Includes example calculation

### US-6: Identify Weekly Patterns

**As a** people manager, **I want to** see which day of the week has lowest compliance **so that** I can schedule in-person team activities strategically.

**Acceptance Criteria:**
- Day-of-week view shows Mon-Fri average compliance
- Visual highlights the lowest day (e.g., darker color)
- AI can answer "What day is our lowest?" query
- Data shows average across the 3-month period

### US-7: Privacy Protection Verification

**As a** people manager, **I want to** be unable to see individual employee compliance **so that** I can trust the system protects privacy.

**Acceptance Criteria:**
- AI declines requests like "Show me John Smith's compliance"
- Small teams (≤5) display privacy message
- No drill-down to individual level available
- Decline message is respectful and explains policy

### US-8: Role-Based Demo Toggle

**As a** solution demonstrator, **I want to** toggle between Manager, Director, and SVP views **so that** I can show different stakeholder perspectives in a single demo session.

**Acceptance Criteria:**
- Toggle dropdown clearly visible in dashboard header
- Role selection updates data filtering within 3 seconds
- AI assistant context adapts to selected role
- SVP view shows highest level of aggregated data
- Manager view shows most granular team-level data
- Director view shows intermediate departmental data
- Privacy rules enforced consistently across all role views

---

## 8. User Flows

### 8.1 Primary Flow: Weekly Compliance Check

| Step | Action |
|---|---|
| 1. Entry | Manager navigates to dashboard URL (bookmark or Teams link) |
| 2. Authentication | Azure AD B2C authentication (SSO, no manual login if recent session) |
| 3. Dashboard Load | System displays compliance KPI, trend chart, team breakdown, day heatmap |
| 4. Initial Review | Manager scans KPI card: sees 68.5% (Orange - At Risk) |
| 5. AI Query | Manager types in chat: "Why are we below 70%?" |
| 6. AI Analysis | AI responds: "Your Friday compliance is 48%, Team C is at 52%" |
| 7. Follow-up Query | Manager asks: "What should I do about Team C?" |
| 8. AI Recommendation | AI suggests: "Schedule 1-on-1 with Team C lead, review barriers" |
| 9. Action | Manager screenshots recommendation, schedules meeting with Team C lead |
| 10. Exit | Manager closes dashboard (implicit save of interaction) |

### 8.2 Alternative Flow: Privacy Protection Trigger

| Step | Action |
|---|---|
| 1. Entry | Manager accesses dashboard |
| 2. Team View | Manager has a team with 4 direct reports |
| 3. Privacy Trigger | System detects team size < 6 |
| 4. Masked Display | Dashboard shows: "Insufficient data (privacy protection)" |
| 5. AI Query Attempt | Manager asks AI: "What's my team's compliance?" |
| 6. AI Decline | AI responds: "I can only show data for teams with 6+ members (privacy protection)" |
| 7. Manager Understanding | Manager acknowledges privacy policy |
| 8. Exit | Manager closes dashboard |

### 8.3 Error Flow: Invalid Query

| Step | Action |
|---|---|
| 1. AI Query | Manager asks: "Who has the worst attendance?" |
| 2. Intent Detection | AI detects request for individual identification |
| 3. Graceful Decline | AI responds: "I cannot identify individual employees. I can show team-level data." |
| 4. Redirect | AI suggests: "Try asking: 'Which team is lowest?'" |
| 5. Corrected Query | Manager asks: "Which team is lowest?" |
| 6. Valid Response | AI responds: "Team C is at 52.1% compliance" |

---

## 9. User Interface Design

### 9.1 Dashboard Layout

The POC dashboard follows a simple 2-column layout optimized for desktop viewing:

| Component | Contents |
|---|---|
| Header Bar | Logo, **Role Toggle Dropdown (View as: Manager/Director/SVP)**, user name, "Last Updated: [date]", Help icon |
| Left Panel (60%) | Compliance KPI Card, 3-Month Trend Chart, Team Breakdown Bar Chart |
| Right Panel (40%) | Copilot Studio chat interface, Day-of-Week Heatmap |
| Footer | Privacy notice, Feedback link |

### 9.2 Visual Components Specification

**KPI Card:**
- Large centered number: "68.5%"
- Status label: "At Risk" with orange background
- Sub-text: "4.7 points below company average"

**Trend Chart:**
- X-axis: Month names (Sep, Oct, Nov)
- Y-axis: Compliance % (0-100)
- Horizontal dashed line at 70% (threshold)
- Line color follows current status color

**Team Breakdown:**
- Horizontal bars sorted low to high
- Y-axis labels: "Team A", "Team B", "Team C", "Team D"
- Bar colors: Red (<65%), Orange (65-69.9%), Yellow (70-74.9%), Green (≥75%)
- Value labels at end of each bar: "52.1%"

**Day Heatmap:**
- 5-day grid: Mon, Tue, Wed, Thu, Fri
- Cell color intensity = compliance level (darker = lower)
- Percentage displayed in each cell

### 9.3 Color Palette

| Status | Hex Code | Usage |
|---|---|---|
| Green (Exceeding) | #28a745 | Compliance ≥75% |
| Yellow (Meeting) | #ffc107 | Compliance 70-74.9% |
| Orange (At Risk) | #fd7e14 | Compliance 65-69.9% |
| Red (Non-Compliant) | #dc3545 | Compliance <65% |
| Gray (N/A) | #6c757d | Privacy protected / No data |
| Blue (Accent) | #007bff | Interactive elements, links |

### 9.4 Copilot Studio Chat Interface

- Standard Microsoft Copilot Studio embedded chat widget
- Suggested prompts displayed on first load:
  - "What's my team's compliance?"
  - "Show me trends"
  - "Give me suggestions"
- Chat history persists within session (cleared on logout)
- Typing indicator shows AI is processing

---

## 10. Acceptance Criteria

### 10.1 POC Completion Criteria

The POC is considered complete when all of the following are verified:

| ID | Acceptance Criterion |
|---|---|
| AC-1: Authentication | All pilot users can log in via Azure AD with zero failures over 3-day test period |
| AC-2: Data Accuracy | 100% of compliance calculations match manual validation spreadsheet (±0.5% tolerance) |
| AC-3: Privacy Enforcement | 10/10 test cases confirm 6-person rule blocks data display for small teams |
| AC-4: Team Anonymization | Zero real team names displayed across all dashboard views and AI responses |
| AC-5: AI Response Quality | 8/10 pilot users rate AI answers as "helpful" or better in exit survey |
| AC-6: AI Response Time | 95% of AI queries respond within 15 seconds under load test (10 concurrent users) |
| AC-7: Dashboard Load Time | Dashboard renders completely within 5 seconds on standard corporate network |
| AC-8: Visual Accuracy | All 4 dashboard components (KPI, trend, team bars, day heatmap) render correctly |
| AC-9: Color Coding | Threshold colors applied correctly in 100% of test scenarios |
| AC-10: Error Handling | System displays user-friendly error for invalid queries (tested: 5 edge cases) |
| AC-11: Help Documentation | In-app help covers all required topics: calculation, privacy, usage tips |
| AC-12: Stakeholder Demo | Successful live demo to HR leadership with positive feedback for prod approval |

---

## 11. Success Metrics

### 11.1 Primary Metrics (Go/No-Go Decision)

| Metric | Target | Measurement |
|---|---|---|
| User Satisfaction | ≥80% of pilot users rate as "useful" or "very useful" | Exit survey (5-point Likert scale) |
| Calculation Accuracy | 100% match vs. manual validation | Test suite comparison |
| Privacy Compliance | Zero privacy violations in testing | Security audit report |
| Stakeholder Approval | Formal production approval from HR VP | Decision meeting outcome |

### 11.2 Secondary Metrics (Learning Indicators)

| Metric | Measurement Method |
|---|---|
| AI Interaction Rate | Application Insights |
| Feature Discovery | UI event tracking |
| Error Rate | Chat log analysis |
| Time to Insight | Session recordings |
| Feedback Volume | Feedback form submissions |

### 11.3 Exit Survey Questions

Pilot users complete this survey after 2 weeks of POC usage:

1. How useful is the AI assistant for understanding your team's compliance? (1=Not at all, 5=Extremely)
2. How easy was it to use the dashboard without training? (1=Very difficult, 5=Very easy)
3. Do you trust the privacy protection mechanisms? (Yes/No + explanation)
4. What feature would you most want to see in production?
5. Would you recommend this tool to peer managers? (Yes/No)
6. What barriers prevented you from using it more frequently?

---

## 12. Risks and Mitigation

### R-1: Copilot Studio Limitations

**Description:** Platform may not support required conversation complexity or data integration  
**Impact:** High | **Probability:** Medium

**Mitigation Strategy:** Early spike to test Copilot Studio data connectors with sample CSV. Identify limitations by Week 1. Fallback: Use Azure OpenAI + custom UI.

### R-2: Low User Adoption

**Description:** Managers may not engage with POC during pilot period  
**Impact:** High | **Probability:** Medium

**Mitigation Strategy:** Executive sponsorship message. Weekly usage reminders. Gamification (e.g., "Manager of the Week"). Make feedback submission mandatory for pilot participation.

### R-3: Synthetic Data Unrealistic

**Description:** Fake data patterns don't reflect real compliance issues  
**Impact:** Medium | **Probability:** Low

**Mitigation Strategy:** Base synthetic data on real (anonymized) distributions. Include realistic variance (high/low performers, Friday dips). Validate with HR that patterns are believable.

### R-4: Privacy Rule Confusion

**Description:** Users don't understand why some data is hidden  
**Impact:** Medium | **Probability:** Medium

**Mitigation Strategy:** Clear in-app messaging: "Teams with ≤5 members are protected for privacy." Proactive communication in pilot kickoff. FAQ document.

### R-5: Stakeholder Expectations Misalignment

**Description:** Leadership expects production-level features in POC  
**Impact:** Medium | **Probability:** High

**Mitigation Strategy:** Explicit POC vs. Production scope document (this PRD). Recurring "what's NOT in POC" slide in status updates. Demo realistic limitations early.

### R-6: Timeline Slippage

**Description:** 4-6 week timeline is aggressive for Copilot Studio configuration  
**Impact:** Low | **Probability:** Medium

**Mitigation Strategy:** Start Copilot Studio training immediately. Use pre-built templates. De-scope P2 features if needed. Add 1-week buffer in project plan.

---

## 13. Assumptions & Dependencies

### 13.1 Assumptions

- Pilot users have access to Microsoft Teams and Azure AD credentials
- Synthetic data accurately represents real compliance distribution patterns
- Copilot Studio supports CSV data source ingestion with reasonable query performance
- Managers understand the 70% compliance policy and why it matters
- HR leadership provides executive sponsorship message for pilot
- 10-15 pilot users are sufficient to validate UX and gather meaningful feedback
- POC does not require formal security audit (covered in production phase)
- IT infrastructure team can provision Azure resources within 1 week

### 13.2 Dependencies

| Dependency | Owner | Due | Priority |
|---|---|---|---|
| Azure AD B2C Configuration | IT Security team configures app registration and permissions | Week 1 | Critical |
| Copilot Studio License | Procurement secures Copilot Studio tenant license | Week 1 | Critical |
| Synthetic Data Creation | Product team generates realistic CSV dataset | Week 1 | Critical |
| Pilot User Selection | HR identifies and confirms 10-15 pilot managers | Week 2 | High |
| Executive Sponsorship | HR VP records video message explaining POC | Week 2 | Medium |
| Azure Subscription | IT provisions dev/test Azure subscription | Week 1 | Critical |

---

## 14. Release Plan

### 14.1 POC Timeline (6 Weeks)

**Week 1: Setup & Foundation**
- Azure AD app registration
- Copilot Studio environment setup
- Synthetic data generation (100-200 employees)
- Architecture spike: Copilot Studio + CSV
- Pilot user identification

**Week 2: Core Development**
- Compliance calculation engine
- Privacy rule implementation (6-person, anonymization)
- Basic dashboard layout (HTML/CSS)
- Copilot Studio conversation flow design

**Week 3: AI Integration**
- Copilot Studio data connector configuration
- AI prompt engineering for compliance queries
- Test 20+ sample questions
- Integrate dashboard with Copilot widget

**Week 4: Testing & Refinement**
- UAT with 2-3 internal testers
- Privacy rule validation
- Performance testing (20 concurrent users)
- Bug fixes and UX polish

**Week 5: Pilot Launch**
- Pilot user training session (30 min)
- Access provisioning
- Monitoring dashboard setup
- Daily check-ins with pilot users

**Week 6: Evaluation**
- Collect exit surveys
- Analyze usage metrics
- Stakeholder demo
- Production go/no-go decision meeting

### 14.2 Pilot User Training

30-minute virtual session covering:

1. Overview of RTO policy and compliance measurement
2. Dashboard navigation (5 min demo)
3. Sample AI queries and expected responses
4. Privacy rules explanation
5. How to provide feedback
6. Q&A session

**Materials Provided:**
- Quick reference guide (1-page PDF)
- Sample AI questions cheat sheet
- Feedback form link

### 14.3 Go/No-Go Decision Criteria

At Week 6, production investment approved if:

1. ≥80% user satisfaction score
2. Zero critical bugs or privacy violations
3. Stakeholder consensus on business value
4. Realistic production timeline and budget confirmed

---

## 15. Appendices

### Appendix A: Synthetic Data Schema

POC synthetic dataset (CSV format):

| Field | Data Type | Description |
|---|---|---|
| employee_key | Integer | Unique identifier (1001-1200) |
| manager_key | Integer | Manager's employee_key (org hierarchy) |
| badge_swipe_date | Date | YYYY-MM-DD format |
| location | String | Office location (Austin, Milwaukee, Cleveland) |
| pto_date | Date | Approved PTO days |
| start_date | Date | Employee hire date |
| termination_date | Date | Null for active employees |

**Sample Row:**
```
employee_key: 1045, manager_key: 1010, badge_swipe_date: 2025-11-15, 
location: Austin, pto_date: NULL, start_date: 2022-03-10, termination_date: NULL
```

### Appendix B: Sample AI Prompts for Testing

| Category | Test Prompt |
|---|---|
| Basic | What's my team's compliance? |
| Basic | Are we meeting the 70% threshold? |
| Trend | Show me the last 3 months |
| Breakdown | Which teams are below 70%? |
| Pattern | What's our worst day of the week? |
| Diagnostic | Why is compliance dropping? |
| Recommendation | How can we improve? |
| Comparison | How do we compare to other managers? |
| Calculation | How is compliance calculated? |
| Privacy Test | Show me John Smith's compliance (should decline) |
| Edge Case | What if we have no data? (test error handling) |

### Appendix C: Privacy Protection Test Scenarios

1. Team with 5 members → Dashboard shows "Insufficient data"
2. Team with 6 members → Dashboard shows compliance %
3. AI query "Show Team A details" where Team A has 5 members → AI declines
4. AI query "Who has worst attendance?" → AI declines individual identification
5. Manager attempts to view peer manager's data → Authorization failure
6. Real team name "Product Engineering" → Displayed as "Team A"

### Appendix D: Glossary

- **Badge Swipe Days:** Count of distinct dates with at least one physical badge swipe
- **Eligible Work Days:** Total calendar days minus weekends, holidays, and approved PTO
- **Compliance %:** Badge Swipe Days ÷ Eligible Work Days × 100
- **Six-Person Minimum:** Privacy rule requiring ≥6 employees before displaying aggregated data
- **Team Anonymization:** Displaying teams as "Team A, B, C..." to protect organizational structure
- **Hierarchical Access:** Permission model allowing managers to see only their downward org tree
- **RokFusion:** Rockwell Automation's enterprise data platform (used in production, not POC)