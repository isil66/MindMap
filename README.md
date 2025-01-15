# MindMap: Web Application for Project Management

This web application is a hybrid between Google Docs, Notion, and Figma, designed to track and organize information in a linear fashion. It allows users to visualize smaller pieces of information as sticky notes that are related to one another and displayed in a mind map format. Information can be separated into different projects, and connections can be created between different projects or within the same project.

## Features

- **Linear Page Layout**: Information is organized across continuous pages.
- **Sticky Notes**: Smaller pieces of information are represented as sticky notes.
- **Mind Map Visualization**: Sticky notes are visualized as leaves on a tree structure.
- **Project Separation**: Allows users to organize data into separate projects.
- **Inter-Project Connections**: Enables users to link information between different projects.
- **Feedback**: The tool has received positive feedback from software engineers and is suggested to be used for project management.

## Folder Structure

- **`server/`**: Django backend for handling data and server-side logic.
- **`client/`**: Next.js frontend application for rendering the user interface.

## Setup

### Backend (Django)

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```

2. Run the Django server:
   ```bash
   python manage.py runserver
   ```

### Frontend (Next.js)

1. Navigate to the `client` folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the Next.js development server:
   ```bash
   npm run dev
   ```

## Usage

Once the application is set up, you can access it through your browser. The frontend will handle user interactions, while the backend will manage data storage and processing.
