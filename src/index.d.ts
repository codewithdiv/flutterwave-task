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
