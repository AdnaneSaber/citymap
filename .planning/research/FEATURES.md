# Civic Issue Reporting Apps — Feature Research

> Based on analysis of FixMyStreet (UK/global), SeeClickFix (US), Colab.re (Brazil), 311 apps, and similar platforms.
> Note: Web search was unavailable; this draws on established domain knowledge of these platforms.

---

## 1. Table Stakes (Must-Have or Users Leave)

These are non-negotiable. Without them the app is dead on arrival.

### 1.1 Report Submission (Core Loop)
| Feature | Notes | Complexity |
|---|---|---|
| **Photo attachment** | Single photo minimum. Citizens think in photos, not text. #1 adoption driver. | Low |
| **GPS/map location** | Auto-detect + manual pin adjustment. "Where" is the most critical metadata. | Low-Med |
| **Category selection** | Pothole, streetlight, graffiti, trash, etc. Must match what the local government actually handles. | Low (but content-heavy) |
| **Free-text description** | Short, optional. Most users won't write much. | Low |
| **Submit without account** | Or at minimum, trivially easy signup (email/phone only). Every friction step loses ~50% of users. | Low |

### 1.2 Feedback Loop
| Feature | Notes | Complexity |
|---|---|---|
| **Status updates** | Open → Acknowledged → In Progress → Resolved. Users need to feel heard. Without this, they report once and never return. | Med |
| **Notification on status change** | Push or email. "Your pothole was fixed" is the #1 retention moment. | Med |
| **Public report map** | Users want to see they're not alone. Social proof that the system works. Also prevents duplicates. | Med |

### 1.3 Basic Usability
| Feature | Notes | Complexity |
|---|---|---|
| **Mobile-first responsive web** | Most reports happen on-the-spot from phones. | Med |
| **Fast load time (<3s)** | Citizens aren't power users. They'll abandon slow apps. | — |
| **Works offline enough to draft** | At minimum, don't lose the photo/text if signal drops. | Med |
| **Multilingual support** | Depends on market. Table stakes in diverse cities. | Med |

**Key insight:** The entire table-stakes set forms a single loop: **See problem → Snap photo → Drop pin → Pick category → Submit → Get notified when fixed.** If any step in this loop is broken or slow, adoption collapses.

---

## 2. Differentiators (Competitive Advantage)

These separate successful apps from forgotten ones.

### 2.1 Citizen Engagement
| Feature | Notes | Complexity | Depends On |
|---|---|---|---|
| **Upvote / "me too"** | SeeClickFix's killer feature. Lets citizens amplify issues without duplicate reports. Shows government demand signal. | Low | Public report map |
| **Before/after photos** | Powerful for trust-building. "Look, they actually fixed it." Colab.re does this well. | Low | Status updates |
| **Duplicate detection / nearby reports** | Show existing reports near the user's location before they submit. Reduces noise, increases feeling of community. | Med-High | GPS + search index |
| **Leaderboards / gamification** | SeeClickFix has civic points. Works for power users, irrelevant to casual reporters. Nice-to-have, not critical. | Med | User accounts |
| **Comment threads on reports** | Lets neighbors discuss. Can also be toxic — needs moderation. | Med | User accounts, moderation |

### 2.2 Government Integration
| Feature | Notes | Complexity | Depends On |
|---|---|---|---|
| **Admin dashboard** | The real product is often B2G (business-to-government). The citizen app is the acquisition funnel. | High | — |
| **Auto-routing to correct department** | Based on category + location → route to the right team. Massive value for governments. | Med-High | Category taxonomy, agency mapping |
| **SLA tracking** | Track response times. Creates accountability. Governments hate and need this. | Med | Admin dashboard |
| **Integration with existing 311/CRM** | SeeClickFix integrates with Salesforce, CityWorks, etc. This is how you win government contracts. | High | Admin dashboard |
| **Analytics & heatmaps** | Where are problems clustering? Budget justification for governments. | Med | Report data accumulation |

### 2.3 Smart Features
| Feature | Notes | Complexity | Depends On |
|---|---|---|---|
| **AI category suggestion from photo** | Upload pothole photo → auto-suggest "Road damage." Reduces friction. | Med-High | ML model, photo upload |
| **Address reverse-geocoding** | Turn GPS pin into human-readable address. Essential for government routing. | Low | Maps API |
| **Scheduled/recurring reports** | "This streetlight goes out every week." Niche but valuable. | Med | User accounts |

**Key insight from SeeClickFix:** The "me too" / upvote feature is the single most impactful differentiator. It transforms the app from a complaint box into a **prioritization tool** for government. It also gives citizens agency without requiring them to write anything.

**Key insight from FixMyStreet:** Open-source + self-hostable was their differentiator. Governments in 40+ countries adopted it because they could own the data.

