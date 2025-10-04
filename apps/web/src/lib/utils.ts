import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCO2(kg: number): string {
  if (kg < 0.01) return '<0.01 kg';
  if (kg < 1) return `${(kg * 1000).toFixed(0)} g`;
  if (kg < 1000) return `${kg.toFixed(2)} kg`;
  return `${(kg / 1000).toFixed(2)} t`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'transport.fuel': '#ef4444',
    'transport.publictransit': '#3b82f6',
    'transport.airline': '#8b5cf6',
    'utilities.electricity': '#eab308',
    'utilities.telecom': '#06b6d4',
    grocery: '#10b981',
    restaurants: '#f59e0b',
    apparel: '#ec4899',
    electronics: '#6366f1',
    home: '#14b8a6',
    entertainment: '#a855f7',
    healthcare: '#f43f5e',
    other: '#64748b',
  };
  return colors[category] || colors.other;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'transport.fuel': 'Fuel & Gas',
    'transport.publictransit': 'Public Transit',
    'transport.airline': 'Air Travel',
    'utilities.electricity': 'Electricity',
    'utilities.telecom': 'Telecom',
    grocery: 'Groceries',
    restaurants: 'Restaurants',
    apparel: 'Apparel',
    electronics: 'Electronics',
    home: 'Home & Garden',
    entertainment: 'Entertainment',
    healthcare: 'Healthcare',
    other: 'Other',
  };
  return labels[category] || category;
}

