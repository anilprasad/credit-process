import { SegmentOutputVariable } from '../../../interface/variable/SegmentOutputVariable';

export interface VMParser {
  _id: string;
  name: string;
  data_provider : string;
  status : 'active' | 'inactive';
  organization: string | null;
  main : string;
  global_functions : [{
    name: string;
    operation: string;
  }];
  variables: SegmentOutputVariable[];
}
