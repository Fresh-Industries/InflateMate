'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback
} from 'react';

export interface OnboardingFormData {
  businessName: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
  businessPhone: string;
  businessEmail: string;
}

interface OnboardingState {
  currentStep: number;
  formData: OnboardingFormData;
  connectedAccountId: string | null;
  businessId: string | null;
  newlyCreatedOrg: string | null;
  isLoading: boolean;
  error: boolean;
  isCreatingAccountLink: boolean;
}

interface OnboardingContextValue {
  state: OnboardingState;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  setConnectedAccountId: (id: string | null) => void;
  setBusinessId: (id: string | null) => void;
  setNewlyCreatedOrg: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
  setIsCreatingAccountLink: (creating: boolean) => void;
  clearOnboardingData: () => void;
  resetToStep: (step: number) => void;
}

const STORAGE_KEY = 'inflatemate_onboarding_data';

const initialFormData: OnboardingFormData = {
  businessName: '',
  businessAddress: '',
  businessCity: '',
  businessState: '',
  businessZip: '',
  businessPhone: '',
  businessEmail: '',
};

const initialState: OnboardingState = {
  currentStep: 1,
  formData: initialFormData,
  connectedAccountId: null,
  businessId: null,
  newlyCreatedOrg: null,
  isLoading: false,
  error: false,
  isCreatingAccountLink: false,
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          ...parsedData,
          // Reset loading and error states on page refresh
          isLoading: false,
          error: false,
        }));
      }
    } catch (error) {
      console.warn('Failed to load onboarding data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save onboarding data to localStorage:', error);
    }
  }, [state]);

  const setCurrentStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const updateFormData = useCallback((data: Partial<OnboardingFormData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data }
    }));
  }, []);

  const setConnectedAccountId = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, connectedAccountId: id }));
  }, []);

  const setBusinessId = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, businessId: id }));
  }, []);

  const setNewlyCreatedOrg = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, newlyCreatedOrg: id }));
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: boolean) => {
    setState(prev => ({ ...prev, error: error }));
  }, []);

  const setIsCreatingAccountLink = useCallback((creating: boolean) => {
    setState(prev => ({ ...prev, isCreatingAccountLink: creating }));
  }, []);

  const clearOnboardingData = useCallback(() => {
    setState(initialState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear onboarding data from localStorage:', error);
    }
  }, []);

  const resetToStep = useCallback((step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: step,
      isLoading: false,
      error: false,
      isCreatingAccountLink: false,
      // Clear data that comes after the target step
      ...(step < 3 && {
        connectedAccountId: null,
        businessId: null,
        newlyCreatedOrg: null,
      }),
    }));
  }, []);

  const value: OnboardingContextValue = {
    state,
    setCurrentStep,
    updateFormData,
    setConnectedAccountId,
    setBusinessId,
    setNewlyCreatedOrg,
    setIsLoading,
    setError,
    setIsCreatingAccountLink,
    clearOnboardingData,
    resetToStep,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used inside OnboardingProvider');
  }
  return context;
} 