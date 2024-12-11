#Social Media App

A feature-rich social media application built with React, TypeScript, GraphQL, and Tailwind CSS. The app includes functionalities like user authentication, news feed, posting, following/unfollowing, and more.

#Features

#User Login:

Secure sign-up and login using Firebase Auth.

#News Feed:

Displays posts from users you follow.

Infinite scrolling for a smooth user experience.

Posting:

Create new posts with text and images.

Tag other users in posts.

Follow and Unfollow:

Follow and unfollow users to customize your feed.

TypeScript for Safety:

Strongly typed code to ensure reliability and minimize bugs.

Styling with Tailwind CSS:

Responsive and modern design.

Technologies Used

Frontend: React, TypeScript, Tailwind CSS

GraphQL Client: Apollo Client

Backend: Supabase (GraphQL Endpoint)

Authentication: Firebase Auth

Getting Started

Prerequisites

Ensure you have the following installed:

Node.js (>=14)

npm or yarn

Installation

Clone the repository:

git clone https://github.com/your-username/social-media-app.git
cd social-media-app

Install dependencies:

npm install

Configure Firebase Authentication:

Create a Firebase project and enable Email/Password authentication.

Copy your Firebase configuration and paste it into a firebaseConfig.ts file.

Configure Supabase:

Set up a Supabase project and database tables for users, posts, and follows.

Use the auto-generated GraphQL API URL and configure it in the Apollo Client setup.

Start the development server:

npm run dev

Project Structure

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

Scripts

npm run dev: Start the development server.

npm run build: Build the app for production.

npm run preview: Preview the production build.

Deployment

Deploy the app on platforms like Vercel, Netlify, or your preferred hosting service. Ensure you set up environment variables for Firebase and Supabase configurations.

Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

Fork the repository.

Create your feature branch:

git checkout -b feature-name

Commit your changes:

git commit -m 'Add some feature'

Push to the branch:

git push origin feature-name

Open a pull request.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgements

Vite

Tailwind CSS

Supabase

Firebase

Apollo Client

