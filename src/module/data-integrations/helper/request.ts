import * as AWS from 'aws-sdk';
import crypto, { CipherGCMTypes } from 'crypto';
import appConfigLoader from '@digifi/app-config-loader';
import convertjson2xml from 'convertjson2xml';
import { CreditProcessState } from '../../../interface/CreditProcessState';
import { CustomInput } from '../../../interface/CustomInput';
import { DataIntegration } from '../interface/DataIntegration';
import { Duplex } from 'stream';
import fs from 'fs-extra';
import https from 'https';
import { IFetchOptions } from '../interface/IFetchOptions';
import { IRequestOptions } from '../interface/IRequestOptions';
import moment from 'moment';
import path from 'path';
import periodic from 'periodicjs';
import { SegmentInputVariable } from '../../../interface/variable/SegmentInputVariable';
import { URL } from 'url';
import urlencode from 'urlencode';
import { VariableValue } from '../../../type/VariableValue';
import xml2js from 'xml2js';

interface ISecuritySertOptions {
  filename: string;
  dir: string;
  Bucket: AWS.S3.BucketName;
  Key: AWS.S3.ObjectKey;
  client_encryption_algo: crypto.CipherGCMTypes;
}

/**
 * Dynamic request parser
 */
export const parser = async (state: CreditProcessState, dataIntegration: DataIntegration): Promise<IFetchOptions> => {
  const strategy_status = state.strategy_status || 'testing';

  let dir, filename;

  const inputs = await getInputs(state, dataIntegration);

  let body = getRequestBody(inputs, dataIntegration, strategy_status);
  body = dataIntegration.stringify ? JSON.stringify(body) : body;

  // set dataintegration request options based on active or testing
  const requestOptions = (strategy_status === 'active' && dataIntegration.active_request_options)
    ? dataIntegration.active_request_options
    : dataIntegration.request_options;

  if (inputs) {
    changeRequestOptionsByInputs(inputs, dataIntegration, requestOptions);
  }

  const response_options = dataIntegration.response_option_configs || {};

  if (dataIntegration.require_security_cert
    && dataIntegration.credentials
    && dataIntegration.credentials.security_certificate
  ) {
    dir = 'security_certificates';
    const Bucket = dataIntegration.credentials.security_certificate.attributes.cloudcontainername;
    const Key = dataIntegration.credentials.security_certificate.attributes.cloudfilepath;
    const client_encryption_algo = dataIntegration.credentials
      .security_certificate
      .attributes.client_encryption_algo as CipherGCMTypes;

    filename = moment(dataIntegration.credentials.security_certificate.createdat).format('YYYY-MM-DD_h:mm:ss_a_')
      + dataIntegration.credentials.security_certificate.attributes.original_filename.replace(/\s+/g, '_');

    const securityCertExists = fs.existsSync(path.resolve(dir, filename));

    if (!securityCertExists) {
      await decryptSecurityCert({ Bucket, Key, client_encryption_algo, filename, dir });
    }
  }

  if (dataIntegration.request_option_configs) {
    const requestOptionConfigs = dataIntegration.request_option_configs;

    if (requestOptionConfigs.set_content_length && requestOptions && requestOptions.headers) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(body);
    }

    if (requestOptionConfigs.pfx && requestOptions && dir && filename) {
      requestOptions.pfx = fs.readFileSync(path.resolve(dir, filename));
    }
  }

  if (dataIntegration.custom_query_params) {
    const dynamicQueryString = generateDynamicQueryString(
      inputs,
      dataIntegration.custom_query_params,
      dataIntegration.url_encode_format,
    );

    requestOptions.path += `?${dynamicQueryString}`;
  }

  return {
    requestOptions,
    responseOptions: response_options,
    timeout: dataIntegration.timeout,
    body,
  };
};

