export type Revenue = {
  month: string;
  revenue: number;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  status: string;
  date: Date;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type InvoiceDB = {
  id: string;
  amount: number;
  name: string;
  email: string;
  image_url: string;
  date: Date;
};

export type CustomerWithStats = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
};
