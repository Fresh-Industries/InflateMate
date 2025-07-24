// src/hooks/useAvailability.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { InventoryItem, AvailabilitySearchFilters, SelectedItem } from '@/types/booking';
import * as BookingService from '@/services/bookingService'; // Import the service functions
import { useToast } from '@/hooks/use-toast'; // Assuming you have a hook for toasts

const ITEMS_PER_PAGE = 4; // Define this constant here or import it

type UseAvailabilityProps = {
  businessId: string;
  filters: AvailabilitySearchFilters;
  // Callback to notify the parent component when selected items become unavailable
  onUnavailableItemsFound: (unavailableItems: SelectedItem[]) => void;
};

export function useAvailability({ businessId, filters, onUnavailableItemsFound }: UseAvailabilityProps) {
  const { toast } = useToast();
  const [availableInventory, setAvailableInventory] = useState<InventoryItem[]>([]);
  const [isSearchingAvailability, setIsSearchingAvailability] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
   // Track items that *just* became unavailable for transient UI effects
  const [recentlyUnavailableItemIds, setRecentlyUnavailableItemIds] = useState<Set<string>>(new Set());

  // State to hold the currently selected items *within this hook*
  // This is needed to check against *new* availability results
  const [currentSelectedItems, setCurrentSelectedItems] = useState<Map<string, SelectedItem>>(new Map());

   // This function is exposed to the parent to update this hook's view of selected items
  const updateCurrentSelectedItems = useCallback((selected: Map<string, SelectedItem>) => {
     setCurrentSelectedItems(new Map(selected)); // Ensure a new map reference
  }, []);


  // Function to perform the actual availability search
  const searchAvailability = useCallback(async (silent = false) => {
    if (!filters.date) {
      if (!silent) {
        toast({
          title: "Missing Information",
          description: "Please select a date first",
          variant: "destructive"
        });
      }
      return;
    }

    if (!silent) {
      setIsSearchingAvailability(true);
      setHasSearched(true);
      setCurrentPage(1); // Reset to first page on new search
    }

    try {
      if (!silent) {
        console.log(`Searching availability for ${filters.date} from ${filters.startTime} to ${filters.endTime}`);
      }
      
      // Use the existing service function
      const availableItems = await BookingService.searchInventoryAvailability(businessId, filters);
      console.log(`Found ${availableItems.length} available items`);

      // Always update the inventory regardless of silent mode
      setAvailableInventory(availableItems);
      
      // In silent mode, also check for newly unavailable items
      if (silent) {
        checkForUnavailableItems(availableItems, currentSelectedItems);
      } else if (availableItems.length === 0) {
        toast({
          title: "No Availability",
          description: "No inventory items are available for your selected date. Please try a different date.",
          variant: "destructive"
        });
      }
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Availability check error:", error);
      
      // Clear inventory on error
      setAvailableInventory([]);
      
      if (!silent) {
        // Check if this is a notice window violation or other specific error
        const errorMessage = error.message || "Failed to search availability";
        
        // Check for specific notice window error patterns
        if (errorMessage.includes("hours in advance") || errorMessage.includes("days out") || errorMessage.includes("book at least")) {
          toast({
            title: "Invalid Time Selection",
            description: errorMessage,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to search availability. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        console.error("Silent availability check failed:", error);
      }
    } finally {
      if (!silent) {
        setIsSearchingAvailability(false);
      }
    }
  }, [businessId, filters, toast, currentSelectedItems]);

   // Function to check if selected items are still available
   // This function should *not* update the parent component's selected items state directly.
   // It calls a callback (`onUnavailableItemsFound`) to let the parent handle the state update.
  const checkForUnavailableItems = useCallback((currentlyAvailable: InventoryItem[], selected: Map<string, SelectedItem>) => {
    const availableMap = new Map<string, InventoryItem>();
    currentlyAvailable.forEach(item => availableMap.set(item.id, item));

    const newlyUnavailable: SelectedItem[] = [];
    const newlyUnavailableIds = new Set<string>();

    selected.forEach((selectedItem, itemId) => {
      const availableItem = availableMap.get(itemId);

      // Item is completely unavailable or quantity dropped below selected
      if (!availableItem || availableItem.quantity < selectedItem.quantity) {
        const quantityLost = selectedItem.quantity - (availableItem?.quantity || 0);
        if (quantityLost > 0) {
          newlyUnavailable.push({
            item: selectedItem.item,
            quantity: quantityLost // Report how many became unavailable
          });
          newlyUnavailableIds.add(itemId); // Track for animation
        }
      }
    });

    if (newlyUnavailable.length > 0) {
      // Update the available inventory list shown in this hook's state
      setAvailableInventory(currentlyAvailable);

      // Add these to recently unavailable for animation
      setRecentlyUnavailableItemIds(prev => {
        const newSet = new Set(prev);
        newlyUnavailableIds.forEach(id => newSet.add(id));
        return newSet;
      });

      // Notify the parent component which items/quantities are no longer available
      onUnavailableItemsFound(newlyUnavailable);

      // Show toast - kept here as it's directly related to the availability check result
      const itemNames = newlyUnavailable.map(item => item.item.name).join(", ");
      toast({
        title: "Availability Changed",
        description: `Some selected items are now limited or unavailable: ${itemNames}`,
        variant: "destructive"
      });

      // Remove from recently unavailable after animation
      setTimeout(() => {
        setRecentlyUnavailableItemIds(prev => {
          const newSet = new Set(prev);
          newlyUnavailableIds.forEach(id => newSet.delete(id));
          return newSet;
        });
      }, 3000); // Adjust timing as needed
    } else {
      // If no items became unavailable, just update the available list
      setAvailableInventory(currentlyAvailable);
      // And clear any previous "recently unavailable" markers if those items are now fully available or removed
      setRecentlyUnavailableItemIds(prev => {
        const currentIds = new Set(currentlyAvailable.map(item => item.id));
        const newSet = new Set<string>();
        prev.forEach(id => {
          // Only keep markers for items still in the potentially limited list
          if (currentIds.has(id)) {
            newSet.add(id);
          }
        });
        return newSet;
      });
    }
  }, [onUnavailableItemsFound, toast]); // Dependencies: onUnavailableItemsFound, toast (and implicit state accessed inside)


  // Real-time polling effect - more reliable than Supabase subscriptions
  useEffect(() => {
    // Only set up polling when filters are valid
    const canPoll = hasSearched && filters.date && filters.startTime && filters.endTime;

    if (canPoll) {
      console.log(`Setting up availability polling for ${filters.date}`);
      
      // Initial check immediately when component mounts or filters change
      searchAvailability(true);
      
      // Set up short interval polling (5 seconds) for immediate responsiveness
      const quickPollInterval = setInterval(() => {
        console.log("Quick polling for availability updates...");
        searchAvailability(true);
      }, 5000); // Poll every 5 seconds for responsive updates
      
      // Cleanup function
      return () => {
        console.log(`Cleaning up availability polling for ${filters.date}`);
        clearInterval(quickPollInterval);
      };
    }

    return undefined;
  }, [businessId, filters, hasSearched, searchAvailability]);


    // Pagination logic for the available inventory displayed
    const paginatedAvailableInventory = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return availableInventory.slice(startIndex, endIndex);
    }, [availableInventory, currentPage]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const totalPages = Math.ceil(availableInventory.length / ITEMS_PER_PAGE);


  return {
    availableInventory: paginatedAvailableInventory, // Return paginated inventory for the current page
    totalAvailableItems: availableInventory.length, // Expose total count for pagination controls
    isSearchingAvailability,
    hasSearched,
    currentPage,
    setCurrentPage, // Expose setter for pagination UI
    searchAvailability, // Expose function to trigger manual search
    recentlyUnavailableItemIds, // Expose for UI animation/styling
    updateCurrentSelectedItems, // Expose function to keep hook's internal selected items updated
  };
}
