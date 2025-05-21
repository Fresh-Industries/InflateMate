// src/hooks/useSelectedItems.ts

import { useState, useCallback } from 'react';
import { InventoryItem, SelectedItem } from '@/types/booking';

export function useSelectedItems() {
  const [selectedItems, setSelectedItems] = useState<Map<string, SelectedItem>>(new Map());

  const selectInventoryItem = useCallback((item: InventoryItem, quantity: number = 1) => {
    setSelectedItems(prev => {
      const newMap = new Map(prev);
      if (quantity <= 0) {
        newMap.delete(item.id);
      } else {
        // Ensure quantity doesn't exceed available stock when selecting initially
        const effectiveQuantity = Math.min(quantity, item.quantity);
        if (effectiveQuantity > 0) {
          newMap.set(item.id, { item, quantity: effectiveQuantity });
        } else {
          newMap.delete(item.id); // Remove if available quantity is 0
        }
      }
      return newMap;
    });
  }, []);

  const updateQuantity = useCallback((item: InventoryItem, delta: number) => {
    setSelectedItems(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(item.id);
      
      if (current) {
        const newQuantity = Math.max(0, current.quantity + delta);
        
        if (newQuantity <= 0) {
          newMap.delete(item.id);
        } else {
          // Ensure we don't exceed available quantity
          const effectiveQuantity = Math.min(newQuantity, item.quantity);
          if (effectiveQuantity > 0) {
            newMap.set(item.id, { item, quantity: effectiveQuantity });
          } else {
            newMap.delete(item.id);
          }
        }
      }
      
      return newMap;
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      const newMap = new Map(prev);
      newMap.delete(itemId);
      return newMap;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Map());
  }, []);

  // New function to batch select multiple items
  const batchSelectItems = useCallback((items: Array<{ item: InventoryItem; quantity: number }>) => {
    setSelectedItems(prev => {
      const newMap = new Map(prev);
      items.forEach(({ item, quantity }) => {
        if (quantity <= 0) {
          newMap.delete(item.id);
        } else {
          const effectiveQuantity = Math.min(quantity, item.quantity);
          if (effectiveQuantity > 0) {
            newMap.set(item.id, { item, quantity: effectiveQuantity });
          } else {
            newMap.delete(item.id);
          }
        }
      });
      return newMap;
    });
  }, []);

  const getTotalQuantity = useCallback(() => {
    let total = 0;
    selectedItems.forEach(item => {
      total += item.quantity;
    });
    return total;
  }, [selectedItems]);

  const getTotalPrice = useCallback(() => {
    let total = 0;
    selectedItems.forEach(item => {
      total += item.item.price * item.quantity;
    });
    return total;
  }, [selectedItems]);

  return {
    selectedItems,
    selectInventoryItem,
    updateQuantity,
    removeItem,
    clearSelection,
    batchSelectItems,
    getTotalQuantity,
    getTotalPrice,
  };
}
