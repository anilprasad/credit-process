export default interface Organization {
  _id: string;
  association: {
    users: any[];
    client: any;
  }
  name: string;
  entitytype: string;
}
