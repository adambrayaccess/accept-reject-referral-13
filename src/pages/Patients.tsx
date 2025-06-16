
import Titlebar from '@/components/Titlebar';
import PageHeader from '@/components/PageHeader';

const Patients = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Titlebar />
      <PageHeader showSearch={false} />
      
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Patients</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Patient management functionality will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
