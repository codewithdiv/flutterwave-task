import { NextFunction, Request, Response } from 'express';
import FeeService from '../service/fee.service';

/** Fee configuration Spec I used (FCS)
 * LNPY1221 NGN LOCL CREDIT-CARD(*) : APPLY PERC 1.4
 * LNPY1222 NGN INTL CREDIT-CARD(MASTERCARD) : APPLY PERC 3.8
 * LNPY1223 NGN INTL CREDIT-CARD(*) : APPLY PERC 5.8
 * LNPY1224 NGN LOCL USSD(MTN) : APPLY FLAT_PERC 20:0.5
 * LNPY1225 NGN LOCL USSD(*) : APPLY FLAT_PERC 20:0.5
 */

export default class FeesController {
  static async _acceptValidFCS(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    await FeeService.parseFSC(req.body);
    return res.status(200).json({ status: 'OK' });
  }

  static async computeTransactionFee(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    switch (req.body.Currency) {
      case 'USD':
        res.status(400).json({
          status: 'error',
          Error: 'No fee configuration for USD transactions.',
        });
        break;
      case 'NGN':
        const _computeTransactionFee = await FeeService.computeTransactionFee(
          req.body
        );
        res.status(200).json({ computedFee: _computeTransactionFee });
        break;
    }
  }
}
