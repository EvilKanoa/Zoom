# ZOOM: Quick start for a MERN app

#### Developing
For development:
1. Clone repo.
2. Copy `.env.sample` into `.env` and configure it as required.
3. Run `npm install`.
4. Start the development server using `npm run dev`.

#### Building and Deploying Editor
For a production ready build and server:
1. Clone repo.
2. Copy `.env.sample` into `.env` and configure it as required.
3. Run `npm install`, then either (a) build the files locally or (b) let the server build the files.
For a locally built production server:
* Use `npm run prod` to build the `dist` folder then run the production server and serve the `dist` folder.
For building and running a production server:
* Use `npm run build` to build the dist folder locally then use `npm run server` to run the production server.
