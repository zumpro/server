import express, { Application } from 'express';
import { Request, Response } from 'express';
import {dataSourceMiddleware} from '../middleware/dataSourceMiddleware';
// import moviesRouteHandler from '../routes/moviesRouteHandler';

import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(express.json());



app.use((_, res, next): any => {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(dataSourceMiddleware);

app.set("trust proxy", 1);
app.get('/status', (_: Request, res: Response) => {
    res.send('Server is running');
});


// app.get('/movies', moviesRouteHandler);

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

export default app;
