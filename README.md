## Application notes

# 🚀 Dockerized Laravel Project (No Sail)

This project contains a simple setup to run a Laravel application using Docker (without Laravel Sail). It includes:

- **Laravel (API backend)**
- **Angular (frontend)**
- **MySQL (database)**
- **Elasticsearch (search engine)**
- **Docker (containerization)**

---

## 📁 Folder Structure

project-root/
├── backend/ # Laravel app here
│ ├── Dockerfile
│ ├── ...
├── nginx/
│ └── conf.d/
│ └── default.conf # Nginx virtual host config
├── docker-compose.yml


---
## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/) (typically comes with Docker Desktop)
- Composer installed globally for PHP dependency management
- Node.js and npm installed for the Angular frontend

---

## 🏗️ Setup Instructions for Backend

# 1. Clone the Repository

    git clone <your-repo-url>
    cd <your-repo-directory>

# 2. Build Docker Containers
    The Dockerfile uses `UID` and `GID` build arguments to set the user and group IDs inside the container.  
    This helps avoid permission issues with shared volumes.

    By default, these values are set to `1000`, but you should update them to match your own system’s user and group IDs.

    To find your IDs (Linux/macOS):

    ```bash
    id -u   # your user ID (UID)
    id -g   # your group ID (GID)
    ```

    Then build with:

    ```bash
    docker-compose build --build-arg UID=$(id -u) --build-arg GID=$(id -g)
    docker-compose up -d
    ```
    Or update the docker file directly ans set
    ARG UID=1000
    ARG GID=1000
    to match you system IDs and run
    docker-compose build
    docker-compose up -d

# 3. Install Laravel Dependencies
    docker exec -it customer_api bash
    Then inside the container
    composer install
    cp .env.example .env
    php artisan key:generate

# 4. Configure the .env File
    Current donfiguration change depending on your database setup
    DB_HOST=db
    DB_PORT=3306
    DB_DATABASE=customer
    DB_USERNAME=root
    DB_PASSWORD=

    // For elastic search
    ELASTICSEARCH_HOST=searcher
    ELASTICSEARCH_PORT=9200

# 5. Run Migrations
    "Inside the container"
    php artisan migrate 

    docker exec -it customer_api php artisan migrate -> Run migration using the docker in the container

    exit
# 6. Access the Backend API

## 🏗️ Setup Instructions for Frontend

# 1. Install Dependencies
    cd frontend
    npm install
# 2. Run Angular App
    ng serve --port 4200
    Access application using this route http://localhost:4200

🔄 Update Angular API Base URL (if needed)
    Ensure your frontend talks to the backend API correctly.

    In frontend/src/app/services/customer.service.ts, set: private apiUrl = 'http://localhost:8081/api/customers';