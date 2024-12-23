# Social Media App
https://news-posts-wheat.vercel.app/home

A feature-rich social media application built with React, TypeScript, GraphQL, and Tailwind CSS. The app includes functionalities like user authentication, news feed, posting, following/unfollowing, and more.

## Features

- **User Login:**
  - Secure sign-up and login using Firebase Auth.

- **News Feed:**
  - Displays posts from users you follow.
  - Infinite scrolling for a smooth user experience.

- **Posting:**
  - Create new posts with text and images.
  - Tag other users in posts.

- **Follow and Unfollow:**
  - Follow and unfollow users to customize your feed.

- **TypeScript for Safety:**
  - Strongly typed code to ensure reliability and minimize bugs.

- **Styling with Tailwind CSS:**
  - Responsive and modern design.

## Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS
- **GraphQL Client:** Apollo Client
- **Backend:** Supabase (GraphQL Endpoint)
- **Authentication:** Firebase Auth

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (>=14)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shekhar-2410/Social_media.git
   cd Socail_media
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase Authentication:
   - Create a Firebase project and enable Email/Password authentication.
   - Copy your Firebase configuration and paste it into a `firebaseConfig.ts` file.

4. Configure Supabase:
   - Set up a Supabase project and database tables for `users`, `posts`, and `follows`.
   - Use the auto-generated GraphQL API URL and configure it in the Apollo Client setup.

5. Start the development server:
   ```bash
   npm run dev
   ```

### Project Structure

```
.
├── public          # Static assets
├── src             # Source code
│   ├── components  # Reusable components
│   ├── graphql     # Queries and mutations
│   ├── pages       # Page components
│   ├── styles      # Tailwind CSS styles
│   └── utils       # Helper functions
├── tailwind.config.js
├── vite.config.ts  # Vite configuration
└── package.json
```

## Scripts
- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run preview`: Preview the production build.

## Deployment

Deploy the app on platforms like Vercel, Netlify, or your preferred hosting service. Ensure you set up environment variables for Firebase and Supabase configurations.

## Acknowledgements

- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Firebase](https://firebase.google.com/)
- [Apollo Client](https://www.apollographql.com/docs/react/)

