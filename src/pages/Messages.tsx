
import Titlebar from '@/components/Titlebar';
import PageHeader from '@/components/PageHeader';

const Messages = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Titlebar />
      <PageHeader showSearch={false} />
      
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Messaging functionality will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
