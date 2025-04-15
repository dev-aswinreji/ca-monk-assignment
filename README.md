# React Fill-in-the-Blanks Quiz App

This project is a React JS application that presents a fill‑in‑the‑blanks quiz. Users answer quiz questions where each blank is evaluated separately. The app saves user responses in localStorage to persist state even on refresh and then displays a detailed quiz review with an overall score calculated from the number of correct blanks.

## Features

- **Fill-in‑the‑blanks Quiz:**  
  Users answer questions by selecting options to fill missing words in sentences.

- **Per‑Blank Evaluation:**  
  Each answer blank is checked individually (case-insensitive, with trimmed input) to compute an overall percentage score.

- **State Persistence:**  
  Quiz state (current question, timer, answers, etc.) is stored in localStorage so that refreshing the page does not restart the quiz.

- **Quiz Review Screen:**  
  After finishing the quiz or on quitting, users are taken to a review page that shows:
  - The complete prompt with the correct answer filled in.
  - The user's answers and an indicator ("Correct" or "Incorrect").
  - An overall score displayed in an ellipse.

- **Responsive Design:**  
  The UI is built with Tailwind CSS for a pixel-perfect design that matches provided specifications.

## Technologies Used

- **React JS**  
- **TypeScript**
- **React Router**
- **Tailwind CSS**  
- **LocalStorage API**

## Getting Started

### Prerequisites

Ensure you have Node.js (>= 14.x) and Yarn or npm installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/react-quiz-app.git
   cd react-quiz-app

