# DRIVE-CE (Google Drive Clone)

## Description

DRIVE-CE is a simplified clone of Google Drive, created with Next.js, TypeScript, Convex, and Clerk. It aims to replicate the core features of Google Drive in a straightforward manner.

## Features

- Authentication
- Organizations
- File Upload
- Role Based Authorization
- Trash Functionality

## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Important](#important)
- [Environment Variables](#environment-variables)
- [Starting the Development Server](#starting-the-development-server)
- [Contributing](#contributing)
- [Live Preview](#live-preview)

## Tech Stack

- Next.js
- Tailwind CSS
- TypeScript
- Clerk
- Convex

## Installation

Make sure you have Node.js installed on your machine.

Clone the repository:

```bash
git clone https://github.com/nyintosh/drive-ce.git
```

Navigate to the project directory:

```bash
cd drive-ce
```

Install dependencies:
Run one of the following commands based on your preferred package manager:

- Using npm:

```bash
npm install
```

- Using yarn:

```bash
yarn install
```

- Using pnpm:

```bash
pnpm install
```

## Important

Additionally, you need to set up projects in Convex and Clerk to run this locally.

## Environment Variables

This project requires the following environment variables:

- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`

Make sure to set these environment variables in your development environment.

## Starting the Development Server

To start the development server:
Run one of the following commands based on your preferred package manager:

- Using npm:

```bash
npm run dev
```

- Using yarn:

```bash
yarn dev
```

- Using pnpm:

```bash
pnpm dev
```

Open your browser and navigate to http://localhost:3000 to see the app live.

## Contributing

We welcome contributions! If you'd like to contribute to GEMINI-CE, please follow these guidelines:

- Fork the repository
- Create a new branch
- Make your changes
- Submit a pull request

## Live Preview

You can preview the live version of the project at [https://drive-ce.vercel.app](https://drive-ce.vercel.app).
