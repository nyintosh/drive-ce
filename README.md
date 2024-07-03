# DRIVE (CE)

<img width="1408" alt="SCR-20240703-khcm" src="https://github.com/nyintosh/drive-ce/assets/56629705/c793c2e7-34cf-4a64-b724-94dc6a642593">

## Description

A simplified version of Google Drive, created with Next.js, TypeScript, Convex, and Clerk. It aims to replicate the core features of Google Drive in a straightforward manner.

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
git version of https://github.com/nyintosh/drive-ce.git
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

To run this locally, ensure you have set up projects in Convex and Clerk, and configured webhooks accordingly.

## Environment Variables

This project requires the following environment variables:

- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Make sure to set these environment variables in your development environment.

> Additionally, you need to set these environment variables in Convex:

- `CLERK_HOSTNAME`
- `CLERK_WEBHOOK_SECRET`

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

If you want to add additional features and improvements, we welcome contributions! Please follow these guidelines:

- Fork the repository
- Create a new branch
- Make your changes
- Submit a pull request

## Live Preview

You can preview the live version of the project at [https://drive-ce.vercel.app](https://drive-ce.vercel.app).
