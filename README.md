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
- GitHub OAuth App Setup
  - **Application name**:  whoami
  - **Homepage URL**:  http://localhost
  - **Authorization callback URL**:  http://localhost/auth/github/callback

## How to use

- Clone down this repo!
- Add your GitHub OAuth app's `CLIENT_ID` and `CLIENT_SECRET` to `app/constants.js`
  - ```
    const CLIENT_ID = "<your_client_id>";   // client ID for GitHub auth
    const CLIENT_SECRET = "<your_client_secret>";   // client secret for GitHub auth
    ```
  - Make sure that the OAuth app is configured as mentioned above as well!
- `cd whoami/app`
- `npm run start`