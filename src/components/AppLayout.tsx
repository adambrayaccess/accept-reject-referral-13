
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from '@/components/ui/drawer';
import Titlebar from './Titlebar';
import AppSidebar from './AppSidebar';
import { useSidebarState } from '@/hooks/useSidebarState';
import { useClickOutside } from '@/hooks/useClickOutside';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { isOpen, openSidebar, closeSidebar } = useSidebarState();
  const sidebarRef = useClickOutside<HTMLDivElement>(closeSidebar, isOpen);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Titlebar onLogoClick={openSidebar} />
        
        <Drawer open={isOpen} onOpenChange={closeSidebar}>
          <DrawerOverlay className="fixed inset-0 bg-black/20 z-40" />
          <DrawerContent className="fixed top-0 left-0 h-full w-64 p-0 rounded-none border-r border-gray-200 z-50">
            <div ref={sidebarRef} className="h-full">
              <AppSidebar onClose={closeSidebar} />
            </div>
          </DrawerContent>
        </Drawer>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
