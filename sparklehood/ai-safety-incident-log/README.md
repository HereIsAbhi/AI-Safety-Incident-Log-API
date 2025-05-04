# AI Safety Incident Log

A Node.js/TypeScript REST API for logging and managing AI safety incidents, using Express, Prisma ORM, and SQLite.

---

## Features

- CRUD API for incidents (Create, Read, Update, Delete)
- Uses Prisma ORM for database access
- SQLite as the default database (easy local setup)
- Modular routing with Express
- **PATCH** endpoint for partial updates
- **/incidents/stats** endpoint for analytics (counts, trends, high-risk %)
- **Email alerts** for "High" severity incidents (Ethereal for dev)
- **Docker** support for containerized deployment
- **Jenkins CI/CD** pipeline with Docker Hub integration

---

## Technology Stack

- **Language:** TypeScript (Node.js)
- **Framework:** Express
- **ORM:** Prisma
- **Database:** SQLite (default) or PostgreSQL (optional)
- **Email:** Nodemailer (Ethereal for dev)
- **CI/CD:** Jenkins
- **Containerization:** Docker

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd sparklehood/ai-safety-incident-log
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root with the following content:

```env
DATABASE_URL="file:./prisma/dev.db"
```

> The default setup uses a local SQLite database file at `prisma/dev.db`.

### 4. Set Up the Database

Run Prisma migrations to create the required tables:

```bash
npx prisma migrate dev --name init
```

(Optional) Seed the database with a sample incident:

```bash
node seed.js
```

### 5. Run the Project

For TypeScript (development):

```bash
npm run dev
```

For compiled JavaScript (production):

```bash
npm run build
npm start
```

The server will start on [http://localhost:3000](http://localhost:3000).

---

## Docker Usage

### Build the Docker image
```bash
docker build -t your-image-name .
```

### Run the Docker container
```bash
docker run -p 3000:3000 your-image-name
```

---

## Jenkins CI/CD Pipeline

- The project includes a `Jenkinsfile` for automated build, test, and Docker image push to Docker Hub.
- Configure Jenkins with Docker and Docker Hub credentials (see Jenkinsfile for details).
- The pipeline stages: checkout, install, test, build, Docker build & push, (optional) deploy.

---

## Email Alerts for High Severity Incidents

- When an incident with `"severity": "High"` is created, an email alert is sent using Nodemailer.
- For development, Ethereal is used (see server logs for a preview URL).
- To use a real email provider, update the Nodemailer transporter config in `src/routes/incidents.ts`.

---

## API Endpoints

### Get all incidents
```bash
curl -X GET http://localhost:3000/incidents
```

### Get a single incident by ID
```bash
curl -X GET http://localhost:3000/incidents/1
```

### Create a new incident
```bash
curl -X POST http://localhost:3000/incidents \
  -H "Content-Type: application/json" \
  -d '{"title":"Example","description":"Test incident","severity":"High"}'
```

### Update an incident (full update)
```bash
curl -X PUT http://localhost:3000/incidents/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","description":"Updated desc","severity":"Medium"}'
```

### Update an incident (partial update)
```bash
curl -X PATCH http://localhost:3000/incidents/1 \
  -H "Content-Type: application/json" \
  -d '{"severity":"Low"}'
```

### Delete an incident
```bash
curl -X DELETE http://localhost:3000/incidents/1
```

### Get incident statistics and analytics
```bash
curl -X GET http://localhost:3000/incidents/stats
```
- Returns counts by severity, daily trends, and percentage of high-risk incidents.

---

## Database Schema

The `Incident` model (see `prisma/schema.prisma`):

```prisma
model Incident {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  severity    String
  reported_at DateTime @default(now())
}
```

---

## Design Notes

- **Prisma ORM** is used for type-safe database access and easy migrations.
- **SQLite** is chosen for simplicity and local development. You can switch to another database by updating the `DATABASE_URL` in `.env` and the `provider` in `prisma/schema.prisma`.
- **Validation**: The API checks for required fields and valid severity values.
- **Error Handling**: Returns appropriate HTTP status codes and error messages.
- **Email Alerts**: Uses Nodemailer and Ethereal for dev; can be configured for production.
- **CI/CD**: Jenkins pipeline automates build, test, and Docker Hub push.
- **Containerization**: Dockerfile provided for easy deployment.

---

## Troubleshooting

- If you change the schema, run `npx prisma migrate dev` again.
- If you want to inspect the database, use a tool like [DB Browser for SQLite](https://sqlitebrowser.org/).
- For email preview, check the server console for the Ethereal preview URL after creating a high severity incident.
- For Docker, ensure Docker is installed and running.
- For Jenkins, ensure Docker and credentials are configured on the Jenkins host.

---

## License

ISC 