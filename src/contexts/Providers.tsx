import React from 'react';
import { AuthProvider } from './AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
// Import other providers here as your app grows

export function Providers({ children }: { children: React.ReactNode }) {
  // Nest additional providers as needed
  return (
    <AuthProvider>
      <SidebarProvider>
        {/* Add more providers here */}
        {children}
      </SidebarProvider>
    </AuthProvider>
  );
}
