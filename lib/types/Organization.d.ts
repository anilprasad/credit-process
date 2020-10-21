export default class Organization {
  _id: string;
  name: String;
  entitytype: String;
  association: {
    users: any[];
    client: any;
  }
}