**Key insight from Colab.re:** Positioned as "civic social network" — the social/community angle drove adoption in Brazil where trust in government is low.

---

## 3. Anti-Features (Do NOT Build in V1)

Things that seem obvious but will kill your timeline, add complexity, or actively hurt adoption.

### 3.1 Over-Engineering
| Anti-Feature | Why NOT | Build When? |
|---|---|---|
| **Native mobile apps (iOS + Android)** | PWA or responsive web is enough for v1. Native triples your dev cost and adds app store gatekeeping. | V2, once you have traction |
| **User profiles / social features** | Nobody wants a social network for potholes. Keep it anonymous or minimal-account. | Maybe never |
| **Rich text editor for descriptions** | Plain text. Citizens write 1-2 sentences max. | Never |
| **Video upload** | Bandwidth, storage, moderation nightmare. Photos are sufficient. | V3+ |
| **Real-time chat with government** | Massive support burden. Async status updates are the right model. | Never (or V3) |

### 3.2 Premature Optimization
| Anti-Feature | Why NOT | Build When? |
|---|---|---|
| **Complex role-based permissions** | Start with: citizen, admin. That's it. | When you have multi-department governments |
| **Custom category taxonomies per city** | Start with a universal set of ~15 categories. Customize later. | V2 |
| **Offline-first architecture** | Full offline sync is an architectural nightmare. "Don't lose the draft" is enough. | V2 if rural areas are target |
| **Multi-city / white-label platform** | Build for ONE city first. Prove it works. | V2 |
| **API / third-party integrations** | No one will integrate until you have users. | V2 |

### 3.3 Governance Traps
| Anti-Feature | Why NOT | Build When? |
|---|---|---|
| **Moderation system for user content** | If you add comments/social features, you need moderation. So don't add comments in v1. | When you add social features |
| **Identity verification** | Kills adoption. Anonymous/pseudonymous reporting is fine for v1. | If government requires it |
| **Payment processing** | Some apps let citizens pledge $ for fixes. Complex, regulated, distracting. | Never (probably) |
| **Voting on priority** | Sounds democratic, creates expectation that top-voted = first-fixed. Government can't promise that. "Me too" is safer. | V2 with careful framing |

---

## 4. Feature Dependency Map

```
Photo Upload ──┐
GPS Location ──┤
Category ──────┼──→ [REPORT SUBMISSION] ──→ Public Report Map ──→ Upvote/"Me Too"
Description ───┤                        │                    └──→ Duplicate Detection
Account (opt) ─┘                        │
                                        ├──→ Status Updates ──→ Notifications ──→ Before/After Photos
                                        │
                                        └──→ Admin Dashboard ──→ Auto-Routing
                                                             ──→ SLA Tracking
                                                             ──→ Analytics/Heatmaps
                                                             ──→ CRM Integration
```

**Critical path for v1:** Report Submission → Public Map → Status Updates → Notifications

**Phase 2 unlocks:** Upvote, Duplicate Detection, Admin Dashboard, Auto-Routing

---

## 5. What Actually Drives Citizen Adoption?

Based on adoption patterns across FixMyStreet, SeeClickFix, and Colab.re:

1. **Speed of first report** — Under 60 seconds from opening the app to submitted report. Every field you add costs users.
2. **Visible proof it works** — The public map showing resolved issues is more important than any feature. Social proof.
3. **The notification "your issue was fixed"** — This single moment creates evangelists. Without it, the app is a black hole.
4. **Low barrier to entry** — No app download required (web), no account required (or phone-only), no complex forms.
5. **Government actually responding** — This is the hardest "feature." The app is only as good as the government's willingness to close the loop. Many civic apps die because government ignores them.

### The Cold Start Problem
The #1 killer of civic reporting apps isn't missing features — it's **no government on the other end**. SeeClickFix solved this by initially having their own team acknowledge reports and forward them manually. FixMyStreet partnered with councils before launching in each area. **You must solve the government side or the citizen side dies.**

---

## 6. Recommended V1 Scope

**Build exactly this and nothing more:**

- [ ] Photo upload (1-3 photos)
- [ ] Map pin with GPS auto-detect
- [ ] Category picker (~12-15 categories)
- [ ] Optional text description
- [ ] Phone/email-only account (or anonymous with contact info)
- [ ] Public map of all reports
- [ ] Status tracking (Open → Acknowledged → Resolved)
- [ ] Email/SMS notification on status change
- [ ] Simple admin panel (view reports, update status)
- [ ] Mobile-responsive web app

**That's ~10 features. Resist adding more.**

---

*Research compiled 2026-03-07. Sources: Domain knowledge of FixMyStreet (mySociety/UK), SeeClickFix (CivicPlus/US), Colab.re (Brazil), various 311 platforms, and civic tech literature. Web sources were unavailable for live verification.*
