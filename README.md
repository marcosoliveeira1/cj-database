# CJ Database - Pipedrive Synchronization Service

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

This project is a NestJS application that acts as a real-time data synchronization service between Pipedrive CRM and a local MySQL database.

## 📖 Documentation

*   **[Project Objective](./PROJECT_OBJECTIVE.md):** A detailed explanation of the project's goals and purpose.
*   **[Architecture Overview](./ARCHITECTURE.md):** A technical deep-dive into the project's architecture, components, and data flow.

## ✨ Features

*   **Real-time Data Sync:** Keeps the local database in sync with Pipedrive entities (Deals, Persons, Organizations, etc.) using webhooks.
*   **Resilient & Scalable:** Uses a BullMQ message queue to process webhooks, ensuring no data is lost and the system can handle high loads.
*   **Decoupled Architecture:** Allows other internal services to consume Pipedrive data from the local database, reducing direct API dependency.
*   **Extensible:** Provides a solid foundation for building custom features, analytics, or data transformations on top of the replicated Pipedrive data.

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or higher)
*   [pnpm](https://pnpm.io/)
*   [Docker](https://www.docker.com/)

### Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd cj-database
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Copy the `.env.example` file to a new `.env` file and fill in the required values:

    ```bash
    cp .env.example .env
    ```

4.  **Start the database and Redis:**

    ```bash
    docker-compose up -d
    ```

5.  **Run database migrations:**

    ```bash
    pnpm db:deploy
    ```

### Running the Application

```bash
# Development mode
$ pnpm run start

# Watch mode
$ pnpm run start:dev

# Production mode
$ pnpm run start:prod
```

## ✅ Running Tests

```bash
# Unit tests
$ pnpm run test

# End-to-end tests
$ pnpm run test:e2e

# Test coverage
$ pnpm run test:cov
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.