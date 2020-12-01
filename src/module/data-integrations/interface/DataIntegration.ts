import { CustomInput } from '../../../interface/CustomInput';
import { IRequestOptions } from './IRequestOptions';
import { IResponseOptions } from './IResponseOptions';
import { Organization } from '../../../interface/Organization';
import { SegmentInputVariable } from '../../../interface/variable/SegmentInputVariable';
import { SegmentOutputVariable } from '../../../interface/variable/SegmentOutputVariable';
import { SegmentSecretVariable } from '../../../interface/variable/SegmentSecretVariable';
import { VMParser } from './VMParser';

export interface DataIntegration {
  _id: string;
  credentials: {
    [key: string]: any;
    security_certificate?: {
      attributes: {
        cloudcontainername: string;
        cloudfilepath: string;
        client_encryption_algo: string;
        original_filename: string;
      };
      createdat: string;
    };
  };
  active_default_configuration?: Record<string, any>;
  active_request_options?: IRequestOptions;
  custom_inputs: CustomInput[];
  custom_query_params?: Record<string, any>;
  data_provider: string;
  default_configuration?: Record<string, any>;
  description: string;
  entitytype: string;
  formatRequestJSONBody?: string;
  inputs: SegmentInputVariable[];
  ip_addresses: string[];
  name: string;
  organization: Organization;
  outputs: SegmentOutputVariable[];
  raw_data_parse?: boolean;
  raw_data_traversal_path?: string;
  response_option_configs: IResponseOptions;
  request_option_configs: {
    set_content_length?: boolean;
    pfx?: boolean;
  };
  request_options: IRequestOptions;
  request_type: 'xml' | 'json' | 'form-urlencoded';
  require_security_cert?: boolean;
  required_credentials: string[];
  secrets?: SegmentSecretVariable[];
  status: 'active';
  stringify?: boolean;
  timeout?: number;
  url_encode_format?: string;
  xml_library?: 'xml2js' | string;
  xml_parser_configs?: {
    explicitArray?: boolean;
    attrkey?: string;
    trim?: boolean;
  };
  xml_configs?: {
    attrkey?: string;
    rootName?: string;
    trim?: boolean;
    hideUndefinedTag?: boolean;
    nullValueTag?: string;
    emptyStringTag?: string;
    formatting?: boolean;
    rootTag?: string;
  };
  vm_parser: VMParser;
}
