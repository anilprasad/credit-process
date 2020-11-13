declare module 'periodicjs' {
  import { Document, Model } from 'mongoose';
  import * as AWS from 'aws-sdk';

  export const settings: {
    extensions: {
      '@digifi/periodicjs.ext.packagecloud': {
        client: {
          accessKeyId: string;
          accessKey: string;
          region: string;
        };
      };
      '@digifi-los/reactapp': {
        encryption_key_path: string;
      };
    };
  };

  interface IData {
    model: Model<Document>;
    load: Model<Document>['findOne'];
  }

  export const datas: Map<string, IData>;
  export const aws: {
    machinelearning: AWS.MachineLearning;
    sagemakerruntime: AWS.SageMakerRuntime;
  };
}
