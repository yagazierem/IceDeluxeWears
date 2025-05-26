import React, { useState } from 'react';
import { Package, Truck, MapPin, Clock, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const ShippingModule = () => {
  const [activeTab, setActiveTab] = useState('zones');
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({});

  // Sample data - in real app this would come from your backend
  const [abujaZones, setAbujaZones] = useState([
    { id: 1, name: 'Central Area', areas: ['Garki', 'Wuse', 'Maitama', 'Asokoro'], price: 1500, timeframe: '2-4 hours' },
    { id: 2, name: 'Satellite Towns', areas: ['Kubwa', 'Lugbe', 'Kuje', 'Gwagwalada'], price: 2500, timeframe: '4-8 hours' },
    { id: 3, name: 'Outskirts', areas: ['Suleja', 'Madalla', 'Zuba'], price: 3500, timeframe: '6-12 hours' }
  ]);

  const [interStateRates, setInterStateRates] = useState([
    { id: 1, state: 'Lagos', price: 5000, timeframe: '2-3 days', courier: 'GIG Logistics' },
    { id: 2, state: 'Kano', price: 4500, timeframe: '2-3 days', courier: 'GIG Logistics' },
    { id: 3, state: 'Port Harcourt', price: 5500, timeframe: '3-4 days', courier: 'DHL Nigeria' },
    { id: 4, state: 'Ibadan', price: 4800, timeframe: '2-3 days', courier: 'Jumia Logistics' },
    { id: 5, state: 'Kaduna', price: 3500, timeframe: '1-2 days', courier: 'Local Courier' }
  ]);

  const [pickupSettings, setPickupSettings] = useState({
    enabled: true,
    address: 'Shop 15, Banex Plaza, Wuse 2, Abuja',
    workingHours: 'Mon-Sat: 9:00 AM - 6:00 PM',
    instructions: 'Present order confirmation and valid ID for pickup',
    preparationTime: '2-4 hours'
  });

  const [generalSettings, setGeneralSettings] = useState({
    freeDeliveryThreshold: 25000,
    codEnabled: true,
    defaultCourier: 'GIG Logistics',
    maxDeliveryDays: 7
  });

  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type });
    setNewItem({ ...item });
  };

  const handleSave = () => {
    if (editingItem.type === 'abuja') {
      setAbujaZones(prev => prev.map(zone => 
        zone.id === editingItem.id ? { ...newItem } : zone
      ));
    } else if (editingItem.type === 'interstate') {
      setInterStateRates(prev => prev.map(rate => 
        rate.id === editingItem.id ? { ...newItem } : rate
      ));
    }
    setEditingItem(null);
    setNewItem({});
  };

  const handleCancel = () => {
    setEditingItem(null);
    setNewItem({});
  };

  const handleDelete = (id, type) => {
    if (type === 'abuja') {
      setAbujaZones(prev => prev.filter(zone => zone.id !== id));
    } else if (type === 'interstate') {
      setInterStateRates(prev => prev.filter(rate => rate.id !== id));
    }
  };

  const handleAddNew = (type) => {
    const newId = Date.now(); // Simple ID generation
    if (type === 'abuja') {
      const newZone = {
        id: newId,
        name: '',
        areas: [],
        price: 0,
        timeframe: ''
      };
      setAbujaZones(prev => [...prev, newZone]);
      setEditingItem({ ...newZone, type: 'abuja' });
      setNewItem({ ...newZone });
    } else if (type === 'interstate') {
      const newRate = {
        id: newId,
        state: '',
        price: 0,
        timeframe: '',
        courier: 'GIG Logistics'
      };
      setInterStateRates(prev => [...prev, newRate]);
      setEditingItem({ ...newRate, type: 'interstate' });
      setNewItem({ ...newRate });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Shipping Management
          </h1>
          <p className="text-gray-600 mt-1">Manage delivery zones, rates, and pickup options</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'zones', label: 'Abuja Zones', icon: MapPin },
              { id: 'interstate', label: 'Inter-State', icon: Truck },
              { id: 'pickup', label: 'Store Pickup', icon: Package },
              { id: 'settings', label: 'Settings', icon: Clock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Abuja Zones Tab */}
          {activeTab === 'zones' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Abuja Delivery Zones</h2>
                <button 
                  onClick={() => handleAddNew('abuja')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Zone
                </button>
              </div>

              {/* Edit Form - Show at top when editing */}
              {editingItem?.type === 'abuja' && (
                <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-800 mb-4">
                    {abujaZones.find(z => z.id === editingItem.id)?.name ? 'Edit Zone' : 'Add New Zone'}
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newItem.name || ''}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Zone name (e.g., Central Area)"
                    />
                    <input
                      type="text"
                      value={newItem.areas?.join(', ') || ''}
                      onChange={(e) => setNewItem({...newItem, areas: e.target.value.split(', ').filter(area => area.trim())})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Areas (comma separated, e.g., Garki, Wuse, Maitama)"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                        <input
                          type="number"
                          value={newItem.price || ''}
                          onChange={(e) => setNewItem({...newItem, price: parseInt(e.target.value) || 0})}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="e.g., 1500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                        <input
                          type="text"
                          value={newItem.timeframe || ''}
                          onChange={(e) => setNewItem({...newItem, timeframe: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="e.g., 2-4 hours"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
                        <Save className="w-4 h-4" /> Save Zone
                      </button>
                      <button onClick={handleCancel} className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700">
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {abujaZones.filter(zone => !editingItem || editingItem.id !== zone.id || editingItem.type !== 'abuja').map(zone => (
                  <div key={zone.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{zone.name}</h3>
                        <p className="text-gray-600 mb-2">
                          Areas: {zone.areas.join(', ')}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600 font-semibold">
                            {formatCurrency(zone.price)}
                          </span>
                          <span className="text-blue-600">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {zone.timeframe}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(zone, 'abuja')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit zone"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(zone.id, 'abuja')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete zone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inter-State Tab */}
          {activeTab === 'interstate' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Inter-State Delivery Rates</h2>
                <button 
                  onClick={() => handleAddNew('interstate')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add State
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 p-3 text-left">State</th>
                      <th className="border border-gray-200 p-3 text-left">Price</th>
                      <th className="border border-gray-200 p-3 text-left">Timeframe</th>
                      <th className="border border-gray-200 p-3 text-left">Courier Partner</th>
                      <th className="border border-gray-200 p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interStateRates.map(rate => (
                      <tr key={rate.id} className="hover:bg-gray-50">
                        {editingItem?.id === rate.id && editingItem?.type === 'interstate' ? (
                          <>
                            <td className="border border-gray-200 p-3">
                              <input
                                type="text"
                                value={newItem.state || ''}
                                onChange={(e) => setNewItem({...newItem, state: e.target.value})}
                                className="w-full p-1 border border-gray-300 rounded"
                              />
                            </td>
                            <td className="border border-gray-200 p-3">
                              <input
                                type="number"
                                value={newItem.price || ''}
                                onChange={(e) => setNewItem({...newItem, price: parseInt(e.target.value)})}
                                className="w-full p-1 border border-gray-300 rounded"
                              />
                            </td>
                            <td className="border border-gray-200 p-3">
                              <input
                                type="text"
                                value={newItem.timeframe || ''}
                                onChange={(e) => setNewItem({...newItem, timeframe: e.target.value})}
                                className="w-full p-1 border border-gray-300 rounded"
                              />
                            </td>
                            <td className="border border-gray-200 p-3">
                              <select
                                value={newItem.courier || ''}
                                onChange={(e) => setNewItem({...newItem, courier: e.target.value})}
                                className="w-full p-1 border border-gray-300 rounded"
                              >
                                <option>GIG Logistics</option>
                                <option>DHL Nigeria</option>
                                <option>Jumia Logistics</option>
                                <option>Local Courier</option>
                              </select>
                            </td>
                            <td className="border border-gray-200 p-3">
                              <div className="flex gap-1">
                                <button onClick={handleSave} className="bg-green-600 text-white p-1 rounded">
                                  <Save className="w-4 h-4" />
                                </button>
                                <button onClick={handleCancel} className="bg-gray-600 text-white p-1 rounded">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="border border-gray-200 p-3 font-semibold">{rate.state}</td>
                            <td className="border border-gray-200 p-3 text-green-600 font-semibold">
                              {formatCurrency(rate.price)}
                            </td>
                            <td className="border border-gray-200 p-3">{rate.timeframe}</td>
                            <td className="border border-gray-200 p-3">{rate.courier}</td>
                            <td className="border border-gray-200 p-3">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleEdit(rate, 'interstate')}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(rate.id, 'interstate')}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Store Pickup Tab */}
          {activeTab === 'pickup' && (
            <div>
              <h2 className="text-lg font-semibold mb-6">Store Pickup Configuration</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Pickup Service Status</h3>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pickupSettings.enabled}
                        onChange={(e) => setPickupSettings({...pickupSettings, enabled: e.target.checked})}
                        className="mr-2"
                      />
                      <span className={pickupSettings.enabled ? 'text-green-600' : 'text-red-600'}>
                        {pickupSettings.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Address
                      </label>
                      <textarea
                        value={pickupSettings.address}
                        onChange={(e) => setPickupSettings({...pickupSettings, address: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Working Hours
                      </label>
                      <input
                        type="text"
                        value={pickupSettings.workingHours}
                        onChange={(e) => setPickupSettings({...pickupSettings, workingHours: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preparation Time
                      </label>
                      <input
                        type="text"
                        value={pickupSettings.preparationTime}
                        onChange={(e) => setPickupSettings({...pickupSettings, preparationTime: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Instructions
                      </label>
                      <textarea
                        value={pickupSettings.instructions}
                        onChange={(e) => setPickupSettings({...pickupSettings, instructions: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows="3"
                      />
                    </div>
                  </div>

                  <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Save Pickup Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* General Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-lg font-semibold mb-6">General Shipping Settings</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Free Delivery Threshold (₦)
                      </label>
                      <input
                        type="number"
                        value={generalSettings.freeDeliveryThreshold}
                        onChange={(e) => setGeneralSettings({...generalSettings, freeDeliveryThreshold: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Orders above this amount get free delivery within Abuja
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Courier Partner
                      </label>
                      <select
                        value={generalSettings.defaultCourier}
                        onChange={(e) => setGeneralSettings({...generalSettings, defaultCourier: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      >
                        <option>GIG Logistics</option>
                        <option>DHL Nigeria</option>
                        <option>Jumia Logistics</option>
                        <option>Local Courier</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Delivery Days
                      </label>
                      <input
                        type="number"
                        value={generalSettings.maxDeliveryDays}
                        onChange={(e) => setGeneralSettings({...generalSettings, maxDeliveryDays: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={generalSettings.codEnabled}
                          onChange={(e) => setGeneralSettings({...generalSettings, codEnabled: e.target.checked})}
                          className="mr-2"
                        />
                        <span>Enable Cash on Delivery (COD)</span>
                      </label>
                    </div>
                  </div>

                  <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Save General Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingModule;