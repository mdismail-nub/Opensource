import { Repository, Issue, UserProfile, RoadmapStep } from '../types';

export const currentUser: UserProfile = {
  name: 'Ismail',
  githubUsername: 'iammdismail',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', // will use initials/styled SVG avatar in UI
  role: 'Frontend Developer',
  skills: ['JavaScript', 'React', 'HTML/CSS', 'Git', 'Tailwind CSS', 'TypeScript Basics'],
  stats: {
    projectsExploring: 12,
    issuesCompleted: 7,
    pullRequests: 3,
    merged: 2,
  },
  currentLearning: {
    repoId: 'shadcn-ui',
    repoName: 'shadcn/ui',
    topic: 'React',
    progress: 68,
    nextSubtopic: 'Hooks & State Management',
    stepNumber: '02',
  },
  contributionStage: 'Prepare',
};

export const defaultRoadmapSteps: RoadmapStep[] = [
  {
    stepNumber: '01',
    title: 'JavaScript Fundamentals',
    status: 'completed',
    progress: 100,
    topics: ['ES6+', 'Async/Await', 'Modules', 'Promises'],
    summary: 'Core language primitives, closures, modern syntax, asynchronous event loop, and modular scoping.',
    estimatedTime: '6 hrs completed',
    checklist: [
      { id: 'js-1', name: 'ES6+ syntax & destructuring', completed: true, resourceTitle: 'Modern JS Cheatsheet' },
      { id: 'js-2', name: 'Async/Await & Promise chaining', completed: true, resourceTitle: 'Event Loop & Promises' },
      { id: 'js-3', name: 'ES Modules (import / export)', completed: true, resourceTitle: 'Tree-shaking basics' },
      { id: 'js-4', name: 'Array methods & Immutability', completed: true, resourceTitle: 'Functional patterns' },
    ],
  },
  {
    stepNumber: '02',
    title: 'React',
    status: 'in_progress',
    progress: 68,
    topics: ['Components', 'Hooks', 'State', 'Props', 'Context'],
    summary: 'Component lifecycles, composition patterns, custom hooks, memoization, and context propagation.',
    estimatedTime: '4 hrs remaining',
    checklist: [
      { id: 'react-1', name: 'Functional components & JSX typing', completed: true, resourceTitle: 'Component composition' },
      { id: 'react-2', name: 'useState & useReducer fundamentals', completed: true, resourceTitle: 'State machine basics' },
      { id: 'react-3', name: 'useEffect dependency arrays & cleanups', completed: true, resourceTitle: 'Effect sync mental model' },
      { id: 'react-4', name: 'Custom hooks & reusable abstractions', completed: false, resourceTitle: 'Extracting stateful logic' },
      { id: 'react-5', name: 'Context API & compound component patterns', completed: false, resourceTitle: 'Compound components in UI kits' },
    ],
  },
  {
    stepNumber: '03',
    title: 'TypeScript',
    status: 'next',
    progress: 15,
    topics: ['Types', 'Interfaces', 'Generics', 'Type narrowing'],
    summary: 'Strict compile-time verification, polymorphic generics, utility types, and discriminated unions.',
    estimatedTime: '8 hrs estimated',
    checklist: [
      { id: 'ts-1', name: 'Interfaces vs Type aliases', completed: true, resourceTitle: 'Type modeling' },
      { id: 'ts-2', name: 'Generics in components and helper functions', completed: false, resourceTitle: 'Generic constraints' },
      { id: 'ts-3', name: 'Discriminated unions & type guards', completed: false, resourceTitle: 'Exhaustive pattern matching' },
      { id: 'ts-4', name: 'ComponentPropsWithoutRef & polymorphic types', completed: false, resourceTitle: 'Typing UI primitives' },
    ],
  },
  {
    stepNumber: '04',
    title: 'Testing',
    status: 'locked',
    progress: 0,
    topics: ['Unit testing', 'Jest', 'React Testing Library'],
    summary: 'User-centric DOM testing, accessibility assertions, mocking external dependencies, and regression guards.',
    estimatedTime: '5 hrs estimated',
    checklist: [
      { id: 'test-1', name: 'Unit testing primitives with Vitest/Jest', completed: false },
      { id: 'test-2', name: 'React Testing Library user-event simulations', completed: false },
      { id: 'test-3', name: 'Snapshot testing vs behavioral assertions', completed: false },
      { id: 'test-4', name: 'Testing keyboard accessibility & ARIA roles', completed: false },
    ],
  },
  {
    stepNumber: '05',
    title: 'Contribution Ready',
    status: 'locked',
    progress: 0,
    topics: ['Git fork workflow', 'Conventional Commits', 'Local Dev Setup', 'PR Template'],
    summary: 'Repository-specific branching rules, local documentation previews, CI verification checks, and submitting clean PRs.',
    estimatedTime: '2 hrs estimated',
    checklist: [
      { id: 'pr-1', name: 'Fork, clone & configure upstream remote', completed: false },
      { id: 'pr-2', name: 'Run linting, types check & test suite locally', completed: false },
      { id: 'pr-3', name: 'Follow repo PR template and link issue', completed: false },
      { id: 'pr-4', name: 'Respond to maintainer code review notes', completed: false },
    ],
  },
];

