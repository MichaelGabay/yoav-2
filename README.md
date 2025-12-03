# Express App 📜

## Description

This is an Express.js application. 🚀

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

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
    MONGODB_URI=mongodb://admin:password123@localhost:27018
    ```

### Running the docker container for mongoDB and running the app

```sh
docker-compose up -d
npm run dev
```

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
