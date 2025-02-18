# Social Media Application

## Architecture

### System Overview
- **Frontend:** Uses **EJS (Embedded JavaScript)** for dynamic rendering on the server-side
- **Backend:** Built with **Node.js and Express.js** to handle requests
- **Database:** Uses **MongoDB** for storing user profiles, posts, and interactions
- **File Storage:** **Multer** is used for handling image uploads
- **Authentication:** **JWT-based authentication** for user sessions
- **Security Measures:** Uses input validation and hashed passwords

### Frontend Components
- EJS (Embedded JavaScript) for dynamic rendering
- Server-side templating
- Responsive design

### Backend Infrastructure
- Node.js and Express.js for server operations
- RESTful API structure
- MongoDB for data persistence

### Core Features
- User authentication using JWT
- Post creation and management
- Story functionality
- Image upload support using Multer
- Secure password hashing

## Project Structure
```
himanshu181749-social-media/
├── README.md
├── app.js
├── app.test.js
├── package.json
├── models/
│   ├── post.js
│   ├── story.js
│   └── user.js
├── public/
│   ├── images/
│   └── readme/
│       └── socials.mkv
└── views/
    ├── error.ejs
    ├── homepage.ejs
    ├── login.ejs
    ├── profile.ejs
    ├── register.ejs
    ├── stories.ejs
    └── userposts.ejs
```

![Application Architecture](https://github.com/user-attachments/assets/2a8f44e6-8933-45fe-b11d-4415a0242353)