const createBodyXML = (
  inputs: Record<string, VariableValue>,
  dataIntegration: DataIntegration,
  strategyStatus: string,
) => {
  const body = getBodyTemplate(dataIntegration, strategyStatus);

  getInputFields(dataIntegration).forEach(config => {
    if (!config.traversal_path) {
      return;
    }

    const traversalArr = config.traversal_path.split('.');
    let currentBody = body;

    for (let i = 0; i < traversalArr.length - 1; i++) {
      const elementOfPath = traversalArr[i];
      currentBody = currentBody[elementOfPath] as Record<string, unknown>;
    }

    currentBody[traversalArr[traversalArr.length - 1]] = inputs[config.input_name];
  });

  if (dataIntegration.xml_library === 'xml2js') {
    const builder = new xml2js.Builder(dataIntegration.xml_configs || {
      attrkey: '@',
      rootName: 'requestTag',
    });

    return builder.buildObject(body);
  } else {
    const json2xml = convertjson2xml.config(dataIntegration.xml_configs || {
      emptyStringTag: 'full',
      formatting: true,
      hideUndefinedTag: true,
      nullValueTag: 'full',
      rootTag: 'requestTag', // should be the root tag of the valid xml that is sent to the 3rd party provider
      trim: true,
    });

    return json2xml(body);
  }
};

const getFormattedRequestJSONBody = (dataIntegration: DataIntegration, body: Record<string, unknown>) => {
  if (!dataIntegration.formatRequestJSONBody) {
    return body;
  }

  const formatRequest = new Function('body', dataIntegration.formatRequestJSONBody);

  return formatRequest.call(null, body);
};

const createJSONBody = (
  inputs: Record<string, VariableValue>,
  dataIntegration: DataIntegration,
  strategyStatus: string,
) => {
  const body = getBodyTemplate(dataIntegration, strategyStatus);

  if (inputs) {
    getInputFields(dataIntegration).forEach(config => {
      const inputValue = inputs[config.input_name];

      if (inputValue === undefined) {
        return;
      }

      if (config.traversal_path) {
        const traversalArr = config.traversal_path.split('.');

        let currentBody = body;
        for (let i = 0; i < traversalArr.length - 1; i++) {
          const elementOfPath = traversalArr[ i ];
          currentBody = currentBody[elementOfPath] as Record<string, unknown>;
        }

        currentBody[traversalArr[traversalArr.length - 1]] = inputValue;
      } else {
        body[config.input_name] = inputValue;
      }
    });
  }

  if (dataIntegration.custom_inputs) {
    dataIntegration.custom_inputs.forEach(config => {
      inputs[config.name] = formatCustomInputValue(config, inputs[config.name]);
    });
  }

  return getFormattedRequestJSONBody(dataIntegration, body);
};

const getRequestBody = (
  inputs: Record<string, VariableValue>,
  dataIntegration: DataIntegration,
  strategyStatus: string,
) => {
  if (dataIntegration.request_type === 'xml') {
    return createBodyXML(inputs, dataIntegration, strategyStatus);
  }

  if (dataIntegration.request_type === 'json') {
    return createJSONBody(inputs, dataIntegration, strategyStatus);
  }

  if (dataIntegration.request_type === 'form-urlencoded') {
    const body = createJSONBody(inputs, dataIntegration, strategyStatus);

    return urlencode.stringify(body);
  }

  return null;
};

/**
 * Returns path with params replaced with actual values.
 */
export const generateDynamicPath = (path: string, inputs: Record<string, VariableValue>) => {
  return Object.keys(inputs).reduce((newPath, key) => {
    const params = new RegExp(`:${key}`, 'g');
    const inputValue = inputs[key];

    if (inputValue === undefined || inputValue === null) {
      return newPath;
    }

    if (newPath.match(params)) {
      newPath = newPath.replace(params, encodeURIComponent(inputValue));
      delete inputs[key];
    }

    return newPath;
  }, path);
};

export const bufferToStream = (source: Buffer) => {
  if (source instanceof Buffer) {
    const stream = new Duplex();
    stream.push(source);
    stream.push(null);

    return stream;
  }

  throw new Error('Input must be a buffer');
};

