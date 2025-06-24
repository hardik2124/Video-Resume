import express from 'express';
import cors from 'cors';
import { DBConnection } from './config/dbConnection.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

await DBConnection();


import authRoutes from "./routes/userRoutes.js"


app.use('/api/auth', authRoutes);


app.use(errorHandler);

const port = process.env.PORT;
if (!port) {
  console.error('Error: PORT environment variable is not set.');
  process.exit(1);
}

app.listen(port || 6000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

app.get('/', (req, res) => {
  res.send(`
        <html>
            <head>
            <title>Welcome</title>
            <style>
                body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f9f9f9;
                font-family: Arial, sans-serif;
                }
                h1 {
                font-style: italic;
                color: #333;
                }
            </style>
            </head>
            <body>
            <h1><u><i>Welcome to the<b> ai Resume Video </b> server!</i></u></h1>
            </body>
        </html>
    `);

})



