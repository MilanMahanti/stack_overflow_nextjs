# 🌐 DevFlow

DevFlow is a **Next.js-based platform** designed to connect and empower developers. It’s a **Stack Overflow-like application** where users can ask and answer technical questions, save valuable resources, and explore job opportunities—all in one place. DevFlow features an intelligent AI assistant, **Gemini AI**, to generate helpful answers, a **WYSIWYG editor** for better question formatting, and a **user activity-based recommendation system** to enhance the experience.

---

## 🚀 Features

### 💡 Core Functionalities

- **Post Questions & Answers**: Share knowledge and engage with the community by posting questions and providing answers. ✍️
- **Save Questions & Answers**: Bookmark important content for future reference. 🔖
- **Global Search**: Effortlessly search across the platform with our extensive global search feature. 🌎
- **AI Answer Generation**: Leverage **Gemini AI** to generate contextually relevant answers. 🤖

### 🎨 Enhanced User Experience

- **WYSIWYG Editor**: Create well-formatted questions and answers with an easy-to-use text editor. 🖋️
- **Dark Mode**: Enjoy a sleek, eye-friendly dark mode. 🌙
- **Badge System**: Earn badges based on your contributions and interactions with the platform. 🏅
- **User Recommendations**: Discover personalized recommendations based on your activity. 🔍
- **Job Search**: Explore job listings to find your next career opportunity. 💼

---

## 🛠️ Tech Stack

### 🖥️ Frontend

- **Next.js**: Scalable and performant React-based frontend framework.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Radix UI**: Accessible and reusable components.

### 🌐 Backend

- **MongoDB**: NoSQL database for flexible and scalable data management.

### 🔐 Authentication

- **Clerk**: A robust authentication system supporting Google, GitHub, and credentials-based login.

### 🤖 AI Integration

- **Gemini AI**: AI-powered solution for generating intelligent answers to user questions.

---

## 🛳️ Setup Instructions

### ✅ Prerequisites

1. Node.js (>= 18)
2. MongoDB Database

### 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/devflow.git
   cd devflow
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Create a `.env` file in the root directory.
   - Add the following keys:
     ```env
     DATABASE_URL=your_database_url
     NEXTAUTH_URL=your_nextauth_url
     NEXTAUTH_SECRET=your_nextauth_secret
     CLERK_FRONTEND_API=your_clerk_frontend_api
     CLERK_API_KEY=your_clerk_api_key
     GEMINI_AI_KEY=your_gemini_ai_key
     ```

4. Start the development server:

   ```bash
   npm run dev
   ```

---

## 📜 Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm start`: Run the production server.
- `npm run lint`: Lint the codebase.

---

## 📦 Key Dependencies

### 🧩 Core Libraries

- [Next.js](https://nextjs.org/): Frontend framework.
- [Tailwind CSS](https://tailwindcss.com/): CSS framework for styling.
- [Radix UI](https://www.radix-ui.com/): UI component library.

### 🔐 Authentication

- [Clerk](https://clerk.dev/): Authentication platform.

### 🗄️ Database

- [MongoDB](https://www.mongodb.com/): NoSQL database.

### ✍️ Editor

- [TinyMCE](https://www.tiny.cloud/): Rich text editor.

### 🤖 AI Integration

- [Gemini AI](https://gemini.ai): AI-powered answer generation.

---

## 🙏 Acknowledgements

Special thanks to **JavaScript Mastery** for inspiring and guiding me during this project. Through their tutorials, I gained:

- A deep understanding of Next.js and state management.
- Expertise in building scalable and user-friendly web applications.
- Best practices for integrating third-party services and APIs.

Check out [JavaScript Mastery](https://www.javascriptmastery.com/) for incredible learning resources! 🚀

---

## 📞 Contact

For inquiries or contributions, feel free to contact:

- **Email**: [Milanmahanti16@gmail.com](mailto:milanmahanti16@gmail.com)

