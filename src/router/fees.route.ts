import { Router } from 'express';
import FeesController from '../controller/FeesController';

const route = Router();

route.route('/').post((req, res, next) => {
  FeesController._acceptValidFCS(req, res, next);
});
route.route('/compute-transaction-fee').post((req, res, next) => {
  FeesController.computeTransactionFee(req, res, next);
});

export default route;
