import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import Icon from '@/components/ui/icon';

interface PaymentOrder {
  id: string;
  items: { id: number; title: string; price: string; quantity: number; }[];
  totalAmount: number;
  status: string;
}

const Payment = () => {
  const { user, orders, updateOrderStatus } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentProof, setPaymentProof] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const order = orders.find(o => o.id === orderId) as PaymentOrder | undefined;

  const CARD_NUMBER = '2200701320908210';
  const CARD_HOLDER = 'AdStore';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!order) {
      toast({
        title: "Заказ не найден",
        description: "Заказ с указанным ID не существует",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }
  }, [user, order, navigate]);

  if (!user || !order) {
    return null;
  }

  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText(CARD_NUMBER);
    toast({
      title: "Номер карты скопирован",
      description: "Номер карты скопирован в буфер обмена",
    });
  };

  const handlePaymentConfirmation = () => {
    if (!paymentProof.trim()) {
      toast({
        title: "Заполните поле",
        description: "Укажите номер операции или загрузите чек",
        variant: "destructive",
      });
      return;
    }

    setPaymentConfirmed(true);
    setIsConfirmDialogOpen(false);
    
    // Update order status to confirmed (paid)
    if (order) {
      updateOrderStatus(order.id, 'confirmed');
    }
    
    toast({
      title: "Оплата подтверждена!",
      description: "Мы проверим платеж в течение 10 минут и начнем работу над заказом",
    });

    // Here you would typically send payment confirmation to backend
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Оплата заказа ${order.id} на сумму ${order.totalAmount} руб. Карта: ${CARD_NUMBER}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Icon name="Megaphone" size={32} className="text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">AdStore</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                К заказам
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Оплата заказа #{order.id}
          </h1>
          <p className="text-gray-600">
            Переведите указанную сумму на карту для подтверждения заказа
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Детали заказа</CardTitle>
              <CardDescription>
                Информация о выбранных услугах
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-500">Количество: {item.quantity}</p>
                  </div>
                  <span className="font-medium">{item.price}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Итого к оплате:</span>
                <span className="text-primary text-2xl">{order.totalAmount.toLocaleString()} ₽</span>
              </div>
              <Badge variant="secondary" className="w-fit">
                <Icon name="Clock" size={14} className="mr-1" />
                Статус: {order.status === 'pending' ? 'Ожидает оплаты' : 'Оплачен'}
              </Badge>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Способы оплаты</CardTitle>
              <CardDescription>
                Выберите удобный способ перевода средств
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Card Transfer */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-3">
                  <Icon name="CreditCard" size={20} className="text-primary mr-2" />
                  <h3 className="font-semibold">Перевод на карту</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-500">Номер карты</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        value={CARD_NUMBER} 
                        readOnly 
                        className="font-mono"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCopyCardNumber}
                      >
                        <Icon name="Copy" size={14} />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Получатель</Label>
                    <Input value={CARD_HOLDER} readOnly />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Сумма перевода</Label>
                    <Input 
                      value={`${order.totalAmount.toLocaleString()} ₽`} 
                      readOnly 
                      className="font-bold text-primary"
                    />
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-4 border rounded-lg text-center">
                <div className="flex items-center justify-center mb-3">
                  <Icon name="QrCode" size={20} className="text-primary mr-2" />
                  <h3 className="font-semibold">QR-код для оплаты</h3>
                </div>
                <div className="bg-white p-4 rounded-lg inline-block mb-3">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR код для оплаты" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Отсканируйте QR-код в банковском приложении
                </p>
              </div>

              {/* Payment Banks */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Icon name="Smartphone" size={16} className="mr-2" />
                  Банковские приложения
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start text-sm">
                    <Icon name="Smartphone" size={14} className="mr-2" />
                    Сбербанк Онлайн
                  </Button>
                  <Button variant="outline" className="justify-start text-sm">
                    <Icon name="Smartphone" size={14} className="mr-2" />
                    Тинькoff
                  </Button>
                  <Button variant="outline" className="justify-start text-sm">
                    <Icon name="Smartphone" size={14} className="mr-2" />
                    ВТБ Онлайн
                  </Button>
                  <Button variant="outline" className="justify-start text-sm">
                    <Icon name="Smartphone" size={14} className="mr-2" />
                    Альфа-Банк
                  </Button>
                </div>
              </div>

              {paymentConfirmed ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Icon name="CheckCircle" size={20} className="text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Оплата подтверждена</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Мы проверяем ваш платеж. Уведомление придет в личный кабинет.
                  </p>
                </div>
              ) : (
                <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Icon name="Check" size={20} className="mr-2" />
                      Подтвердить оплату
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Подтверждение оплаты</DialogTitle>
                      <DialogDescription>
                        Укажите номер операции или другие данные для подтверждения платежа
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="payment-proof">
                          Номер операции / чек / скриншот
                        </Label>
                        <Input
                          id="payment-proof"
                          placeholder="Например: 123456789 или опишите детали перевода"
                          value={paymentProof}
                          onChange={(e) => setPaymentProof(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsConfirmDialogOpen(false)}
                        >
                          Отмена
                        </Button>
                        <Button onClick={handlePaymentConfirmation}>
                          <Icon name="Send" size={16} className="mr-2" />
                          Подтвердить
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Инструкция по оплате</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="CreditCard" size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">1. Переведите деньги</h3>
                <p className="text-sm text-gray-600">
                  Используйте банковское приложение или QR-код для перевода точной суммы
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Check" size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">2. Подтвердите платеж</h3>
                <p className="text-sm text-gray-600">
                  Нажмите кнопку "Подтвердить оплату" и укажите номер операции
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Clock" size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">3. Ожидайте проверки</h3>
                <p className="text-sm text-gray-600">
                  Мы проверим платеж в течение 10 минут и начнем работу над заказом
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Icon name="HelpCircle" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Нужна помощь?</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Если у вас возникли проблемы с оплатой, свяжитесь с нашей поддержкой
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Icon name="MessageCircle" size={14} className="mr-2" />
                    Чат поддержки
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="Phone" size={14} className="mr-2" />
                    +7 (495) 123-45-67
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;