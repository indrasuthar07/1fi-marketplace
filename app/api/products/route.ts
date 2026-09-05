import { products } from '@/lib/catalog';
export function GET() {
  return Response.json({ products, demo: true });
}
