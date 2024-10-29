# T3 Stack Authentication App

This project is a user authentication system built using the T3 stack, which includes Next.js, TypeScript, tRPC, Prisma, NextAuth, and Tailwind CSS. The main objective is to implement sign-up, login, and logout functionality with credential-based authentication using NextAuth, and to store session data in the database.

## Table of Contents

- [Objective](#objective)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Running the App Locally](#running-the-app-locally)
- [Deployment](#deployment)


## Objective

The goal of this assignment is to build a basic credential-based authentication system that supports user registration and login using email and password. User sessions are stored in the database to maintain persistence between sessions.

## Features

- **Sign-up**: New users can create an account using an email and password.
- **Login**: Existing users can log in with their credentials.
- **Session Management**: User sessions are saved to the database, ensuring that session data persists between sessions.
- **Password Hashing**: User passwords are securely hashed before being saved to the database.
- **Google OAuth**: Option to sign in with Google OAuth.

## Tech Stack

- **Next.js** - React-based framework for building web applications.
- **TypeScript** - Adds type safety to JavaScript, making code more robust.
- **tRPC** - Enables type-safe communication between client and server.
- **Prisma** - ORM used to interact with the database.
- **NextAuth** - Handles authentication with credential-based and optional Google OAuth support.
- **Tailwind CSS** - Utility-first CSS framework for styling the app.

## Getting Started

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/talha-ansarii/t3-assignment.git
    cd t3-assignment
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

## Database Schema

This schema defines the database of User model for the T3 Stack Authentication Project.

```prisma
    model User {
    id            String    @id @default(cuid())
    name          String?
    email         String    @unique
    emailVerified DateTime?
    password      String?
    image         String?
    accounts      Account[]
    sessions      Session[]
    }
```

## Running the App Locally

1. **Migrate Prisma Tables**
    ```bash
    npx prisma migrate dev --name initial-state
    npx prisma generate
    ```


2. **Configure Environment Variables** :  
   Create a `.env` file at the root of your project and add the following environment variables:

   ```plaintext
   DATABASE_URL = "your postgres database connection url"
   NEXTAUTH_SECRET = "your nextauth secret"
   NEXTAUTH_URL = "http://localhost:3000" # Adjust if deploying
   GOOGLE_CLIENT_ID = "your google client id"
   GOOGLE_CLIENT_SECRET = "your google client secret"
   NODE_ENV = "node environment - development or production"
   ```

3. **Run the Development Server**:
    ```bash
        npm run dev
    ```
The app will be available at http://localhost:3000.

## Deployment 
Deployed on vercel.

``https://t3-assignmentt.vercel.app/``

