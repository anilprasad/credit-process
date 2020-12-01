declare module 'periodicjs' {
  import * as AWS from 'aws-sdk';
  import { Document, Model } from 'mongoose';

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
