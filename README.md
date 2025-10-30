## FlowPay – Invoicing Made Effortless

FlowPay is a modern, full-stack invoicing application designed to simplify the way freelancers, entrepreneurs, and businesses create, send, and manage invoices. Built with scalability, usability, and performance in mind, FlowPay empowers users to track payments, visualise financial insights, and streamline client management all in one place.

## Features

# Authentication & Authorisation
	•	User sessions handled with requireUser() ensuring secure, authenticated access.
	•	Protected routes for dashboard and invoice management.

# Invoice Management
	•	Create, send, and track invoices with recipient details (name, email).
	•	Support for multiple currencies using a JSON-based currency dataset.
	•	Currency formatting handled via a custom formatCurrency utility.
	•	Tracks paid invoices and aggregates amounts for reporting.

# Dashboard Analytics
	•	Paid Invoices Graph – Displays a 30-day view of paid invoices, aggregated and sorted by date.
	•	Recent Invoices List – Shows the latest 8 invoices with client avatars and amounts.
	•	Dashboard Blocks – High-level financial metrics at a glance (totals, summaries).

# Optimised Data Loading
	•	Components wrapped in React Suspense with skeleton loaders for a smooth UX.
	•	Each dashboard widget (blocks, graph, recent invoices) loads independently.

# UI/UX
	•	Built with shadcn/ui components.
	•	Responsive, grid-based layouts for desktop and mobile.
	•	Gradient text headings and modern typography for a professional look.

⸻

# Tech Stack
	•	Frontend: Next.js (React, Server Components, Suspense)
	•	UI Library: Tailwind CSS + shadcn/ui
	•	Database: PostgreSQL (via Prisma ORM)
	•	Backend: Next.js API routes with Prisma integration
	•	Authentication: Custom session handling (requireUser)
	•	Deployment: Cloud-ready (can be hosted on Vercel, Railway, or similar)


# Project Structure

/app
  /dashboard
    DashboardPage.tsx   → Main dashboard entry
    InvoiceGraph.tsx    → Paid invoices line graph
    RecentInvoices.tsx  → Recent invoices list
  /utils
    db.ts               → Prisma client instance
    hooks.ts            → Auth/session helpers
    formatCurrency.ts   → Currency formatting logic
  /components
    ui/                 → shadcn/ui primitives (Card, Avatar, Skeleton, etc.)



# Implementation Details
	•	Data aggregation:
Invoices are grouped and aggregated by date using reduce(), then transformed into a sorted array for charting.
	•	Graph visualization:
Uses recharts to render a line graph of invoice totals over time.
	•	Currency handling:
	•	Each invoice stores totalAmount and currency.
	•	Totals are displayed natively in the chosen invoice currency.
	•	Dashboard totals (last 30 days) are displayed in a single base currency (e.g., ZAR).
	•	Recent invoices:
	•	Displays last 8 invoices with recipient initials as avatar fallback.
	•	Email + amount shown in a clean, responsive flex layout.
	•	Suspense integration:
	•	Each major dashboard section (DashboardBlocks, InvoiceGraph, RecentInvoices) wrapped in its own <Suspense> for independent loading.


# Current State of Development

Implemented:
	•	Invoice data model with Prisma
	•	Paid invoices aggregation for graphs
	•	Recent invoices list with avatars
	•	Currency formatting utility
	•	Dashboard analytics (last 30 days totals)
	•	Suspense loading states
	•	Modern UI components
	•	Export invoices as PDF

Next Steps / Possible Enhancements:
	•	Client management module
	•	Payment integrations
	•	Multi-user team accounts
	•	Advanced analytics (monthly revenue, outstanding invoices, trends)

