# VMK Website — Product Owner editorial/admin outcome — 2026-09-04

**Authority:** Product Owner
**Status:** APPROVED PRODUCT INPUT / exact implementation details require joint agent review where unresolved

## 1. Current PO acceptance state

The homepage is **approximately accepted as a direction**, although it is not considered visually perfect. Do not restart the project around endless homepage polishing.

The priority product outcome is now the **complete subpage + editorial/admin workflow**.

## 2. Required owner/editor outcome

A normal authorized VMK editor must be able to manage the website through the admin interface without code or database work.

The Product Owner explicitly expects the system to support, as applicable:

- galleries: create/edit, manage images, replace images, publish/update;
- news/articles: create/edit, text changes, image replacement, publish/update;
- events: create/edit, dates/details/images, publish/update;
- opening hours: maintain through the admin interface and have changes appear correctly on the public site;
- subpages/pages: maintain real content through CMS/admin, not hard-coded placeholder-only pages;
- existing migrated content: remain editable after migration;
- media: replace/update images and have references update correctly;
- other site functions and content types already represented in the product, including library-related functionality and the previously discussed 'könyvkosár' requirement, once its exact business meaning is confirmed.

## 3. Acceptance must be end-to-end

A Payload collection/schema existing in code is **not sufficient evidence** that the feature is complete.

For each important editorial workflow, acceptance must demonstrate through the real admin UI:

`login -> find/create content -> edit fields/media -> save/publish -> public page shows the intended change -> edit again/revert/update works`

Representative browser-based E2E proof is required for Galleries, News/Articles, Events, Opening Hours and generic Pages/subpages.

## 4. Current implementation facts to verify, not assume

The repository currently registers Payload collections for Media, Libraries, News, Events, OpeningHours, Pages, Staff, Documents, Services, Partners, Galleries, Registrations, Rooms, Bookings, DonationPledges, ContactMessages, NewsletterSubscribers and Products.

This demonstrates broad CMS schema coverage, but the team must determine which of these have complete, usable editor-to-public-page workflows and which are only partially wired.

## 5. Joint review required

Claude, Codex, Gemini and ChatGPT must reconcile:

1. the complete user-facing page/content inventory versus the real VMK site and approved target design;
2. for each content type, whether admin CRUD, media replacement, publishing, preview and public rendering work end-to-end;
3. which important public pages are still hard-coded or disconnected from CMS data;
4. gallery/event/news/opening-hours specific gaps;
5. the exact meaning and desired workflow of the 'könyvkosár' feature before implementation if repository evidence does not already establish it;
6. browser-based acceptance cases for the admin workflows;
7. remaining production blockers (accessibility, security, deployment) separately from editorial completeness.

Do not declare the VMK website complete based only on frontend appearance or collection definitions.

## 6. PO communication rule

When a business behavior is unclear, return a concrete Product Owner question with examples/options. Do not silently invent the expected editor workflow.
