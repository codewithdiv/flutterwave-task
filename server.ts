import { log } from 'console';
import mongoose from 'mongoose';
import app from './src/app';

mongoose
  .connect('mongodb://localhost:27017/LNPY')
  .then(() => {
    console.log(`App connected to database successfully`);
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  log(`App is running on port 3000`);
});
