# whoami

Like the command you know and love, but different.

## Tested using
- Windows 8.1 (I know; I'm sorry)
- Git Bash v2.14.2.3
- Node v8.11.1
- Docker v18.03.0-ce
- Docker Compose v1.20.1

## Database Schema

Database: `mongodb` via `mongoose`
Model/Collection: `User`/`users`
Schema:
```
{
    profileId: String,
    email: String,
    fullName: String,
    description: String,
    createdAt: Date,
    updatedAt: Date
}
```

## Authentication

GitHub OAuth via Passport.js

## How to use

- Clone down this repo!
- `cd whoami/app`
- `npm run start`