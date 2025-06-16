
import { useState } from 'react';
import { 
  FileText, 
  Clock, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  BarChart3, 
  Settings,
  ChevronDown
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const menuItems = [
  { title: 'Referral Dashboard', url: '/', icon: FileText },
  { title: 'Waiting Lists', url: '/cohort-builder', icon: Clock },
  { title: 'Assessments', url: '/assessments', icon: Calendar, hasSubmenu: true },
  { title: 'Book Appointment', url: '/book-appointment', icon: BookOpen },
  { title: 'Messages', url: '/messages', icon: MessageSquare },
  { title: 'Analytics', url: '/admin', icon: BarChart3 },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state: sidebarState } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [assessmentsOpen, setAssessmentsOpen] = useState(false);

  const isActive = (path: string) => currentPath === path;
  const isExpanded = sidebarState === 'expanded';

  return (
    <Sidebar 
      className="border-r border-gray-200 bg-white shadow-lg"
      collapsible="icon"
      variant="floating"
    >
      <SidebarContent className="p-2">
        <SidebarGroup>
          <div className="flex items-center gap-3 px-3 py-4 border-b border-gray-200 mb-4">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            {isExpanded && (
              <SidebarGroupLabel className="text-lg font-medium text-gray-900">
                Menu
              </SidebarGroupLabel>
            )}
          </div>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.hasSubmenu ? (
                    <Collapsible 
                      open={assessmentsOpen} 
                      onOpenChange={setAssessmentsOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`w-full justify-between rounded-lg p-3 transition-colors ${
                            isActive(item.url) 
                              ? 'bg-teal-600 text-white hover:bg-teal-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {isExpanded && <span className="font-medium">{item.title}</span>}
                          </div>
                          {isExpanded && (
                            <ChevronDown 
                              className={`h-4 w-4 transition-transform ${
                                assessmentsOpen ? 'rotate-180' : ''
                              }`} 
                            />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {isExpanded && (
                        <CollapsibleContent className="mt-1 ml-8 space-y-1">
                          {/* Add submenu items here if needed */}
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive: navIsActive }) => 
                          `flex items-center gap-3 rounded-lg p-3 transition-colors ${
                            navIsActive || isActive(item.url)
                              ? 'bg-teal-600 text-white hover:bg-teal-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {isExpanded && <span className="font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
