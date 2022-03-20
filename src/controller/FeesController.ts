import { NextFunction, Request, Response } from 'express';
import FeeService from '../service/fee.service';

/**
 * LNPY1221 NGN LOCL CREDIT-CARD(*) : APPLY PERC 1.4
 * LNPY1222 NGN INTL CREDIT-CARD(MASTERCARD) : APPLY PERC 3.8
 * LNPY1223 NGN INTL CREDIT-CARD(*) : APPLY PERC 5.8
 * LNPY1224 NGN LOCL USSD(MTN) : APPLY FLAT_PERC 20:0.5
 * LNPY1225 NGN LOCL USSD(*) : APPLY FLAT_PERC 20:0.5
 */

/** 
 * {
    "FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4
    LNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0
    LNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4
    LNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100
    LNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
}
 */

/** {FEE-ID} {FEE-CURRENCY} {FEE-LOCALE} {FEE-ENTITY}({ENTITY-PROPERTY}) : APPLY {FEE-TYPE} {FEE-VALUE} */

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
    const _computeTransactionFee = await FeeService.computeTransactionFee(
      req.body
    );
    return res.status(200).json({ computedFee: _computeTransactionFee });
  }
}
