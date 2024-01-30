## Installation and Running

To run the app locally, follow these steps:

1. Clone the repository:

```sh
git clone git@github.com:fayde01/kakeibo.git
```

2. Edit the `.env.example` to `.env` makesure to fill it

    I'm using MySQL for database.

3. Install dependencies:

Probably works with yarn/npm/bun but I use pnpm:

```sh
cd kakeibo
pnpm install
```

4. Run the application:

```sh
pnpm run dev
```