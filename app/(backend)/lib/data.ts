import { Revenue } from './definitions';
import { prisma } from './prisma';
import { formatCurrency } from './utils';

const ITEMS_PER_PAGE = 6;

export async function fetchRevenue() {
  try {
    const data = await prisma.revenue.findMany({
      orderBy: { month: 'asc' },
    });


    return data as Revenue[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener los datos de ingresos.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await prisma.$queryRaw<
      { id: string; amount: number; name: string; image_url: string; email: string }[]
    >`
      SELECT invoices.id, invoices.amount, customers.name, customers.image_url, customers.email
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5
    `;

    const latestInvoices = data.map((invoice: {
      id: string;
      amount: number;
      name: string;
      image_url: string;
      email: string;
    }) => ({
      id: invoice.id,
      name: invoice.name,
      image_url: invoice.image_url,
      email: invoice.email,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const invoiceCount = await prisma.invoice.count();
    const customerCount = await prisma.customer.count();
    const invoiceStatus = await prisma.invoice.aggregate({
      _sum: { amount: true },
    });

    return {
      numberOfCustomers: customerCount,
      numberOfInvoices: invoiceCount,
      totalPaidUsers: invoiceStatus._sum.amount ? invoiceStatus._sum.amount.toNumber() : 0,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchFilteredInvoices(query: string) {
  try {
    const data = await prisma.$queryRaw<
      { id: string; amount: number; name: string; email: string; image_url: string; date: Date }[]
    >`
      SELECT invoices.id, invoices.amount, customers.name, customers.email, customers.image_url, invoices.date
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE 
        customers.name ILIKE ${`%${query}%`}
        OR customers.email ILIKE ${`%${query}%`}
        OR invoices.amount::text ILIKE ${`%${query}%`}
        OR invoices.date::text ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
    `;

    return data.map((invoice: {
      id: string;
      amount: number;
      name: string;
      email: string;
      image_url: string;
      date: Date;
    }) => ({
      id: invoice.id,
      name: invoice.name,
      email: invoice.email,
      image_url: invoice.image_url,
      date: invoice.date.toISOString(),
      amount: formatCurrency(invoice.amount),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await prisma.$queryRaw<{ count: BigInt }[]>`
      SELECT COUNT(*) as count
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE 
        customers.name ILIKE ${`%${query}%`}
        OR customers.email ILIKE ${`%${query}%`}
        OR invoices.amount::text ILIKE ${`%${query}%`}
        OR invoices.date::text ILIKE ${`%${query}%`}
    `;

    return Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices pages.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await prisma.$queryRaw<{ id: string; customer_id: string; amount: number; status: string }[]>`
      SELECT invoices.id, invoices.customer_id, invoices.amount, invoices.status
      FROM invoices
      WHERE invoices.id = ${id}
    `;

    const invoice = data[0];
    return {
      id: invoice.id,
      customer_id: invoice.customer_id,
      amount: formatCurrency(invoice.amount),
      status: invoice.status,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await prisma.customer.findMany({
      orderBy: { name: 'asc' },
    });

    return data.map((customer: { id: string; name: string; email: string; image_url: string }) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      image_url: customer.image_url,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await prisma.$queryRaw<{ id: string; name: string; email: string; image_url: string; total_invoices: number; total_pending: string }[]>`
      SELECT customers.id, customers.name, customers.email, customers.image_url,
        COUNT(invoices.id) as total_invoices,
        COALESCE(SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END), 0) as total_pending
      FROM customers
      LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE 
        customers.name ILIKE ${`%${query}%`}
        OR customers.email ILIKE ${`%${query}%`}
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC
    `;

    return data.map((customer: {
      id: string;
      name: string;
      email: string;
      image_url: string;
      total_invoices: number;
      total_pending: string;
    }) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      image_url: customer.image_url,
      total_invoices: customer.total_invoices,
      total_pending: formatCurrency(parseFloat(customer.total_pending)),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered customers.');
  }
}
