# Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for running the app on mobile devices)
- A Supabase account

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bounce-bolt/bounce-social
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   
   Get these values from your [Supabase project settings](https://supabase.com/dashboard).

4. **Start the development server**
   ```bash
   npx expo start
   ```
   Once the server is running, you'll see:
   - A QR code in the terminal, which you can scan with the Expo Go app on your mobile device 
   - A link to run the app in a web browser

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@/*` - Root directory
- `@components/*` - src/components
- `@ui/*` - src/components/ui
- `@features/*` - src/components/features
- `@services/*` - src/services
- `@contexts/*` - src/contexts
- `@hooks/*` - src/hooks
- `@config/*` - src/config
- `@utils/*` - src/utils
- `@types/*` - src/types
- `@mocks/*` - src/__mocks__

