import Organization from './Organization';

export default class Variable {
  name: String;
  display_name: String;
  display_title: String;
  title: String;
  value: any;
  version: number;
  data_type: string;
  latest_version: boolean;
  type: string;
  description: String;
  strategies: string[]; //ObjectId
  user: any;
  organization: Organization;
  numberFormat: String;
  optionsList: string[];
}
