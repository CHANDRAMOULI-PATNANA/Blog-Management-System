# Blog Management System

## Description
This is a RESTful API for a Blog Management System with user authentication, role-based access control, and blog management functionalities.

## Features
- User Management:
  - Sign up and log in using authentication.
  - Send a verification link to the user’s email address (bonus).
  - Users must verify their email before accessing private APIs (bonus).
- Role-Based Access Control:
  - Roles: Admin, Editor, User.
  - Admin:
    - Can create, edit, or delete blogs.
    - Can assign blogs to an editor (bonus).
  - Editor:
    - Can only edit blogs assigned to them by an admin (bonus).
  - User:
    - Can view blogs and its comments.
    - Can delete their own comments.
- Blog Management:
  - Each blog post includes:
    - Title (required).
    - Content (required).
- Comment Management:
  - Users can add comments to blog posts.
  - Users can delete their own comments.

## Technical Requirements
- Framework: Express.js
- Database: MongoDB

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/blog-management-system.git
   cd blog-management-system