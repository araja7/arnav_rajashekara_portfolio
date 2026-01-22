# Arnav Rajashekara - Portfolio

A modern, responsive portfolio website showcasing my work, skills, and experience as a Software Engineer and Data Scientist.

## Features

- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Fully responsive across all device sizes
- **Dark Mode**: Theme toggle for light/dark mode
- **Contact Form**: Integrated contact form with email functionality via Resend
- **Project Showcase**: Display of featured projects with descriptions and tech stacks
- **Resume Download**: Direct access to downloadable resume
- **SEO Optimized**: Meta tags and Open Graph support

## Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **React Router** - Client-side routing
- **shadcn/ui** - High-quality component library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

## Getting Started

### Prerequisites

- Node.js (v18 or higher) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd arnav_rajashekara_portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```sh
# Create a production build
npm run build

# Preview the production build
npm run preview
```

## Contact Form Setup

The contact form uses a Vercel serverless function with Resend for email delivery. To set it up:

1. **Get a Resend API key:**
   - Sign up at [resend.com](https://resend.com)
   - Create an API key in your dashboard

2. **Configure environment variables in Vercel:**
   - Go to your Vercel project settings
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     - `RESEND_API_KEY`: Your Resend API key
     - `CONTACT_EMAIL`: (Optional) Your email address (defaults to the email in `src/lib/content.ts`)

That's it! The contact form will now send emails when users submit messages.

**Optional - Custom sender email (if you have a domain):**
   - If you have your own domain, you can verify it in Resend and update the `from` field in `api/contact.ts` to use your domain email (e.g., `'Portfolio Contact Form <contact@yourdomain.com>'`)
   - Without a domain, the form uses `onboarding@resend.dev` which works perfectly fine!

## Deployment

This project is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy on push.

### Custom Domain

You can connect a custom domain in your Vercel project settings under the Domains section.

## Project Structure

```
├── api/              # Serverless functions (Vercel)
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── lib/          # Utilities and content
│   └── hooks/        # Custom React hooks
└── vercel.json       # Vercel configuration
```

## Customization

All portfolio content (bio, projects, skills, etc.) can be edited in `src/lib/content.ts`. Simply update the exported objects to customize your portfolio.

## License

This project is private and proprietary.
