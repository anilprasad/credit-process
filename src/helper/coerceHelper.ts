import moment from 'moment';
import { VariableDataType } from '../enum/VariableDataType';

export const coerceValue = (value: any, dataType: VariableDataType) => {
  try {
    switch (dataType) {
      case VariableDataType.String:
        return String(value);
      case VariableDataType.Number:
        return coerceNumberValue(value);
      case VariableDataType.Boolean:
        return coerceBooleanValue(value);
      case VariableDataType.Date:
        return coerceDateValue(value);
      default:
        return value;
    }
  } catch (error) {
    return value;
  }
};

export const coerceNumberValue = (value: any) => {
  const formattedValue = Number(value);

  return !isNaN(formattedValue) ? formattedValue : null;
};

export const coerceDateValue = (value: any) => {
  if (!value) {
    return value;
  }

  const formattedValue = moment(value).format('MM/DD/YYYY');

  return formattedValue !== 'Invalid date' ? formattedValue : value;
};

export const coerceBooleanValue = (value: any) => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  return !!value;
};
