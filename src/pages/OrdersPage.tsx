
import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Coffee, Printer, Milk, Banana, Juice, Soda } from 'lucide-react';
import { Drink, OrderItem } from '../types';
import { createOrder, getDrinks } from '../services/cafeService';
import { printTicket } from '../services/ticketService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OrdersPage: React.FC = () => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [drinks] = useState<Drink[]>(getDrinks());
  const [categoryFilter, setCategoryFilter] = useState<string>("Tous");
  
  const categories = useMemo(() => {
    const cats = ["Tous", ...new Set(drinks.map(drink => drink.category))];
    return cats.sort();
  }, [drinks]);
  
  const filteredDrinks = useMemo(() => {
    return categoryFilter === "Tous" 
      ? drinks 
      : drinks.filter(drink => drink.category === categoryFilter);
  }, [drinks, categoryFilter]);
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Café": return <Coffee className="h-5 w-5" />;
      case "Jus": return <Juice className="h-5 w-5" />;
      case "Soda": return <Soda className="h-5 w-5" />;
      case "Boisson": return <Milk className="h-5 w-5" />;
      case "Eau": return <Milk className="h-5 w-5" />;
      default: return <Coffee className="h-5 w-5" />;
    }
  };
  
  const addToCart = (drink: Drink) => {
    const existingItem = cart.find(item => item.drinkId === drink.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.drinkId === drink.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([
        ...cart, 
        {
          drinkId: drink.id,
          drinkName: drink.name,
          quantity: 1,
          unitPrice: drink.price
        }
      ]);
    }
  };
  
  const removeFromCart = (drinkId: string) => {
    setCart(cart.filter(item => item.drinkId !== drinkId));
  };
  
  const updateQuantity = (drinkId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(drinkId);
      return;
    }
    
    setCart(cart.map(item => 
      item.drinkId === drinkId ? { ...item, quantity } : item
    ));
  };
  
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };
  
  const submitOrder = () => {
    if (cart.length === 0) {
      alert("Veuillez ajouter au moins une boisson au panier.");
      return;
    }
    
    const order = createOrder(cart);
    
    if (order) {
      printTicket(order);
      setCart([]);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cafeBlack">Commandes</h1>
        <p className="text-gray-500">Créez une nouvelle commande</p>
      </div>
      
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cafeBlack">Menu</h2>
            <div className="w-48">
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger className="border-cafeRed focus:ring-cafeRed">
                  <SelectValue placeholder="Filtrer par catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center">
                        {category !== "Tous" && getCategoryIcon(category)}
                        <span className="ml-2">{category}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDrinks.map((drink) => (
              <div 
                key={drink.id} 
                className="rounded-lg bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105"
              >
                <div className="mb-3 flex justify-between items-center">
                  <div className="flex items-center">
                    {getCategoryIcon(drink.category)}
                    <h3 className="font-medium ml-2">{drink.name}</h3>
                  </div>
                  <span className="text-cafeRed font-semibold">{drink.price.toFixed(2)} €</span>
                </div>
                <p className="mb-3 text-sm text-gray-500">{drink.description}</p>
                <button
                  onClick={() => addToCart(drink)}
                  className="w-full rounded-md bg-cafeRed py-2 text-white transition-colors hover:bg-red-700"
                >
                  Ajouter
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-96">
          <h2 className="mb-4 text-xl font-semibold text-cafeBlack">Panier</h2>
          
          <div className="rounded-lg bg-white p-4 shadow-md">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Coffee size={48} className="mb-2" />
                <p>Votre panier est vide</p>
              </div>
            ) : (
              <>
                <div className="mb-4 max-h-72 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.drinkId} className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{item.drinkName}</p>
                        <p className="text-sm text-gray-500">{item.unitPrice.toFixed(2)} € / unité</p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.drinkId, item.quantity - 1)}
                          className="h-8 w-8 rounded-md bg-gray-100 text-cafeBlack hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.drinkId, item.quantity + 1)}
                          className="h-8 w-8 rounded-md bg-gray-100 text-cafeBlack hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mb-4 border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold text-cafeRed">{calculateTotal().toFixed(2)} €</span>
                  </div>
                </div>
                
                <button
                  onClick={submitOrder}
                  className="flex w-full items-center justify-center rounded-md bg-cafeRed py-3 font-medium text-white transition-colors hover:bg-red-700"
                >
                  <Printer size={18} className="mr-2" />
                  Valider et Imprimer Ticket
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
