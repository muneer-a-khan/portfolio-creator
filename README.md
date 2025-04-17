# InstantDevPortfolios

A web application that allows CS students and bootcamp graduates to create professional developer portfolios instantly, with GitHub integration and customization options.

## Features

- **One-time Purchase**: $10 for lifetime access
- **GitHub Integration**: Import your projects directly from GitHub
- **Customizable Themes and Layouts**: Multiple design options
- **Portfolio Editor**: User-friendly customization interface
- **Export to Static Site**: Download your portfolio as a deployable ZIP file
- **Deployment Instructions**: Guides for GitHub Pages, Netlify, Vercel, and more

## Tech Stack

### Frontend
- Next.js (App Router) with TypeScript
- TailwindCSS + ShadCN UI components
- React Hook Form + Zod for validation
- Auth.js for authentication (Email + OAuth)
- Zustand for state management
- UploadThing for file uploads

### Backend
- Next.js API Routes
- PostgreSQL (via Prisma ORM)
- Supabase Storage for file storage
- Stripe for payments

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio-creator.git
cd portfolio-creator
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio-creator"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Supabase/Storage
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to http://localhost:3000

## Production Deployment

The application can be deployed to Vercel with the following steps:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
