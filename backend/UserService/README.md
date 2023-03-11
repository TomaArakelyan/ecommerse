## Getting started

### 1. Install dependencies

Install npm dependencies:

```
npm install
```

### 2. Create the database

Run the following command to create your SQLite database file. This also creates the `User` table that defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in [`prisma/seed.ts`](./prisma/seed.ts) will be executed and your database will be populated with the sample data.

### 3. Start the REST API server

```
npm run dev
```

The server is now running on `http://localhost:3000`. You can now run the API requests, e.g. [`http://localhost:3000/`](http://localhost:3000/).
