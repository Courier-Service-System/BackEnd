export interface shippingCreation {
  id?: number;
  user_id: number;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
  description: string;
  weight: number;
  created_at?: Date;
}
