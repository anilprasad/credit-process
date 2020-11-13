import { VariableDataType } from '../enum/VariableDataType';
import moment from 'moment';

export function coerceValue(value: any, dataType: VariableDataType) {
  try {
    switch (dataType) {
      case 'String':
        return String(value);
      case 'Number': 
        return coerceNumberValue(value);
      case 'Boolean':
        return coerceBooleanValue(value);  
      case 'Date':
        return coerceDateValue(value);
      default:
        return value;  
    }
  } catch (error) {
    return value;
  }
}

export function coerceNumberValue(value: any) {
  const formattedValue = Number(value);

  return !isNaN(formattedValue) ? formattedValue : value;
}

export function coerceDateValue(value: any) {
  if (!value) {
    return value;
  }

  const formattedValue = moment(value).format('MM/DD/YYYY');

  return formattedValue !== 'Invalid date' ? formattedValue : value;
}

export function coerceBooleanValue(value: any) {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  return !!value;
}
