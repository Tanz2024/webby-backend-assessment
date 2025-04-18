# NestJS Blog Management API

A clean, production-ready GraphQL API built with **NestJS**, **Prisma**, and **PostgreSQL**. This project is a practical backend system built using modular design principles. It includes user authentication, post and tag operations, profile management, and follows the CQRS pattern for clean separation of logic. It was developed as part of a technical assessment for a backend developer role.

---

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. Tech Stack](#2-tech-stack)
- [3. Features](#3-features)
- [4. Setup Instructions](#4-setup-instructions)
- [5. GraphQL API Usage](#5-graphql-api-usage)
  - [Mutations](#mutations)
  - [Queries](#queries)
  - [Validation Rules](#validation-rules)
- [6. Known Challenges and Fixes](#6-known-challenges-and-fixes)
- [7. Database Schema](#7-database-schema)
- [8. Postman/Insomnia Export](#8-postmaninsomnia-export)
- [9. License](#9-license)
- [10. Contact](#10-contact)

---

## 1. Introduction

This is a backend application built for managing users, blog posts, and tags through a robust GraphQL API. It follows best practices in modular backend design, including CQRS, schema-first database modeling, and token-based authentication.

---

## 2. Tech Stack

- **Backend Framework:** NestJS (TypeScript)
- **API Layer:** GraphQL (code-first)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (access token)
- **Architecture:** CQRS (Command Query Responsibility Segregation)
- **Validation:** `class-validator`

---

## 3. Features

### Account Management

- Register a new user account
- Log in using username and password (JWT-based authentication)
- View own profile (requires authentication)
- Update profile (bio, avatar URL)
- Change password (old + new password)
- Delete own account (authenticated route)

### Post Management (Requires Authentication)

- Create a new post with title, content, and tag IDs
- View a list of all posts by the authenticated user
- View all posts (publicly accessible endpoint)
- Update a post (only by the post owner)
- Delete a post (only by the post owner)

### Tag Management

- Create new tags (no authentication required)
- View all tags (publicly accessible)
- Tags are reusable and can be linked to multiple posts
- Tags are case-insensitive and normalized on creation

---

## 4. Setup Instructions

- Clone the repositorygit clone https://github.com/Tanz2024/webby-backend-assessment.git

- Navigate into the project directorycd webby-backend-assessment

- Install dependencies: npm install

- Create a .env file in the root directory and configure:

- DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<your_database>
- JWT_SECRET=your_jwt_secret_here

- Run database migrationsnpx prisma migrate dev

- Start the development servernpm run start:dev

- Open GraphQL Playground: Visit: http://localhost:3000/graphql
  
## 5. Graphql-api-usage

### Mutations

- register(data: RegisterInput) – Register a new user account

![image](https://github.com/user-attachments/assets/ed1baf4a-cf67-419c-b0e4-f94e3c8fc55f)

- login(data: LoginInput) – Log in with credentials

![image](https://github.com/user-attachments/assets/4104ec18-6be4-4076-aabb-15eba90c4d80)

- updateProfile(bio: String, avatarUrl: String) – Edit user bio and avatar -Authorization token needed !

![image](https://github.com/user-attachments/assets/66e93fc0-11c9-423d-bd35-4a1370bdcecf)

- changePassword(oldPassword: String, newPassword: String) – Change current password

![image](https://github.com/user-attachments/assets/73a2e89f-1513-45ba-8872-2924574bc4b3)

- deleteUser() – Permanently remove own account

- createPost(data: CreatePostInput) – Publish a new blog post - Tag ID compulsory

 ![image](https://github.com/user-attachments/assets/5c39d3c8-7e45-4af7-bb27-05685af44dae)

- updatePost(id: String, data: UpdatePostInput) – Edit an existing post - Post ID compulsory

![image](https://github.com/user-attachments/assets/510513d3-3768-41b8-af36-90c012bca22b)

- deletePost(id: String) – Remove an authored post

- createTag(data: CreateTagInput) – Create a new tag entry

![image](https://github.com/user-attachments/assets/93b45b8a-eb14-4223-8cff-cf5c88222065)

### Queries

- getMyProfile() – Fetch authenticated user's profile

![image](https://github.com/user-attachments/assets/97f9ff06-f865-451a-88b5-84838f6aa9a8)

- getMyPosts() – Retrieve all posts authored by the current user

- allPosts() – View all posts (public)

- allTags(order: asc | desc) – Fetch tags with optional sort order

### Validation Rules

- Email Format: Must use a valid format

- Unique Username: Username cannot duplicate existing users

- Password Strength: Minimum 6 characters with basic complexity

- Post Title: Must be between 5–100 characters

- Auth Required: Sensitive actions like edit, delete, and post require valid JWT

- Ownership Check: Only post creators can modify or delete their content

- Normalized Tags: Tag names are saved in lowercase, must be unique

- Profile Fields: Bio and avatar URL must be properly formatted strings

## 6. Known Challenges and Fixes

- Duplicate user errors:
  Handled Prisma errors to clearly show if a username or email is already taken.

- Post ownership checks:
  Ensured only the post creator can edit or delete their posts using service-level checks and guards.

- Input validation:
  Added class-validator rules to catch things like short passwords or missing fields.

- Safe error responses:
  Customized GraphQL errors to hide internal details and return cleaner messages.

- Schema consistency:
  Kept GraphQL schema and database models in sync by auto-generating schema.gql.

## 7. Database Schema

The application uses the following models:

- User: One-to-one with UserProfile, one-to-many with Post

- UserProfile: Bio and avatar URL for each user

- Post: Authored by a user, linked to tags via PostTag

- Tag: Shared across posts

- PostTag: Join table for Post and Tag

- Schema located in: prisma/schema.prisma.

## 8. Postman/Insomnia Export

A Postman or Insomnia collection is optional but encouraged. You may request an export file for local API testing.

## 9.  License

This project is open-source and licensed under the [MIT License](./LICENSE).

## 10.  Contact

If you have any questions, please raise an issue or contact us at tanzimbinzahir2019@gmail.com.
