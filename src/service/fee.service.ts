import { log } from 'console';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import Fee from '../model/lnpy';

interface RequestObj {
  fee_id: string;
  fee_currnecy: string;
  fee_locale: string;
  fee_entity: string;
  fee_entity_property: string;
  fee_type: string;
  fee_value: string;
}
interface Fees {
  fee_id: string;
  fee_currency: string;
  fee_locale: string;
  fee_entity: string;
  fee_entity_property: string;
  fee_type: string;
  fee_value: number;
  _id: string;
}

interface ComputedTransaction {
  ID: number;
  Amount: number;
  Currency: string;
  CurrencyCountry: string;
  Customer: {
    ID: number;
    EmailAddress: string;
    FullName: string;
    BearsFee: boolean;
  };
  PaymentEntity: {
    ID: number;
    Issuer: string;
    Brand: string;
    Number: number;
    SixID: number;
    Type: string;
    Country: string;
  };
}

interface T {
  id: string;
  appliedFeeValue: number;
  chargeAmount: number;
  settlementAmount: number;
}

export default class FeeService {
  static async parseFSC(reqestObj: RequestObj): Promise<void> {
    /** {FEE-ID} {FEE-CURRENCY} {FEE-LOCALE} {FEE-ENTITY}({ENTITY-PROPERTY}) : APPLY {FEE-TYPE} {FEE-VALUE} */
    const _feeConfigurationSpec: string = `${reqestObj.fee_id} ${reqestObj.fee_currnecy} ${reqestObj.fee_locale} ${reqestObj.fee_entity}(${reqestObj.fee_entity_property}) : APPLY ${reqestObj.fee_type} ${reqestObj.fee_value}`;
    const jsonFormat = { FeeConfigurationSpec: _feeConfigurationSpec };
    await writeFile('fcs.json', JSON.stringify(jsonFormat, null, 4));

    const fee = Fee.build({
      fee_id: reqestObj.fee_id,
      fee_currency: reqestObj.fee_currnecy,
      fee_locale: reqestObj.fee_locale,
      fee_entity: reqestObj.fee_entity,
      fee_entity_property: reqestObj.fee_entity_property,
      fee_type: reqestObj.fee_type,
      fee_value: reqestObj.fee_value,
    });
    await fee.save();
  }

  static async computeTransactionFee(
    requestObj: ComputedTransaction
  ): Promise<T> {
    let fee: Fees = null;

    /** Find a FeeConfigurationSpec (FCS) by the
     * fee_entity => payementEntity.type from the user request
     * OR
     * fee_entity_property => requestObj.PaymentEntity.brand
     * OR
     * fee_entity_property => requestObj.PaymentEntity.brand
     */

    fee = await Fee.findOne({
      fee_entity: requestObj.PaymentEntity.Type || '*',
      fee_entity_property: requestObj.PaymentEntity.Brand
        ? requestObj.PaymentEntity.Brand || '*'
        : requestObj.PaymentEntity.Issuer
        ? requestObj.PaymentEntity.Issuer || '*'
        : requestObj.PaymentEntity.Issuer ||
          requestObj.PaymentEntity.Issuer ||
          '*',
      // $or: [
      // {},
      // { fee_entity_property: requestObj.PaymentEntity.Brand || '*' },
      // { fee_entity_property: requestObj.PaymentEntity.Issuer || '*' },
      // ],
    });

    log(fee);

    let appliedFeeValue!: number;
    let chargeAmount!: number;

    switch (fee.fee_type) {
      case 'FLAT':
        appliedFeeValue = fee.fee_value * 1;
        break;
      case 'PERC':
        appliedFeeValue = (fee.fee_value / 100) * requestObj.Amount;
        break;
      case 'FLAT_PERC':
        const test = fee.fee_value.toString().split(':');
        const flat = test[0];
        const perc = test[1];
        appliedFeeValue =
          Number(flat) + (Number(perc) / 100) * requestObj.Amount;
        break;
    }

    if (requestObj.Customer.BearsFee === true) {
      chargeAmount = requestObj.Amount + appliedFeeValue;
    } else {
      chargeAmount = requestObj.Amount;
    }
    const settlementAmount = chargeAmount - appliedFeeValue;
    return { id: fee.fee_id, appliedFeeValue, chargeAmount, settlementAmount };
  }
}
