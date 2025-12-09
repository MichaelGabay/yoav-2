# Express App 📜

## Description

This is an Express.js application. 🚀

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Docker and Docker Compose

### Installation

1.  Clone the repo
    ```sh
    git clone <your-repo-url>
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env` file in the root directory with the following content:
    ```
    PORT=3000
    MONGODB_URI="mongodb://admin:password123@localhost:27018/yoav?authSource=admin"
    ```

### Running the Application

Simply run:
```sh
npm run dev
```

This command will:
1. Start the Docker containers (MongoDB and mongo-express) in detached mode
2. Wait a few seconds for the containers to initialize
3. Start the Express server with nodemon (auto-reload on file changes)

The server will be running on `http://localhost:3000` (or the port specified in your `.env` file).

## 📊 Viewing Database Data

After starting the Docker containers, you can view your MongoDB data in the browser using **mongo-express**:

1. **Access mongo-express:**

   - Open your browser and navigate to: `http://localhost:8081`

2. **Login credentials:**

   - Username: `admin`
   - Password: `admin`

3. **Browse your data:**
   - Select the `test` database from the left sidebar
   - Click on collections to view documents
   - You can query, edit, and manage your data through the web interface
