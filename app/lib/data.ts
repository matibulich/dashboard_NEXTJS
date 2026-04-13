import { Revenue } from './definitions';
import { prisma } from './prisma';
import { formatCurrency } from './utils';

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
