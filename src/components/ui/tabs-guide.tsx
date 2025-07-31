
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TabsGuide = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tabs System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Variants</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Default - For primary navigation</h4>
                <Tabs defaultValue="tab1">
                  <TabsList variant="default" size="md">
                    <TabsTrigger value="tab1" variant="default" size="md">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2" variant="default" size="md">Tab 2</TabsTrigger>
                    <TabsTrigger value="tab3" variant="default" size="md">Tab 3</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <h4 className="font-medium mb-2">Compact - For secondary navigation</h4>
                <Tabs defaultValue="tab1">
                  <TabsList variant="compact" size="sm">
                    <TabsTrigger value="tab1" variant="compact" size="sm">Compact 1</TabsTrigger>
                    <TabsTrigger value="tab2" variant="compact" size="sm">Compact 2</TabsTrigger>
                    <TabsTrigger value="tab3" variant="compact" size="sm">Compact 3</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <h4 className="font-medium mb-2">Pills - For filters and selections</h4>
                <Tabs defaultValue="tab1">
                  <TabsList variant="pills" size="sm">
                    <TabsTrigger value="tab1" variant="pills" size="sm">Filter 1</TabsTrigger>
                    <TabsTrigger value="tab2" variant="pills" size="sm">Filter 2</TabsTrigger>
                    <TabsTrigger value="tab3" variant="pills" size="sm">Filter 3</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <h4 className="font-medium mb-2">Grid - For main page sections</h4>
                <Tabs defaultValue="tab1">
                  <TabsList variant="grid" size="md">
                    <TabsTrigger value="tab1" variant="grid" size="md">Section 1</TabsTrigger>
                    <TabsTrigger value="tab2" variant="grid" size="md">Section 2</TabsTrigger>
                    <TabsTrigger value="tab3" variant="grid" size="md">Section 3</TabsTrigger>
                    <TabsTrigger value="tab4" variant="grid" size="md">Section 4</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Size Standards</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong>sm:</strong> Small text (12px), minimal padding - For compact spaces</li>
              <li><strong>md:</strong> Medium text (14px), standard padding - Default for most cases</li>
              <li><strong>lg:</strong> Large text (16px), generous padding - For emphasis</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Usage Guidelines</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Use <strong>grid</strong> variant for main page navigation (2-4 sections)</li>
              <li>Use <strong>default</strong> variant for content area navigation</li>
              <li>Use <strong>compact</strong> variant for nested or secondary tabs</li>
              <li>Use <strong>pills</strong> variant for filters and interactive selections</li>
              <li>Always specify both variant and size props for consistency</li>
              <li>Use responsive design considerations for overflow handling</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TabsGuide;
