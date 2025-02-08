# MERN Stack Recipe App

A full-stack **MERN Recipe App** that allows users to **create, update, delete, and generate recipes using AI**. Features **JWT authentication**, user-specific recipes, and image generation with OpenAI's DALL·E.

---

## Features
- 🔑 **User Authentication (Signup/Login/Logout)**
- 📜 **CRUD Operations**
- 🤖 **AI Recipe Generation (GPT-4o + DALL·E Image Generation)**
- 🖼️ **Custom Recipe Images**
- 🛠️ **Protected API Routes with JWT**
- 🎨 **Bootstrap-based UI**

---

## Tech Stack
- **Frontend:** React, Bootstrap
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT
- **AI Integration:** OpenAI GPT-4o, DALL·E

---

## Setup Instructions

### 1️⃣ Clone the Repository

```
git clone https://github.com/joegery/recipes.git
cd recipes
```

🔹 Backend Setup
📂 Navigate to Backend

```
cd backend
```

📌 Install Dependencies

```
npm install
```

Create a .env file in backend folder with this format, fill it out with your corresponding information, you will have to make a MongoDB database and create a connection string. You will also have to use your own OpenAI API key

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_api_key
PORT=5000

▶️ Start the Backend

```
npm start
```

The backend will start on http://localhost:5000.

🔹 Frontend Setup
📂 Navigate to Frontend

```
cd ../frontend
```

📌 Install Dependencies

```
npm install
```

▶️ Start the Frontend

```
npm start
```

The frontend will start on http://localhost:3000.

🔑 Authentication
Sign up on the login page.
Login with the created account.
Token-based authentication ensures users can only access their own recipes.
Logout button allows users to clear their session.

🤖 AI Recipe Generation
Click "Generate Recipe with AI".
Enter a recipe idea (e.g., "Spaghetti Bolognese").
AI will generate a recipe with a generated image.
The recipe is saved to your account.