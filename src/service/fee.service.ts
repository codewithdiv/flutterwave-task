import { log } from 'console';
import { writeFile } from 'fs/promises';
import Fee from '../model/lnpy';

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
     * fee_entity_property => check if a the requestObj.PaymentEntity.Brand is empty and the requestObj.PaymentEntity.Issuer is empty then default to '*'
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
