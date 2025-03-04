import  { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  orderId: string;
  tableNumber: string;
  items: OrderItem[];
  total: number;
}

export default function OrderPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Parse order details from URL
    if (router.query.details) {
      try {
        const decodedDetails = decodeURIComponent(router.query.details as string);
        const parsedDetails = JSON.parse(decodedDetails) as OrderDetails;
        setOrderDetails(parsedDetails);
      } catch (error) {
        console.error('Error parsing order details:', error);
      }
    }
  }, [router.query]);

  if (!orderDetails) {
    return (
      <div className="container mx-auto p-4 text-center">
        {t("order.notFound")}
      </div>
    );
  }

  const formatPrice = (price: number) => `${price.toLocaleString()} ₸`;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{t("order.details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <div className="font-semibold">
                {t("cart.tableNumberLabel")}: {orderDetails.tableNumber}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("order.orderId")}: {orderDetails.orderId}
              </div>
            </div>

            <div className="border rounded-lg">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">{t("cart.name")}</th>
                    <th className="p-3 text-right">{t("cart.quantity")}</th>
                    <th className="p-3 text-right">{t("cart.price")}</th>
                    <th className="p-3 text-right">{t("cart.sum")}</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">{item.title}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">{formatPrice(item.price)}</td>
                      <td className="p-3 text-right">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center font-bold text-lg">
              <span>{t("cart.total")}:</span>
              <span>{formatPrice(orderDetails.total)}</span>
            </div>

            <div className="flex gap-2">
              <Button 
                className="w-full" 
                onClick={() => window.print()}
              >
                {t("order.print")}
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => router.push('/')}
              >
                {t("order.backToMenu")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}