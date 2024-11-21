export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  telephone_number: string;
  password: string;
  created_at?: Date;
}
