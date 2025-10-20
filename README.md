# 🧙‍♂️ SideQuest — AI-Powered Interactive Story Builder for Kids

[![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)](https://www.python.org/)  
[![Django](https://img.shields.io/badge/Django-Backend-darkgreen?logo=django)](https://www.djangoproject.com/)  
[![React](https://img.shields.io/badge/React-Frontend-blue?logo=react)](https://react.dev/)  
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-lightblue?logo=postgresql)](https://www.postgresql.org/)  
[![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-orange?logo=google)](https://ai.google.dev/gemini-api)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**SideQuest** is an interactive storytelling platform where kids co-create stories with AI — writing new lines, visualizing them with generated images, and branching their stories into infinite creative paths.  
Built with a **Django backend**, **React frontend**, and powered by the **Google Gemini API** for text and image generation.

---

## 📌 Features

- **Interactive Story Creation**
  - Kids receive an AI-generated prompt or start their own story.
  - Each time they add to the story, the AI continues it and generates a matching image.
  - At the end, all story frames are compiled into a **digital comic book**.

- **Library & Story Management**
  - Stores all the user’s stories in a personal library.
  - Stories can be revisited, viewed, and expanded later.

- **Branching SideQuests**
  - Users can select any story cell and **branch** from that point, creating alternate storylines.
  - Each branch copies the existing story and adds new AI-generated continuations.
  - Encourages imagination and storytelling depth.

- **AI Image & Text Generation**
  - Uses **Google Gemini API** for creative text generation and visual art.
  - Ensures the story flow and images align with a kid-friendly narrative.

- **Comic Compilation**
  - Automatically generates a **comic book** view from the story and images.
  - Each panel represents a chapter or event.

---

## 🛠 Tech Stack

- **Frontend**: React (JavaScript, TailwindCSS)  
- **Backend**: Django (Python)  
- **Database**: PostgreSQL  
- **AI Integration**: Google Gemini API (text + image generation)  
- **Hosting (Future)**: Render / Vercel (optional for demo)  

---

## 📂 Project Structure

```bash
/SideQuest
│
├── Django-Backend
│   ├── manage.py
│   ├── sidequest_backend/
│   ├── api/
│   └── requirements.txt
│
├── frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── main/
│── db.sqlite3
│── package-lock.json
│── package.json
│── test.py
│── venv/
│── .gitignore
│── LICENSE
│── README.md
