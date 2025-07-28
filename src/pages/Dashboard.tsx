import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import Icon from '@/components/ui/icon';

const Dashboard = () => {
  const { user, orders, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
    navigate('/');
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileData);
    setIsEditProfileOpen(false);
    toast({
      title: "Профиль обновлен",
      description: "Ваши данные успешно сохранены",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Выполнен';
      case 'in_progress': return 'В работе';
      case 'confirmed': return 'Подтвержден';
      case 'pending': return 'Ожидает';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const activeOrders = orders.filter(order => ['pending', 'confirmed', 'in_progress'].includes(order.status)).length;

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
              <Button variant="outline" onClick={() => navigate('/')}>
                <Icon name="Home" size={16} className="mr-2" />
                На главную
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать, {user.name}!
          </h1>
          <p className="text-gray-600">
            Управляйте своими заказами и настройками аккаунта
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего потрачено</CardTitle>
              <Icon name="DollarSign" size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSpent.toLocaleString()} ₽</div>
              <p className="text-xs text-muted-foreground">
                За все время
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Выполненных заказов</CardTitle>
              <Icon name="CheckCircle" size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">
                Успешно завершено
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активных заказов</CardTitle>
              <Icon name="Clock" size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders}</div>
              <p className="text-xs text-muted-foreground">
                В процессе выполнения
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Мои заказы</TabsTrigger>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>История заказов</CardTitle>
                <CardDescription>
                  Все ваши заказы и их текущий статус
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="ShoppingBag" size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Пока нет заказов</h3>
                    <p className="text-gray-500 mb-4">Вернитесь на главную страницу и выберите услуги</p>
                    <Button onClick={() => navigate('/')}>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Создать заказ
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">Заказ #{order.id}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Услуги:</h4>
                          <ul className="space-y-1">
                            {order.items.map(item => (
                              <li key={item.id} className="flex justify-between text-sm">
                                <span>{item.title} (x{item.quantity})</span>
                                <span className="text-gray-500">{item.price}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {order.message && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-1">Комментарий:</h4>
                            <p className="text-sm text-gray-600">{order.message}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center pt-4 border-t">
                          <span className="font-semibold">
                            Итого: {order.totalAmount.toLocaleString()} ₽
                          </span>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">
                              <Icon name="Eye" size={14} className="mr-1" />
                              Детали
                            </Button>
                            {order.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm"
                                  onClick={() => navigate(`/payment?orderId=${order.id}`)}
                                >
                                  <Icon name="CreditCard" size={14} className="mr-1" />
                                  Оплатить
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Icon name="X" size={14} className="mr-1" />
                                  Отменить
                                </Button>
                              </>
                            )}
                            {order.status === 'confirmed' && (
                              <Badge variant="secondary">
                                <Icon name="Clock" size={12} className="mr-1" />
                                Оплачен, в работе
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Информация профиля</CardTitle>
                  <CardDescription>
                    Ваши личные данные и контактная информация
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Имя</Label>
                    <p className="text-lg">{user.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  {user.company && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Компания</Label>
                      <p className="text-lg">{user.company}</p>
                    </div>
                  )}
                  {user.phone && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Телефон</Label>
                      <p className="text-lg">{user.phone}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Дата регистрации</Label>
                    <p className="text-lg">
                      {new Date(user.registeredAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  
                  <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Icon name="Edit" size={16} className="mr-2" />
                        Редактировать профиль
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактирование профиля</DialogTitle>
                        <DialogDescription>
                          Обновите ваши личные данные
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name">Имя</Label>
                          <Input
                            id="edit-name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-email">Email</Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-company">Компания</Label>
                          <Input
                            id="edit-company"
                            value={profileData.company}
                            onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-phone">Телефон</Label>
                          <Input
                            id="edit-phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                            Отмена
                          </Button>
                          <Button type="submit">
                            Сохранить
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Настройки безопасности</CardTitle>
                  <CardDescription>
                    Управление паролем и безопасностью аккаунта
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Icon name="Key" size={16} className="mr-2" />
                    Изменить пароль
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Icon name="Shield" size={16} className="mr-2" />
                    Двухфакторная аутентификация
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Icon name="Download" size={16} className="mr-2" />
                    Скачать данные
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить аккаунт
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;