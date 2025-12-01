# Never 100 - Client App

Frontend application for Never 100, a budget pacing tracker that helps you stay under budget every month.

## Phase 1 Complete ✅

- React 18 with TypeScript
- Vite build tool
- CSS Modules for styling (scoped styles with TypeScript support)
- Tanstack Query (React Query) for data fetching and caching
- React Router for navigation
- Comprehensive TypeScript interfaces
- Mock data service with multiple test scenarios
- Basic project structure and routing

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Development

The app is currently in Phase 1 (scaffolding). The following pages are available:

- `/` - Dashboard (placeholder)
- `/history` - Historical data (placeholder)
- `/settings` - Settings page (placeholder)

## Mock Data Service

The app includes a comprehensive mock data service ([mockDataService.ts](src/services/mockDataService.ts)) with the following test scenarios:

- `healthy` - Under budget, good pace (92% pacing)
- `slight-over` - Slightly over pace (108% pacing)
- `danger` - Significantly over pace (118% pacing)
- `way-under` - Spending too slowly (65% pacing)
- `mid-month` - Testing mid-month display
- `end-of-month` - Testing end of month

You can switch scenarios and set simulation dates for testing different UI states.

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS Modules
- Tanstack Query (React Query)
- React Router

## Project Structure

```
src/
├── components/     # Reusable UI components
│   └── Layout.tsx  # Main layout with navigation
├── pages/          # Route pages
│   ├── Dashboard.tsx
│   ├── History.tsx
│   └── Settings.tsx
├── services/       # API and data services
│   └── mockDataService.ts
├── types/          # TypeScript type definitions
│   └── index.ts
├── App.tsx         # Root component with routing
└── main.tsx        # Entry point
```

## Features

### CSS Modules
- Scoped styling with zero configuration
- TypeScript support with autocompletion
- Standard CSS syntax
- No runtime overhead

### Tanstack Query
- Smart caching and automatic background refetching
- Built-in loading, error, and success states
- React Query DevTools for debugging
- Perfect integration with mock data service

### Mock Data Service
Use the mock data service with Tanstack Query hooks for rapid UI development and testing.

## Next Steps

**Phase 2**: Core Dashboard UI
- Pacing gauge component
- Time vs money comparison card
- Top spending categories section
- Dev tools (scenario switcher + simulation date picker)
- Integration with Tanstack Query hooks
