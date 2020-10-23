import Organization from './Organization';

export default interface Variable {
  data_type: string;
  description: string;
  display_name: string;
  display_title: string;
  latest_version: boolean;
  name: string;
  numberFormat: string;
  optionsList: string[];
  organization: Organization;
  strategies: string[]; //ObjectId
  title: string;
  type: string;
  user: any;
  value: any;
  version: number;
}
