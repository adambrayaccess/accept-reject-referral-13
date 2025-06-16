
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Grid, 
  Feed, 
  HelpCircle, 
  MessageCircle, 
  CircleDot, 
  Layers,
  ChevronRight 
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface AppSidebarProps {
  onClose?: () => void;
}

const AppSidebar = ({ onClose }: AppSidebarProps) => {
  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Sidebar className="w-64 border-r border-gray-200 bg-white">
      <SidebarContent className="p-0">
        {/* Products Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100">
            Products
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between px-4 py-3 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Grid className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium">Triage</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 transition-transform data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NavLink 
                            to="/" 
                            onClick={handleNavClick}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          >
                            <CircleDot className="h-4 w-4 mr-3 text-gray-400" />
                            Dashboard
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NavLink 
                            to="/cohort-builder" 
                            onClick={handleNavClick}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          >
                            <Layers className="h-4 w-4 mr-3 text-gray-400" />
                            Cohort Builder
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Spaces Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100">
            Spaces
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/admin" 
                    onClick={handleNavClick}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Grid className="h-5 w-5 mr-3 text-gray-600" />
                    Admin Space
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Copilot Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100">
            Copilot
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <CircleDot className="h-5 w-5 mr-3 text-gray-600" />
                  AI Assistant
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Feed Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100">
            Feed
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <Feed className="h-5 w-5 mr-3 text-gray-600" />
                  Activity Feed
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <MessageCircle className="h-5 w-5 mr-3 text-gray-600" />
                  Support Chat
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <HelpCircle className="h-5 w-5 mr-3 text-gray-600" />
                  Help
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
