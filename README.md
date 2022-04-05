The frontend application is based on **React 18** and **Typescript 4.6.3**.

To launch the application, first setup the backend application from [Pokemon Server](https://github.com/AjaSharma93/pokemon_server).

Next, configure the backend server URL in the build args of the file **docker-compose.prod.yml** found in the local directory.

Finally, run the following command to setup the frontend in docker,
```
docker-compose -f .\docker-compose.prod.yml up -d --build  
```

The application can then be accessed on the external port **3000** of the container.

To run tests, setup NodeJS from [NodeJS 17.7](https://nodejs.org/download/release/v17.7.2/) and [React 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html).

Run the following command:
```
npm run test
```
