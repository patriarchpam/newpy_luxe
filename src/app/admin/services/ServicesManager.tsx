"use client";

import { useState } from "react";
import ServiceModal from "./ServiceModal";

export default function ServicesManager({ initialServices }: { initialServices: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const openEditModal = (service: any) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    // Reload page to fetch updated services
    window.location.reload(); 
  };

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-ink">Services</h1>
          <p className="text-ash mt-2">Manage service prices, duration, and deposits.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="h-10 bg-ink text-white px-6 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-black transition-colors"
        >
          + Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialServices?.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-serif text-xl">{service.name}</h2>
              <span className={`w-3 h-3 rounded-full ${service.is_active ? 'bg-green-500' : 'bg-red-500'}`} title={service.is_active ? 'Active' : 'Inactive'} />
            </div>
            
            <p className="text-sm text-ash mb-6 flex-1">{service.description}</p>
            
            <div className="space-y-2 text-sm bg-cloud p-4 rounded-xl mb-6">
              <div className="flex justify-between">
                <span className="text-ash">Price</span>
                <span className="font-semibold">₦{service.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ash">Deposit</span>
                <span className="font-medium text-plum-600">₦{service.deposit_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ash">Duration</span>
                <span className="font-medium">{service.duration} mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ash">Buffer</span>
                <span className="font-medium">{service.buffer_time} mins</span>
              </div>
            </div>

            <button 
              onClick={() => openEditModal(service)}
              className="w-full h-10 border border-black/10 rounded-xl text-xs uppercase tracking-widest font-medium text-ink hover:border-plum-500 hover:text-plum-600 transition-colors"
            >
              Edit Service
            </button>
          </div>
        ))}
      </div>

      <ServiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleModalSuccess}
        service={editingService}
      />
    </>
  );
}
