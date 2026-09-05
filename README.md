<div align="center">

LEETCHECK

AI-POWERED LEETCODE PROFILE ROASTER

Your LeetCode profile. Your stats. Your roast.






</div>

WHAT IS LEETCHECK?

LeetCheck is an AI-powered LeetCode profile roaster.

Enter a LeetCode username and LeetCheck analyzes their public profile — including solved problems, difficulty distribution, contest performance, badges, and activity — then turns those stats into a personalized AI roast.

Because sometimes your LeetCode stats deserve more than a progress bar.

HOW IT WORKS

        LEETCODE USERNAME
                │
                ▼
       ┌─────────────────┐
       │ LeetCode GraphQL│
       │       API       │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ Profile Stats   │
       │ Contest • Badges│
       │ Solved • Activity│
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │    GROQ LLM     │
       │  AI Roast Engine│
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ PERSONALIZED    │
       │      ROAST      │
       └────────┬────────┘
                │
                ▼
          FINAL VERDICT

FEATURES

Feature

Description

Profile Lookup

Search a LeetCode username

Problem Stats

View total solved problems

Difficulty Breakdown

Easy, Medium & Hard distribution

Contest Stats

Rating, ranking & contest performance

Badges

Display earned LeetCode badges

Activity

Analyze available profile activity

AI Roast

Generate a personalized roast with Groq

Final Verdict

Get the ultimate judgment on the profile

TECH STACK

FRONTEND

React

Vite

Tailwind CSS

BACKEND

Python

FastAPI

Uvicorn

uv

AI

Groq

openai/gpt-oss-120b

DATA

LeetCode GraphQL API

PROJECT STRUCTURE

LeetCheck/
│
├── backend/
│   └── app/
│       ├── api/
│       ├── core/
│       ├── models/
│       ├── services/
│       │   ├── leetcode.py
│       │   └── llm.py
│       └── main.py
│
├── frontend/
│
├── .gitignore
└── README.md

RUN LOCALLY

1. Clone the repository

git clone https://github.com/hiresh123ydv/LeetCheck.git
cd LeetCheck

2. Start the backend

cd backend
uv sync

Create backend/.env:

GROQ_API_KEY=your_groq_api_key

Run FastAPI:

uv run uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

3. Start the frontend

Open another terminal:

cd frontend
npm install
npm run dev

API

Analyze a LeetCode Profile

GET /analyze/{username}

Example:

GET /analyze/hiresh_ydv

The endpoint fetches the user's LeetCode profile data and generates an AI-powered roast.

ENVIRONMENT VARIABLES

The backend requires:

GROQ_API_KEY=your_groq_api_key

Never commit .env files or API keys to GitHub.

THE IDEA

Most developer profiles show you how good someone is.

LeetCheck shows you how roastable they are.

SOLVED PROBLEMS
      +
CONTEST PERFORMANCE
      +
BADGES & ACTIVITY
      ↓
   AI ANALYSIS
      ↓
   THE ROAST

DISCLAIMER

LeetCheck is an entertainment project.

The generated roasts are AI-generated and are intended for fun. Profile information is based on publicly available LeetCode data.

<div align="center">

<b>BUILT BY HIRESH YADAV<b>

