import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'Все услуги' },
    { id: 'contextual', name: 'Контекстная реклама' },
    { id: 'social', name: 'Соцсети' },
    { id: 'display', name: 'Медийная реклама' },
    { id: 'video', name: 'Видеореклама' },
  ];

  const services = [
    {
      id: 1,
      title: 'Google Ads',
      description: 'Контекстная реклама в поисковой системе Google',
      price: 'от 15 000 ₽',
      category: 'contextual',
      features: ['Настройка кампаний', 'Подбор ключевых слов', 'Аналитика'],
      popularity: 'Популярно',
    },
    {
      id: 2,
      title: 'Яндекс.Директ',
      description: 'Реклама в поисковой системе Яндекс и РСЯ',
      price: 'от 12 000 ₽',
      category: 'contextual',
      features: ['Поиск и РСЯ', 'Оптимизация', 'Отчёты'],
      popularity: 'Хит продаж',
    },
    {
      id: 3,
      title: 'Facebook & Instagram',
      description: 'Таргетированная реклама в социальных сетях Meta',
      price: 'от 20 000 ₽',
      category: 'social',
      features: ['Настройка аудиторий', 'Креативы', 'A/B тестирование'],
      popularity: null,
    },
    {
      id: 4,
      title: 'ВКонтакте Реклама',
      description: 'Продвижение в крупнейшей социальной сети России',
      price: 'от 10 000 ₽',
      category: 'social',
      features: ['Таргетинг по интересам', 'Ретаргетинг', 'Сообщества'],
      popularity: null,
    },
    {
      id: 5,
      title: 'YouTube Ads',
      description: 'Видеореклама на крупнейшей видеоплатформе',
      price: 'от 25 000 ₽',
      category: 'video',
      features: ['TrueView реклама', 'Bumper ads', 'Аналитика'],
      popularity: 'Новинка',
    },
    {
      id: 6,
      title: 'Медийная реклама',
      description: 'Баннерная реклама на популярных сайтах',
      price: 'от 18 000 ₽',
      category: 'display',
      features: ['RTB закупки', 'Ретаргетинг', 'Креативы'],
      popularity: null,
    },
  ];

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const faqItems = [
    {
      question: 'Как быстро запустится реклама?',
      answer: 'Обычно настройка занимает 1-3 рабочих дня. Контекстная реклама запускается быстрее всего, медийная может потребовать дополнительного времени на модерацию креативов.',
    },
    {
      question: 'Какой минимальный бюджет для старта?',
      answer: 'Минимальный рекламный бюджет зависит от выбранной площадки. Для Google Ads и Яндекс.Директ рекомендуем от 30 000 ₽ в месяц, для соцсетей — от 20 000 ₽.',
    },
    {
      question: 'Предоставляете ли вы отчеты?',
      answer: 'Да, мы предоставляем подробные еженедельные отчеты с анализом эффективности кампаний, рекомендациями по оптимизации и планами на следующий период.',
    },
    {
      question: 'Можно ли изменить бюджет в процессе?',
      answer: 'Конечно! Бюджет можно увеличивать или уменьшать в любой момент. Мы адаптируем стратегии под новые условия и оптимизируем кампании.',
    },
  ];

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
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-primary transition-colors">Услуги</a>
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors">О нас</a>
              <a href="#faq" className="text-gray-700 hover:text-primary transition-colors">FAQ</a>
            </nav>
            <Button>Связаться с нами</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Профессиональные<br />рекламные услуги
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Увеличьте продажи с помощью эффективной интернет-рекламы.<br />
              Работаем со всеми площадками и форматами.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Icon name="Calculator" size={20} className="mr-2" />
                Рассчитать стоимость
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                <Icon name="Phone" size={20} className="mr-2" />
                Бесплатная консультация
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Каталог услуг</h2>
            <p className="text-xl text-gray-600">Выберите подходящий формат рекламы для вашего бизнеса</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                placeholder="Поиск услуг..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    {service.popularity && (
                      <Badge variant={service.popularity === 'Хит продаж' ? 'default' : 'secondary'}>
                        {service.popularity}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Icon name="Check" size={16} className="text-green-500 mr-2" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full">
                      <Icon name="ShoppingCart" size={16} className="mr-2" />
                      Заказать услугу
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">О нас</h2>
              <p className="text-lg text-gray-600 mb-6">
                Мы — команда экспертов в области интернет-маркетинга с опытом работы более 8 лет. 
                Помогаем бизнесу любого масштаба эффективно продвигаться в интернете.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-gray-600">Успешных проектов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">8</div>
                  <div className="text-gray-600">Лет на рынке</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">98%</div>
                  <div className="text-gray-600">Довольных клиентов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-gray-600">Поддержка</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-gray-100 rounded-lg p-8 w-full max-w-md">
                <Icon name="Users" size={64} className="text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-center mb-4">Наша команда</h3>
                <p className="text-gray-600 text-center">
                  Сертифицированные специалисты Google, Яндекс и Meta, готовые решить любые задачи
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Часто задаваемые вопросы</h2>
            <p className="text-xl text-gray-600">Ответы на популярные вопросы о наших услугах</p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Готовы начать?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Получите бесплатную консультацию и персональное предложение для вашего бизнеса
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-primary">
              <Icon name="MessageCircle" size={20} className="mr-2" />
              Написать в чат
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
              <Icon name="Calendar" size={20} className="mr-2" />
              Записаться на встречу
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Icon name="Megaphone" size={24} className="text-primary mr-2" />
                <span className="text-xl font-bold">AdStore</span>
              </div>
              <p className="text-gray-400">
                Профессиональные рекламные услуги для роста вашего бизнеса
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Услуги</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Контекстная реклама</li>
                <li>Реклама в соцсетях</li>
                <li>Медийная реклама</li>
                <li>Видеореклама</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Компания</h3>
              <ul className="space-y-2 text-gray-400">
                <li>О нас</li>
                <li>Кейсы</li>
                <li>Блог</li>
                <li>Карьера</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2 text-gray-400">
                <li>+7 (495) 123-45-67</li>
                <li>info@adstore.ru</li>
                <li>Москва, ул. Примерная, 123</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AdStore. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;