import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  registeredAt: string;
}

interface Order {
  id: string;
  userId: string;
  items: {
    id: number;
    title: string;
    price: string;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  budget?: string;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  orders: Order[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addOrder: (order: Omit<Order, 'id' | 'userId' | 'createdAt'>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('adstore-user');
    const savedOrders = localStorage.getItem('adstore-orders');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    // Save orders to localStorage when they change
    localStorage.setItem('adstore-orders', JSON.stringify(orders));
  }, [orders]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data - in real app, this would come from API
    const mockUser: User = {
      id: '1',
      name: 'Иван Петров',
      email: email,
      company: 'ООО Инновации',
      phone: '+7 (999) 123-45-67',
      registeredAt: '2024-01-15T10:00:00Z'
    };
    
    setUser(mockUser);
    localStorage.setItem('adstore-user', JSON.stringify(mockUser));
    
    // Load user orders
    const userOrders = orders.filter(order => order.userId === mockUser.id);
    if (userOrders.length === 0) {
      // Add some mock orders for demo
      const mockOrders: Order[] = [
        {
          id: '1',
          userId: mockUser.id,
          items: [
            { id: 1, title: 'Google Ads', price: 'от 15 000 ₽', quantity: 1 },
            { id: 2, title: 'Яндекс.Директ', price: 'от 12 000 ₽', quantity: 1 }
          ],
          totalAmount: 27000,
          status: 'completed',
          createdAt: '2024-01-20T14:30:00Z',
          budget: '100000',
          message: 'Нужна настройка контекстной рекламы для интернет-магазина'
        },
        {
          id: '2',
          userId: mockUser.id,
          items: [
            { id: 3, title: 'Facebook & Instagram', price: 'от 20 000 ₽', quantity: 1 }
          ],
          totalAmount: 20000,
          status: 'in_progress',
          createdAt: '2024-01-25T09:15:00Z',
          budget: '50000',
          message: 'Продвижение нового продукта в соцсетях'
        }
      ];
      setOrders(prevOrders => [...prevOrders, ...mockOrders]);
    }
    
    return true;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      company: userData.company,
      phone: userData.phone,
      registeredAt: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem('adstore-user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adstore-user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('adstore-user', JSON.stringify(updatedUser));
    }
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'userId' | 'createdAt'>) => {
    if (user) {
      const newOrder: Order = {
        ...orderData,
        id: Date.now().toString(),
        userId: user.id,
        createdAt: new Date().toISOString()
      };
      setOrders(prevOrders => [...prevOrders, newOrder]);
    }
  };

  const value: AuthContextType = {
    user,
    orders: user ? orders.filter(order => order.userId === user.id) : [],
    login,
    register,
    logout,
    updateProfile,
    addOrder
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};