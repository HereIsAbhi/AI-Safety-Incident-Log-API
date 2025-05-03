# AI Safety Incident Log

A Node.js/TypeScript REST API for logging and managing AI safety incidents, using Express, Prisma ORM, and SQLite.

---

## Features

- CRUD API for incidents (Create, Read, Update, Delete)
- Uses Prisma ORM for database access
- SQLite as the default database (easy local setup)
- Modular routing with Express

---

## Technology Stack

- **Language:** TypeScript (Node.js)
- **Framework:** Express
- **ORM:** Prisma
- **Database:** SQLite

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

### Update an incident

```bash
curl -X PUT http://localhost:3000/incidents/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","description":"Updated desc","severity":"Medium"}'
```

### Delete an incident

```bash
curl -X DELETE http://localhost:3000/incidents/1
```

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

---

## Troubleshooting

- If you change the schema, run `npx prisma migrate dev` again.
- If you want to inspect the database, use a tool like [DB Browser for SQLite](https://sqlitebrowser.org/).

---

## License

ISC 