export const mockRepositories: Repository[] = [
  {
    id: 'shadcn-ui',
    name: 'shadcn/ui',
    owner: 'shadcn',
    repoName: 'ui',
    description: 'A collection of beautifully designed, accessible React components that you can copy and paste into your apps.',
    stars: 95400,
    starsFormatted: '95k',
    forks: 8200,
    contributorsCount: 720,
    openIssuesCount: 142,
    primaryLanguage: 'TypeScript',
    languages: [
      { name: 'TypeScript', percentage: 78.4, color: '#3178c6' },
      { name: 'React / TSX', percentage: 16.2, color: '#61dafb' },
      { name: 'CSS / Tailwind', percentage: 5.4, color: '#38bdf8' },
    ],
    topics: ['react', 'tailwind', 'components', 'radix-ui', 'design-system', 'accessibility'],
    skillMatch: 92,
    beginnerIssuesCount: 12,
    difficulty: 'Beginner',
    lastUpdated: '2 hours ago',
    license: 'MIT',
    defaultBranch: 'main',
    roadmap: defaultRoadmapSteps,
    readmePreview: `# shadcn/ui

Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.

## Features
- Built on top of Radix UI primitives for bulletproof accessibility (ARIA).
- Styled with Tailwind CSS classes directly in your repository.
- Full TypeScript safety with strict props inference.
- Zero runtime overhead—no heavy node_modules component wrappers.`,
    architectureNotes: [
      'Components reside directly in user src/components/ui directory via CLI generation.',
      'Radix UI primitives handle keyboard navigation, focus trap, and ARIA state.',
      'Class Variance Authority (cva) manages component variants and colorways.',
      'Tailwind merge (twMerge) and clsx ensure clean class overrides without specificity collisions.',
    ],
    prerequisites: ['React 18/19 functional components', 'TypeScript basic interfaces', 'Tailwind CSS utility classes', 'Understanding of accessible keyboard interactions'],
    contributors: [
      { name: 'shadcn', handle: 'shadcn', avatar: '', commits: 1420, role: 'Author / Maintainer' },
      { name: 'Dax Raad', handle: 'thdxr', avatar: '', commits: 210, role: 'Maintainer' },
      { name: 'Lee Robinson', handle: 'leerob', avatar: '', commits: 95, role: 'Contributor' },
      { name: 'Goran Babarogic', handle: 'goranb', avatar: '', commits: 64, role: 'Contributor' },
    ],
    activity: {
      commitsThisMonth: 84,
      avgPrResponseTime: '18 hours',
      releasesThisYear: 28,
      mergedPrsLast30Days: 46,
    },
  },
  {
    id: 'vercel-nextjs',
    name: 'vercel/next.js',
    owner: 'vercel',
    repoName: 'next.js',
    description: 'The React framework for the web. Used by some of the world’s largest companies to build full-stack web applications.',
    stars: 126000,
    starsFormatted: '126k',
    forks: 26800,
    contributorsCount: 3400,
    openIssuesCount: 1850,
    primaryLanguage: 'TypeScript',
    languages: [
      { name: 'TypeScript', percentage: 72.1, color: '#3178c6' },
      { name: 'Rust', percentage: 21.3, color: '#dea584' },
      { name: 'JavaScript', percentage: 6.6, color: '#f7df1e' },
    ],
    topics: ['react', 'framework', 'ssr', 'nextjs', 'turbopack', 'fullstack'],
    skillMatch: 86,
    beginnerIssuesCount: 18,
    difficulty: 'Intermediate',
    lastUpdated: '14 minutes ago',
    license: 'MIT',
    defaultBranch: 'canary',
    roadmap: defaultRoadmapSteps,
    readmePreview: `# Next.js

Next.js is the flexible React framework that gives you building blocks to create fast, full-stack web applications.

## Key Capabilities
- Server-side rendering (SSR) and static generation (SSG) with App Router.
- Turbopack-powered high-speed local development engine.
- Built-in optimizations for images, fonts, and scripts.`,
    architectureNotes: [
      'Turbopack compiler core implemented in Rust for ultra-fast bundling.',
      'packages/next contains the JavaScript/TypeScript client runtime and App Router.',
      'Test suite leverages isolated Playwright e2e test matrices.',
    ],
    prerequisites: ['Solid React knowledge', 'Basic Node.js runtime concepts', 'Monorepo navigation with pnpm'],
    contributors: [
      { name: 'Tim Neutkens', handle: 'timneutkens', avatar: '', commits: 3800, role: 'Core Maintainer' },
      { name: 'Jiachi Liu', handle: 'huozhi', avatar: '', commits: 1420, role: 'Core Maintainer' },
      { name: 'Shu Ding', handle: 'quietshu', avatar: '', commits: 980, role: 'Design Engineer' },
    ],
    activity: {
      commitsThisMonth: 340,
      avgPrResponseTime: '6 hours',
      releasesThisYear: 82,
      mergedPrsLast30Days: 210,
    },
  },
  {
    id: 'facebook-react',
    name: 'facebook/react',
    owner: 'facebook',
    repoName: 'react',
    description: 'The library for web and native user interfaces. Declarative, component-based, and learn once, write anywhere.',
    stars: 235000,
    starsFormatted: '235k',
    forks: 46200,
    contributorsCount: 1820,
    openIssuesCount: 780,
    primaryLanguage: 'JavaScript',
    languages: [
      { name: 'JavaScript', percentage: 91.2, color: '#f7df1e' },
      { name: 'HTML/CSS', percentage: 5.1, color: '#e34c26' },
      { name: 'TypeScript', percentage: 3.7, color: '#3178c6' },
    ],
    topics: ['react', 'ui', 'library', 'declarative', 'frontend'],
    skillMatch: 79,
    beginnerIssuesCount: 8,
    difficulty: 'Advanced',
    lastUpdated: '1 hour ago',
    license: 'MIT',
    defaultBranch: 'main',
    roadmap: defaultRoadmapSteps,
    readmePreview: `# React

React is a JavaScript library for building user interfaces.

- **Declarative**: React makes it painless to create interactive UIs. Design simple views for each state in your application.
- **Component-Based**: Build encapsulated components that manage their own state, then compose them to make complex UIs.`,
    architectureNotes: [
      'Reconciliation engine separates virtual DOM diffing from host renderer (react-dom, react-native).',
      'Fiber architecture enables cooperative multi-tasking and priority-based scheduling.',
      'Server Components (RSC) enable zero-bundle-size server execution.',
    ],
    prerequisites: ['Deep JavaScript internals (closures, event loop)', 'Compiler basics', 'Flow/TypeScript typing'],
    contributors: [
      { name: 'Andrew Clark', handle: 'acdlite', avatar: '', commits: 2400, role: 'Core Team' },
      { name: 'Dan Abramov', handle: 'gaearon', avatar: '', commits: 2190, role: 'Alumni' },
      { name: 'Sebastian Markbåge', handle: 'sebmarkbage', avatar: '', commits: 1840, role: 'Architect' },
    ],
    activity: {
      commitsThisMonth: 65,
      avgPrResponseTime: '24 hours',
      releasesThisYear: 14,
      mergedPrsLast30Days: 38,
    },
  },
  {
    id: 'trpc-trpc',
    name: 'trpc/trpc',
    owner: 'trpc',
    repoName: 'trpc',
    description: 'Move Fast and Break Nothing. End-to-end typesafe APIs made easy without code generation or schemas.',
    stars: 35200,
    starsFormatted: '35k',
    forks: 1450,
    contributorsCount: 410,
    openIssuesCount: 64,
    primaryLanguage: 'TypeScript',
    languages: [
      { name: 'TypeScript', percentage: 98.9, color: '#3178c6' },
      { name: 'Other', percentage: 1.1, color: '#94a3b8' },
    ],
    topics: ['typescript', 'api', 'rpc', 'react-query', 'typesafe', 'fullstack'],
    skillMatch: 94,
    beginnerIssuesCount: 15,
    difficulty: 'Beginner',
    lastUpdated: '3 hours ago',
    license: 'MIT',
    defaultBranch: 'main',
    roadmap: defaultRoadmapSteps,
    readmePreview: `# tRPC

Experience the developer joy of end-to-end typesafe APIs without code generation or runtime schema bloat.

## Highlights
- Automatic type inference across client and server boundaries.
- Tight integration with TanStack Query (React Query).
- Zero code generation step—just native TypeScript types.`,
    architectureNotes: [
      'Procedure builder pattern encapsulates middleware, input parser, and query/mutation resolver.',
      'Type inference uses conditional types and recursive generics for deep client proxying.',
      'Adapters support Express, Fastify, Next.js, Cloudflare, and Fetch standard.',
    ],
    prerequisites: ['TypeScript generics & inference', 'Understanding HTTP request/response basics', 'React Query concepts'],
    contributors: [
      { name: 'Alex Johansson', handle: 'KATT', avatar: '', commits: 2850, role: 'Creator & Maintainer' },
      { name: 'Sachin Raja', handle: 'sachinraja', avatar: '', commits: 340, role: 'Maintainer' },
      { name: 'Julius Marminge', handle: 'juliusmarminge', avatar: '', commits: 290, role: 'Maintainer' },
    ],
    activity: {
      commitsThisMonth: 58,
      avgPrResponseTime: '12 hours',
      releasesThisYear: 19,
      mergedPrsLast30Days: 32,
    },
  },
  {
    id: 'supabase-supabase',
    name: 'supabase/supabase',
    owner: 'supabase',
    repoName: 'supabase',
    description: 'The open source Firebase alternative. Build production-grade backends with Postgres, Auth, Realtime, and Edge Functions.',
    stars: 76800,
    starsFormatted: '77k',
    forks: 6400,
    contributorsCount: 1100,
    openIssuesCount: 520,
    primaryLanguage: 'TypeScript',
    languages: [
      { name: 'TypeScript', percentage: 65.4, color: '#3178c6' },
      { name: 'Go', percentage: 18.2, color: '#00add8' },
      { name: 'SQL', percentage: 12.0, color: '#e38c00' },
      { name: 'Elixir', percentage: 4.4, color: '#6e4a7e' },
    ],
    topics: ['postgres', 'database', 'auth', 'storage', 'realtime', 'firebase-alternative'],
    skillMatch: 88,
    beginnerIssuesCount: 16,
    difficulty: 'Intermediate',
    lastUpdated: '45 minutes ago',
    license: 'Apache-2.0',
    defaultBranch: 'master',
    roadmap: defaultRoadmapSteps,
    readmePreview: `# Supabase

Supabase is an open source Firebase alternative. We are building the features of Firebase using enterprise-grade open source tools.

- Hosted Postgres Database
- Realtime subscriptions
- Authentication and User Management
- Auto-generated REST and GraphQL APIs
- Storage buckets and Edge Functions`,
    architectureNotes: [
      'Studio web dashboard written in Next.js, React, and Tailwind CSS.',
      'PostgREST converts Postgres schemas directly into RESTful endpoints.',
      'Realtime engine powered by Elixir Phoenix channels broadcasting Postgres WAL changes.',
    ],
    prerequisites: ['React & Tailwind for frontend/Studio contributions', 'SQL basics', 'REST API principles'],
    contributors: [
      { name: 'Paul Copplestone', handle: 'kiwicopple', avatar: '', commits: 1980, role: 'Co-founder' },
      { name: 'Ant Wilson', handle: 'awalias', avatar: '', commits: 1640, role: 'Co-founder' },
      { name: 'Jon Meyers', handle: 'dijonmusters', avatar: '', commits: 380, role: 'DevRel' },
    ],
    activity: {
      commitsThisMonth: 190,
      avgPrResponseTime: '8 hours',
      releasesThisYear: 45,
      mergedPrsLast30Days: 140,
    },
  },
  {
    id: 'astro-astro',
    name: 'withastro/astro',
    owner: 'withastro',
    repoName: 'astro',
    description: 'The web framework for content-driven websites. Islands architecture with zero JS by default and multi-framework support.',
    stars: 48900,
    starsFormatted: '49k',
    forks: 2500,
    contributorsCount: 890,
    openIssuesCount: 180,
    primaryLanguage: 'TypeScript',
    languages: [
      { name: 'TypeScript', percentage: 89.4, color: '#3178c6' },
      { name: 'Astro', percentage: 8.2, color: '#ff5d01' },
      { name: 'JavaScript', percentage: 2.4, color: '#f7df1e' },
    ],
    topics: ['astro', 'islands', 'static-site-generator', 'content', 'web-framework'],
    skillMatch: 90,
    beginnerIssuesCount: 14,
    difficulty: 'Beginner',
    lastUpdated: '5 hours ago',
    license: 'MIT',
    defaultBranch: 'main',
    roadmap: defaultRoadmapSteps,
    readmePreview: `# Astro

Astro is the all-in-one web framework designed for speed. Pull your content from anywhere and deploy anywhere, all powered by your favorite UI components and libraries.

- **Component Islands**: A new web architecture for building faster websites.
- **Server-first API design**: Render on demand or prerender HTML.
- **Zero JS, by default**: No client-side runtime overhead.`,
    architectureNotes: [
      'Compiler transforms .astro single-file components into vanilla JavaScript generator functions.',
      'Islands architecture hydrates isolated client components using IntersectionObserver.',
      'Content Collections provide schema validation via Zod with type safety.',
    ],
    prerequisites: ['HTML/CSS fundamentals', 'Component model (React or Vue or Svelte)', 'Vite plugin ecosystem'],
    contributors: [
      { name: 'Fred K. Schott', handle: 'FredKSchott', avatar: '', commits: 2310, role: 'Creator' },
      { name: 'Nate Moore', handle: 'natemoo-re', avatar: '', commits: 1450, role: 'Core' },
      { name: 'Matthew Phillips', handle: 'matthewp', avatar: '', commits: 1120, role: 'Core' },
    ],
    activity: {
      commitsThisMonth: 120,
      avgPrResponseTime: '10 hours',
      releasesThisYear: 36,
      mergedPrsLast30Days: 78,
    },
  },
  {
    id: 'tailwind-tailwindcss',
    name: 'tailwindlabs/tailwindcss',
    owner: 'tailwindlabs',
    repoName: 'tailwindcss',
    description: 'A utility-first CSS framework for rapid UI development. Compose modern websites directly inside your markup.',
    stars: 84300,
    starsFormatted: '84k',
    forks: 4100,
    contributorsCount: 420,
    openIssuesCount: 88,
    primaryLanguage: 'TypeScript',
    languages: [
      { name: 'Rust', percentage: 58.0, color: '#dea584' },
      { name: 'TypeScript', percentage: 38.5, color: '#3178c6' },
      { name: 'JavaScript', percentage: 3.5, color: '#f7df1e' },
    ],
    topics: ['css', 'tailwind', 'utilities', 'design-system', 'postcss'],
    skillMatch: 85,
    beginnerIssuesCount: 9,
    difficulty: 'Intermediate',
    lastUpdated: '1 day ago',
    license: 'MIT',
    defaultBranch: 'main',
    roadmap: defaultRoadmapSteps,
    readmePreview: `# Tailwind CSS

Tailwind CSS is a utility-first CSS framework packed with classes like \`flex\`, \`pt-4\`, \`text-center\` and \`rotate-90\` that can be composed to build any design, directly in your markup.`,
    architectureNotes: [
      'Tailwind v4 is rewritten with a high-performance Rust engine for 10x faster builds.',
      'Native cascading layers and CSS color-mix() integration.',
    ],
    prerequisites: ['CSS modern spec (grid, flexbox, custom properties)', 'PostCSS or LightningCSS familiarity'],
    contributors: [
      { name: 'Adam Wathan', handle: 'adamwathan', avatar: '', commits: 3400, role: 'Creator' },
      { name: 'Robin Malfait', handle: 'RobinMalfait', avatar: '', commits: 1240, role: 'Core' },
      { name: 'Jordan Pittman', handle: 'jordanpittman', avatar: '', commits: 450, role: 'Core' },
    ],
    activity: {
      commitsThisMonth: 42,
      avgPrResponseTime: '20 hours',
      releasesThisYear: 18,
      mergedPrsLast30Days: 24,
    },
  },
];

