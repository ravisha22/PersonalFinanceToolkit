import { createContext, useContext, useState, ReactNode } from 'react';

export interface PortfolioData {
  // Income & Tax
  grossSalary: number;
  margTax: number;
  // Cash & Savings
  savingsBalance: number;
  monthlySavingsContrib: number;
  // Property & Mortgage
  propertyValue: number;
  mortgageBalance: number;
  mortgageRate: number;
  mortgageYearsRemaining: number;
  // Investments (ETF / shares)
  etfValue: number;
  monthlyEtfContrib: number;
  etfReturn: number;
  // Superannuation
  superBalance: number;
  monthlySuperContrib: number;
  // Living expenses — itemised (annual $)
  expRent: number;
  expGroceries: number;
  expDining: number;
  expUtilities: number;
  expInternet: number;
  expTransport: number;
  expHealth: number;
  expInsurance: number;
  expEntertainment: number;
  expClothing: number;
  expEducation: number;
  expChildcare: number;
  expTravel: number;
  expGym: number;
  expHomeMaint: number;
  expPets: number;
  expMisc: number;
}

export const PORTFOLIO_EMPTY: PortfolioData = {
  grossSalary: 0, margTax: 0,
  savingsBalance: 0, monthlySavingsContrib: 0,
  propertyValue: 0, mortgageBalance: 0, mortgageRate: 0, mortgageYearsRemaining: 0,
  etfValue: 0, monthlyEtfContrib: 0, etfReturn: 0,
  superBalance: 0, monthlySuperContrib: 0,
  expRent: 0, expGroceries: 0, expDining: 0, expUtilities: 0,
  expInternet: 0, expTransport: 0, expHealth: 0, expInsurance: 0,
  expEntertainment: 0, expClothing: 0, expEducation: 0, expChildcare: 0,
  expTravel: 0, expGym: 0, expHomeMaint: 0, expPets: 0, expMisc: 0,
};

export function totalAnnualExpenses(p: PortfolioData): number {
  return (
    p.expRent + p.expGroceries + p.expDining + p.expUtilities +
    p.expInternet + p.expTransport + p.expHealth + p.expInsurance +
    p.expEntertainment + p.expClothing + p.expEducation + p.expChildcare +
    p.expTravel + p.expGym + p.expHomeMaint + p.expPets + p.expMisc
  );
}

interface PortfolioContextType {
  portfolio: PortfolioData;
  setPortfolio: (updates: Partial<PortfolioData>) => void;
}

const PortfolioContext = createContext<PortfolioContextType>({
  portfolio: PORTFOLIO_EMPTY,
  setPortfolio: () => {},
});

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolioState] = useState<PortfolioData>(PORTFOLIO_EMPTY);
  const setPortfolio = (updates: Partial<PortfolioData>) =>
    setPortfolioState(prev => ({ ...prev, ...updates }));
  return (
    <PortfolioContext.Provider value={{ portfolio, setPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