const decryptSecurityCert = async (options: ISecuritySertOptions) => {
  const { filename, dir, Bucket, Key, client_encryption_algo } = options;

  const {
    accessKeyId,
    accessKey,
    region,
  } = periodic.settings.extensions['@digifi/periodicjs.ext.packagecloud'].client;
  const s3 = new AWS.S3({ accessKeyId, secretAccessKey: accessKey, region });

  const encryption_key = periodic.settings.extensions['@digifi-los/reactapp'].encryption_key_path;

  const url = new URL(s3.getSignedUrl('getObject', { Bucket, Key, Expires: 60 }));

  const fetchOptions = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'GET',
  };

  const decipher = crypto.createDecipher(client_encryption_algo, encryption_key);

  return new Promise((resolve, reject) => {
    const request = https.request(fetchOptions, response => {
      const data: Uint8Array[] = [];

      response.on('data', (chunk) => {
        data.push(chunk);
      });

      response.on('error', (error) => {
        reject(error);
      });

      response.on('end', async () => {
        await fs.ensureDir(path.resolve(dir));

        const writeStream = bufferToStream(Buffer.concat(data))
          .pipe(decipher)
          .pipe(fs.createWriteStream(path.resolve(dir, filename)));

        writeStream.on('error', (error) => {
          reject(error);
        });

        writeStream.on('finish', () => {
          resolve(true);
        });
      });
    });

    request.on('error', error => {
      reject(error);
    });

    request.end();
  });
};

export const getBodyTemplate = (dataIntegration: DataIntegration, strategyStatus: string): Record<string, unknown> => {
  if (strategyStatus === 'active' && dataIntegration.active_default_configuration) {
    return dataIntegration.active_default_configuration;
  }

  return dataIntegration.default_configuration || {};
};

export const generateDynamicQueryString = (
  inputs: Record<string, VariableValue>,
  queryParams: Record<string, VariableValue>,
  urlEncodeFormat = 'utf-8',
) => {
  return Object.keys(queryParams).reduce((dynamicQueryEntries: string[], queryKey) => {
    let queryValue = (inputs[queryKey] !== undefined) ? inputs[queryKey] : queryParams[queryKey];

    if (queryValue || queryValue === false || typeof queryValue === 'number') {
      queryValue = urlencode(queryValue as string, urlEncodeFormat);
      dynamicQueryEntries.push(`${queryKey}=${queryValue}`);
    }

    return dynamicQueryEntries;
  }, []).join('&');
};

const formatCustomInputValue = (
  config: CustomInput,
  value: VariableValue,
) => {
  if (config.format) {
    switch (config.format) {
      case 'Date': {
        const date = moment(value as string).format(config.style);

        return date !== 'Invalid date' ? date : '';
      }
      case 'Evaluation':
        return config.function ? eval(config.function) : value;
      default:
        return value || '';
    }
  }

  return value;
};

export const getInputs = async (state: CreditProcessState, dataIntegration: DataIntegration) => {
  const allInputs: Record<string, VariableValue> = {};

  dataIntegration.inputs.forEach((input) => {
    allInputs[input.input_name] = (input.assigned_variable
      ? state[input.assigned_variable.title]
      : input.assigned_value) as VariableValue;
  });

  if (Array.isArray(dataIntegration.secrets)) {
    await Promise.all(dataIntegration.secrets.map(async (secret) => {
      allInputs[secret.input_name] = await appConfigLoader.getSecret(secret.secret_key);
    }));
  }

  return allInputs;
};

const changeRequestOptionsByInputs = (
  inputs: Record<string, VariableValue>,
  dataIntegration: DataIntegration,
  requestOptions: IRequestOptions,
) => {
  const { path_variable, request_bearer_token } = inputs;

  requestOptions.path = generateDynamicPath(requestOptions.path, inputs);

  if (path_variable) {
    requestOptions.path = `${requestOptions.path}/${inputs[path_variable as string]}`;
  }

  const headers = getHeadersFromInputs(inputs, dataIntegration);

  if (request_bearer_token) {
    headers['Authorization'] = `Bearer ${request_bearer_token}`;
  }

  requestOptions.headers = Object.assign(
    requestOptions.headers,
    headers,
  );
};

const getHeadersFromInputs = (
  inputs: Record<string, VariableValue>,
  dataIntegration: DataIntegration,
) => {
  return getInputFields(dataIntegration)
    .reduce((headers, input) => {
      if (input.header && inputs[input.input_name]) {
        headers[input.input_name] = inputs[input.input_name];
      }

      return headers;
    }, {} as Record<string, VariableValue>);
};

const getInputFields = (dataIntegration: DataIntegration) => {
  const inputFields: SegmentInputVariable[] = [];

  if (Array.isArray(dataIntegration.inputs)) {
    inputFields.push(...dataIntegration.inputs);
  }

  if (Array.isArray(dataIntegration.secrets)) {
    inputFields.push(...dataIntegration.secrets);
  }

  return inputFields;
};