export const mockIssues: Issue[] = [
  {
    id: 'issue-421',
    issueNumber: 421,
    title: 'Add loading state to UserCard',
    repository: 'shadcn/ui',
    repoId: 'shadcn-ui',
    labels: ['good first issue', 'react', 'typescript', 'components'],
    difficulty: 'Beginner',
    skillMatch: 94,
    descriptionPreview: 'The UserCard component renders immediately with fallback initials or empty spaces while user profile data is being fetched. We should introduce an isLoading prop that renders a polished Skeleton placeholder.',
    fullDescription: `### Problem Description
Currently, when \`<UserCard />\` is rendered inside dashboard grids and user lists, there is an awkward layout shift while asynchronous user data (avatar URL, display name, handle, role badge) is pending.

If \`user\` is undefined or null, callers currently have to write ternary checks and wrap raw \`<Skeleton />\` primitives manually.

### Expected Behavior
Introduce an optional \`isLoading?: boolean\` prop to \`<UserCard />\`.
When \`isLoading={true}\`:
1. The avatar circle displays a shimmering circular Skeleton with \`h-10 w-10 rounded-full\`.
2. The user title and email lines display text skeleton bars with fixed heights (\`h-4 w-28\` and \`h-3 w-36\`).
3. Appropriate ARIA accessibility attributes (\`aria-busy="true"\`, \`aria-live="polite"\`) are attached to the card container.
4. Existing tests pass and new unit test asserting the skeleton branch is added.

### Reproduction & Code Example
\`\`\`tsx
// Before (caller must manually branch)
{isLoading ? (
  <div className="flex items-center space-x-4 p-4 border rounded-lg">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-3 w-[100px]" />
    </div>
  </div>
) : (
  <UserCard user={data} />
)}

// Expected After
<UserCard user={data} isLoading={isLoading} />
\`\`\``,
    expectedBehavior: 'UserCard cleanly supports isLoading={true} by rendering consistent Skeleton placeholders with zero layout shift and proper ARIA accessibility markers.',
    reproductionSteps: [
      'Render <UserCard /> without user data passed.',
      'Notice layout flickers and absence of unified placeholder state.',
      'Verify that wrapping inside Skeleton manually is currently required in multiple consuming files.',
    ],
    codeSnippet: `export interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
  };
  isLoading?: boolean; // <-- Proposed addition
}`,
    whatYoullNeed: ['React components', 'useState & conditional rendering', 'TypeScript props interface', 'Skeleton primitives'],
    youAlreadyKnow: ['React component hierarchy', 'TypeScript interface extension', 'Tailwind flexbox utilities'],
    youShouldReview: ['Loading states & layout shift prevention', 'ARIA busy attributes on dynamic widgets'],
    filesToUnderstand: [
      {
        path: 'src/components/UserCard.tsx',
        lines: 'lines 12–48',
        role: 'Primary component implementation where the isLoading branch and Skeleton rendering must be integrated.',
        language: 'typescript',
        codeSnippet: `import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: {
    name: string
    email: string
    avatarUrl?: string
    role?: string
  }
  isLoading?: boolean
}

export function UserCard({ user, isLoading = false, className, ...props }: UserCardProps) {
  if (isLoading) {
    return (
      <div 
        className={cn("flex items-center gap-3 p-4 rounded-xl border border-neutral-200 bg-white", className)}
        aria-busy="true"
        aria-live="polite"
        {...props}
      >
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-3 p-4 rounded-xl border border-neutral-200 bg-white", className)} {...props}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
        <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
        <p className="text-xs text-neutral-500">{user?.email}</p>
      </div>
    </div>
  )
}`,
      },
      {
        path: 'src/components/UserList.tsx',
        lines: 'lines 24–65',
        role: 'Consuming parent component that renders a grid of UserCards with simulated pagination and loading state.',
        language: 'typescript',
        codeSnippet: `import { UserCard } from "./UserCard"

export function UserList({ users, isLoading }: { users: User[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <UserCard key={i} isLoading={true} />
        ))}
      </div>
    )
  }
  // ...
}`,
      },
      {
        path: 'src/hooks/useUser.ts',
        lines: 'lines 8–35',
        role: 'Custom hook that provides user profile data alongside an isLoading flag to consuming views.',
        language: 'typescript',
        codeSnippet: `import { useState, useEffect } from "react"

export function useUser(userId: string) {
  const [data, setData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulated fetch
    setIsLoading(true)
    fetchUserData(userId).then(res => {
      setData(res)
      setIsLoading(false)
    })
  }, [userId])

  return { data, isLoading }
}`,
      },
    ],
    preparationChecklist: [
      { id: 'prep-1', label: 'Understand React functional components and conditional JSX branches', checked: true },
      { id: 'prep-2', label: 'Understand props interface typing and default parameters', checked: true },
      { id: 'prep-3', label: 'Review loading states and accessibility attributes (aria-busy)', checked: false },
      { id: 'prep-4', label: 'Read related files (UserCard.tsx, UserList.tsx, useUser.ts)', checked: false },
      { id: 'prep-5', label: 'Understand existing component tests in __tests__/UserCard.test.tsx', checked: false },
    ],
    createdAt: '2 days ago',
    commentsCount: 6,
    author: {
      name: 'Sarah Chen',
      handle: 'sarahc-dev',
      avatar: '',
      role: 'Contributor',
    },
  },
  {
    id: 'issue-61240',
    issueNumber: 61240,
    title: 'Add active tab indicator aria-selected fallback for mobile view',
    repository: 'vercel/next.js',
    repoId: 'vercel-nextjs',
    labels: ['good first issue', 'typescript', 'accessibility', 'area: docs'],
    difficulty: 'Beginner',
    skillMatch: 91,
    descriptionPreview: 'The mobile navigation tabs inside the Next.js documentation reader fail to sync aria-selected state when swiping between tabs horizontally.',
    fullDescription: `### Problem
When inspecting the documentation sidebar tab group on viewports narrower than 768px, tab switches via touch scroll update visual styling but leave \`aria-selected="false"\` on the active child element.

### Proposed Fix
Ensure the intersection observer callback calls \`setActiveIndex()\` and updates DOM attribute \`aria-selected\` synchronously.`,
    expectedBehavior: 'Active tab state stays 100% in sync with ARIA screen reader attributes regardless of swipe or click navigation.',
    whatYoullNeed: ['React useEffect', 'Accessibility ARIA attributes', 'Touch event listeners'],
    youAlreadyKnow: ['React hooks', 'DOM event handlers'],
    youShouldReview: ['WAI-ARIA Tabs pattern standards'],
    filesToUnderstand: [
      {
        path: 'packages/next-docs/components/Tabs.tsx',
        lines: 'lines 45–90',
        role: 'Component managing tab strip state and ARIA properties.',
        language: 'typescript',
        codeSnippet: `// Tabs implementation with keyboard and mobile gesture listeners`,
      },
    ],
    preparationChecklist: [
      { id: 'prep-next-1', label: 'Read W3C WAI-ARIA tab navigation keyboard spec', checked: true },
      { id: 'prep-next-2', label: 'Locate packages/next-docs/components/Tabs.tsx in repo', checked: false },
      { id: 'prep-next-3', label: 'Run local pnpm test packages/next-docs', checked: false },
    ],
    createdAt: '3 days ago',
    commentsCount: 4,
    author: {
      name: 'Alex Rivera',
      handle: 'arivera',
      avatar: '',
      role: 'Maintainer',
    },
  },
  {
    id: 'issue-5120',
    issueNumber: 5120,
    title: 'Export inferProcedureOutput types in client helper module',
    repository: 'trpc/trpc',
    repoId: 'trpc-trpc',
    labels: ['good first issue', 'typescript', 'dx', 'types'],
    difficulty: 'Intermediate',
    skillMatch: 89,
    descriptionPreview: 'Users often need to extract procedure return types directly from AppRouter without importing internal package subpaths.',
    fullDescription: `Currently, developers who want to define a standalone variable typed to an API response have to use complex utility wrappers. Adding a dedicated top-level type helper \`inferRouterOutputs<TRouter>\` will simplify DX significantly.`,
    expectedBehavior: 'Export inferRouterOutputs in index.d.ts with type tests verifying inference behavior.',
    whatYoullNeed: ['TypeScript conditional types', 'Infer keyword in generics'],
    youAlreadyKnow: ['Basic TypeScript interfaces', 'Generic functions'],
    youShouldReview: ['TypeScript infer keyword in utility types'],
    filesToUnderstand: [
      {
        path: 'packages/server/src/core/router.ts',
        lines: 'lines 110–135',
        role: 'Where router types and output inference interfaces are constructed.',
        language: 'typescript',
        codeSnippet: `export type inferRouterOutputs<TRouter extends AnyRouter> = {
  [TKey in keyof TRouter['_def']['record']]: TRouter['_def']['record'][TKey] extends AnyProcedure
    ? inferProcedureOutput<TRouter['_def']['record'][TKey]>
    : never;
};`,
      },
    ],
    preparationChecklist: [
      { id: 'prep-trpc-1', label: 'Review TypeScript conditional types documentation', checked: true },
      { id: 'prep-trpc-2', label: 'Examine existing test-d type assertion test suites', checked: false },
    ],
    createdAt: '1 day ago',
    commentsCount: 8,
    author: {
      name: 'Alex Johansson',
      handle: 'KATT',
      avatar: '',
      role: 'Maintainer',
    },
  },
  {
    id: 'issue-18921',
    issueNumber: 18921,
    title: 'Add empty state illustration and retry button to Storage bucket explorer',
    repository: 'supabase/supabase',
    repoId: 'supabase-supabase',
    labels: ['good first issue', 'react', 'ui', 'tailwind', 'help wanted'],
    difficulty: 'Beginner',
    skillMatch: 95,
    descriptionPreview: 'When a freshly initialized storage bucket has no uploaded objects, the file table shows an empty blank gray area without guidance.',
    fullDescription: `### Problem
Navigating into a new bucket in Supabase Studio shows an empty table without any hint or prompt explaining how to drag and drop files or upload via API.

### Solution
Implement an empty state component with:
1. Clean folder/upload icon
2. "No files uploaded yet" heading
3. Secondary description with link to storage docs
4. "Upload first file" primary action button triggering file picker`,
    expectedBehavior: 'Informative, accessible empty state container with working file input trigger.',
    whatYoullNeed: ['React UI layout', 'Tailwind CSS classes', 'Empty state UX patterns'],
    youAlreadyKnow: ['React buttons & icons', 'Tailwind flexbox and borders'],
    youShouldReview: ['Accessible button click handlers & file input triggers'],
    filesToUnderstand: [
      {
        path: 'apps/studio/components/interfaces/Storage/StorageExplorer.tsx',
        lines: 'lines 140–190',
        role: 'Component rendering the bucket table and empty checks.',
        language: 'typescript',
        codeSnippet: `// Storage explorer table with conditional empty state fallback`,
      },
    ],
    preparationChecklist: [
      { id: 'prep-sb-1', label: 'Examine apps/studio UI guidelines', checked: true },
      { id: 'prep-sb-2', label: 'Verify clean empty state alignment', checked: false },
    ],
    createdAt: '4 days ago',
    commentsCount: 3,
    author: {
      name: 'Jon Meyers',
      handle: 'dijonmusters',
      avatar: '',
      role: 'Staff Engineer',
    },
  },
  {
    id: 'issue-28392',
    issueNumber: 28392,
    title: 'Clarify useDeferredValue error boundary documentation and examples',
    repository: 'facebook/react',
    repoId: 'facebook-react',
    labels: ['good first issue', 'documentation', 'react-19', 'beginner'],
    difficulty: 'Beginner',
    skillMatch: 88,
    descriptionPreview: 'The documentation for useDeferredValue does not specify how errors thrown during deferred rendering bubble up through nested Suspense or ErrorBoundary boundaries.',
    fullDescription: `The existing docs mention that useDeferredValue allows deferring updating a part of the UI. However, developers frequently ask whether errors thrown during deferred render pass to the closest error boundary or trigger fallback states.

We should add a concise explanation and a runnable interactive CodeSandbox example demonstrating the error boundary behavior with deferred values.`,
    expectedBehavior: 'Documentation page contains explicit section on Error Boundaries with deferred value lifecycles.',
    whatYoullNeed: ['React Suspense & Error Boundaries', 'Clear technical writing', 'Markdown formatting'],
    youAlreadyKnow: ['React component lifecycles', 'ErrorBoundary fundamentals'],
    youShouldReview: ['React 19 Concurrent rendering mechanics'],
    filesToUnderstand: [
      {
        path: 'docs/src/content/reference/react/useDeferredValue.md',
        lines: 'lines 85–120',
        role: 'Reference markdown file where the caveat section is expanded.',
        language: 'markdown',
        codeSnippet: `### Caveats with Error Boundaries
If a component suspended or threw an error while rendering a deferred value...`,
      },
    ],
    preparationChecklist: [
      { id: 'prep-fb-1', label: 'Read existing useDeferredValue reference docs', checked: true },
      { id: 'prep-fb-2', label: 'Verify Markdown links and lint rules', checked: false },
    ],
    createdAt: '5 days ago',
    commentsCount: 9,
    author: {
      name: 'Andrew Clark',
      handle: 'acdlite',
      avatar: '',
      role: 'Core Team',
    },
  },
  {
    id: 'issue-3412',
    issueNumber: 3412,
    title: 'Improve Markdown code block copy feedback tooltip animation',
    repository: 'withastro/astro',
    repoId: 'astro-astro',
    labels: ['good first issue', 'css', 'dx', 'components'],
    difficulty: 'Beginner',
    skillMatch: 93,
    descriptionPreview: 'When clicking the "Copy" icon button on code blocks in Astro Starlight documentation, the "Copied!" tooltip changes without a smooth exit transition.',
    fullDescription: `The copy button in Starlight code blocks provides instant feedback by changing icon and text to "Copied!". However, when the 2000ms timeout expires, the label cuts off abruptly without an exit fade.

Adding a smooth transition class will make the micro-interaction feel much more polished.`,
    expectedBehavior: 'Copy feedback transitions smoothly in and out with zero layout jank.',
    whatYoullNeed: ['CSS transitions', 'Micro-interactions', 'Vanilla TS DOM listener'],
    youAlreadyKnow: ['CSS opacity & transform transitions', 'DOM events'],
    youShouldReview: ['Accessible live regions for copy button feedback'],
    filesToUnderstand: [
      {
        path: 'packages/starlight/components/CodeBlock.astro',
        lines: 'lines 50–78',
        role: 'Astro component defining the copy button element and styles.',
        language: 'astro',
        codeSnippet: `// Starlight CodeBlock copy button styling & script`,
      },
    ],
    preparationChecklist: [
      { id: 'prep-astro-1', label: 'Inspect packages/starlight code block styling', checked: true },
      { id: 'prep-astro-2', label: 'Test across Chromium, Firefox, and WebKit', checked: false },
    ],
    createdAt: '1 day ago',
    commentsCount: 2,
    author: {
      name: 'Nate Moore',
      handle: 'natemoo-re',
      avatar: '',
      role: 'Core',
    },
  },
];
