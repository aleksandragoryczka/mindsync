# mindsync

This repository contains a full-stack web application developed using Angular for the frontend and Spring Boot for the backend. The frontent part is organized within an Nx workspace for efficient development and further scalability.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Database (Docker)](#database-docker)
  - [Backend (Spring Boot)](#backend-spring-boot)
  - [Frontend (Angular)](#frontend-angular)
- [Interfaces Examples](#interfaces-examples)

## Prerequisites

Before getting started, make sure you have the following software installed on your system:

- Node.js and npm for Angular development.
- Java Development Kit (JDK) and Maven for Spring Boot.
- Docker for running the database container.

## Getting Started

Follow these steps to set up and run the application locally.

### Database (Docker)

Make sure to have Docker installed on your system. You can set up and run the database container with the following commands:

```bash
docker run -d --name mindsync-db -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:latest
```

### Backend (Spring Boot)

1. Navigate to the `backend/mindsync` directory:

   ```bash
   cd backend/mindsync
   ```

2. Run application:

   ```bash
   mvn spring-boot:run
   ```

### Frontend (Angular)

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Run the Angular servers for both apps:

   ```bash
   npx nx run mindsync:serve
   ```

   The main frontend app - MindSync will be available at `http://localhost:4200/`

   ```bash
   npx nx run user-sync:serve
   ```

   The second frontend app for quizzes' prticipants will be available at `http://localhost:4300/`

## Interfaces Examples

- Home panel:
  ![Alt text](screenshots/image.png)

- Sign In and Registration Popups - after registration user receives confiramation e-mail:
  ![Alt text](screenshots/image-1.png)
  ![Alt text](screenshots/image-3.png)

- Join in Presnetation - User who has "Joining code" and want to take part in the quiz can Join it via Popup in MindSync home page. He will beredirected to UserSync available at `http://localhost:4300/`:
  ![Alt text](screenshots/image-2.png)

- Dashboard for authenticated users - depending user is Admin or not, navigation will contains "Admin panel" button or not. Tabs from "Quizzes" dropdown:

  - "My quizzes" navigates to Dashboard carousel.
  - "Create new" opens popup.
    ![Alt text](screenshots/image-5.png)
    ![Alt text](screenshots/image-8.png)

- Edit profile tab:
  ![Alt text](screenshots/image-6.png)

- Admin panel - to be modified, new functionalities to be add:
  ![Alt text](screenshots/image-7.png)

- Options for each quiz:

  - "Details" button navigates to page where Presenation's owner can show individual slides, modify them (change background color, title, possible answer options, type of slide, title, display time), add new slide to the quiz, delete indicated slide or whole quiz.
    ![Alt text](screenshots/image-11.png)
    ![Alt text](screenshots/image-12.png)
    ![Alt text](screenshots/image-10.png)

  - "Shows" button navigates to page where Quiz's owner can show details about previous shows of indicated quiz. Actions buttons enable:

    - Get preview of attendees answers screenshots, which are being captured live-time during inidcated show of the quiz. User can Download all screenshots in zipped format - design to be updated
    - Download excel file with summary for fiven show. The excel file consists of three tabs: "Symmary", "Attendee Information", "Sldie Statistics". Simple content of "Slide Statistics" available below.
    - Delete show.
      ![Alt text](screenshots/image-13.png)
      ![Alt text](screenshots/image-14.png)
      ![Alt text](screenshots/image-16.png)
      ![Alt text](screenshots/image-15.png)

  - "Start Show" button starts new show display. It uses WebSocket to communicate with UserSync app and once new user joined indicated quiz (with a given joining code), list of attendees is being updated.
    When quiz's owner wants to, he can start quiz by pressing the button. Slides will be displayed for the seconds declared in settings (in the "Details" tab). Time is live-timely counted down.
    ![Alt text](screenshots/image-18.png)
    ![Alt text](screenshots/image-19.png)

  When time go off, correct answer will be ticked in the Quiz owner's screen. For WORD_CLOUD type slides, word cloud with attendees answers will be displayed then. Quiz owner can preview Statistics of just displayed slide. The same statistics are saved as screenshots and can be later seen in "Shows" tab. Presnetation Owner can navigate via slides with "Next slide" button and once all sldies passes, finish it with "Finish" button.
  ![Alt text](screenshots/image-20.png)
  ![Alt text](screenshots/image-21.png)
  ![Alt text](screenshots/image-22.png)

  ### Attendee's interface for answering (UserSync):

  ![Alt text](screenshots/image-23.png)

  - Checkboxes are enabled and user can mark correct answer on his own screen.
    ![Alt text](screenshots/image-24.png)
