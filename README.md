# MyGamePlanner: 

MyGamePlanner is an application designed to facilitate the management, creation, and sharing of gaming sessions for groups. Built with Next.js, this application aims to make it easy for users to organize and plan their gaming activities efficiently.

## Features

- **Create and Manage Sessions**: Easily create and manage gaming sessions.
- **Invite Participants**: Invite friends and group members to join your gaming sessions via simple magic links.
- **Real-time Notifications**: Receive real-time updates and notifications about session changes.
- **Attendance Tracking**: Keep track of who is attending, pending, or absent for each session.
- **User-friendly Interface**: A clean and intuitive interface built with modern web technologies.

## Technologies Used

- **Main Application**: Next.js, React, Tailwind CSS
- **WebSocket Server**: Node.js, Express, Socket.io
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Docker, DigitalOcean, Cloudflare

## Installation

### Prerequisites

- Node.js
- Docker
- PostgreSQL
- Cloudflare account for DNS and SSL

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/juliencm-dev/MyGamePlanner.git
    cd nexus
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up your environment variables:
    Create a `.env.local` file in the root of the project and add your environment variables. Example:
    ```env
    DATABASE_URL=your_database_url
    NEXT_PUBLIC_API_URL=http://localhost:3000/api
    SOCKET_SERVER_URL=http://localhost:3001
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

5. Build and run with Docker:
    ```bash
    docker-compose up --build
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Create an account or log in if you already have one.
3. Start creating and managing your gaming sessions!

## Contributing

We welcome contributions to MyGamePlannerq! To get started, follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature/your-feature-name
    ```
5. Create a pull request.

## Disclaimer

This project intentionally does not include a license. All rights reserved. You are welcome to view and study the code, but this repository does not grant you any rights to use, modify, distribute, or sublicense its contents.


## Contact

If you have any questions or feedback, feel free to reach out to us at hello@juliencm.dev.

---

Happy gaming!
