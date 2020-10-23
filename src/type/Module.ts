import { ModuleType } from '../enum/ModuleType';
import Segment from './Segment';

export default interface Module {
  type: ModuleType;
  segments: Segment[] | Segment;
  name: string;
  active: boolean;
  display_name: string;
  lookup_name: string;
  dataintegration?: Segment;
}
