import React, { useState, useEffect } from 'react';
import { Package, Truck, MapPin, Clock, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import Endpoint from '../../utils/endpoint';

const ShippingModule = () => {
  const [activeTab, setActiveTab] = useState('zones');
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({});
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

   const [shippingZones, setShippingZones] = useState([]);
  const [pickupSettings, setPickupSettings] = useState({});

  const fetchPickupAddress = async () => {
  try {
    const response = await Endpoint.getPickupAddress();
    if (response.data && response.data.success) {
      const apiData = response.data.data;
      
      const transformedData = {
        enabled: apiData.isEnabled,
        address: apiData.storeAddress,
        workingHours: apiData.workingHours,
        instructions: apiData.pickupInstructions,
        preparationTime: apiData.preparationTime
      };
      
      setPickupSettings(transformedData);
    }
  } catch (err) {
    console.error('API Error:', err);
   
  }
};



   useEffect(() => {
    const fetchShippingData = async () => {
      try {
        setIsLoading(true);
        const response = await Endpoint.getShippingZones()
        console.log(response, "resss")
        
        if (response.data.success) {
          setShippingZones(response.data.data);
        }
      } catch (err) {
        setError('Failed to load shipping data');
        console.error('API Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShippingData();
    fetchPickupAddress()
  }, []);

  // Format derived data for UI
  const abujaZones = shippingZones.filter(zone => zone.type === 'abuja').map(zone => ({
    id: zone._id,
    name: zone.name,
    areas: zone.states || [], // Use states field for areas
    price: zone.price,
    timeframe: zone.estimatedDeliveryTime,
    preparationTime: zone.preparationTime,
    type: 'abuja'
  }));

  // const interStateRates = shippingZones.filter(zone => zone.type === 'interstate').map(zone => ({
  //   id: zone._id,
  //   state: zone.states?.[0] || '', 
  //   price: zone.price,
  //   timeframe: zone.estimatedDeliveryTime,
  //   courier: zone.courierPartner,
  //   type: 'interstate'
  // }));

  const interStateRates = [
  ...shippingZones
    .filter(zone => zone.type === 'interstate')
    .map(zone => ({
      id: zone._id,
      state: zone.name,
      price: zone.price,
      timeframe: zone.estimatedDeliveryTime,
      courier: zone.courierPartner,
      type: 'interstate'
    })),
  
  // Add the new unsaved item if it exists
  ...(editingItem?.type === 'interstate' && !editingItem.id ? [editingItem] : [])
];

  
 const handleSavePickup = async () => {
  try {
    // Transform state data to match API payload structure
    const payload = {
      isEnabled: pickupSettings.enabled,
      storeAddress: pickupSettings.address,
      workingHours: pickupSettings.workingHours,
      preparationTime: pickupSettings.preparationTime,
      pickupInstructions: pickupSettings.instructions
    };
    
    const response = await Endpoint.updatePickupAddress(payload);
    
    if (response.data && response.data.success) {
      setShowAddressForm(false);
    fetchPickupAddress()

      // Show success message - you can implement toast notification here
      console.log('Pickup address updated successfully');
    } else {
      // Handle API error response
      console.error('Failed to update pickup address');
    }
  } catch (err) {
    console.error('API Error:', err);
    // Handle error - you can show error toast here
  }
};

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

  // Unified save function for both zone types
  const handleSave = async () => {
  if (!editingItem) return;
  
  try {
    setIsLoading(true);
    const isAbuja = editingItem.type === 'abuja';
    const isNew = editingItem.id === null;

    // Prepare data for API
    const data = {
      name: isAbuja ? newItem.name : newItem.state, // Use state name for interstate zones
      states: isAbuja ? ['Abuja'] : [newItem.state],
      price: newItem.price,
      estimatedDeliveryTime: newItem.timeframe,
      type: editingItem.type,
      courierPartner: isAbuja ? '' : newItem.courier,
      preparationTime: isAbuja ? newItem.preparationTime : undefined
    };

    let response;
    if (isNew) {
      // Create new zone
      response = await Endpoint.createShippingZone(data);
    } else {
      // Update existing zone
      response = await Endpoint.updateShippingZone(editingItem.id, data);
    }

    if (response.data.success) {
      // Refetch data after update
      const refreshResponse = await Endpoint.getShippingZones();
      setShippingZones(refreshResponse.data.data);
      setEditingItem(null);
      setNewItem({});
    }
  } catch (err) {
    setError(`Failed to ${editingItem.id ? 'update' : 'create'} zone`);
    console.error('Save Error:', err.response?.data || err.message);
  } finally {
    setIsLoading(false);
  }
};

  const handleDelete = async (id, type) => {
    try {
      setIsLoading(true);
     await Endpoint.deleteShippingZone(id)
      
      // Refetch data after delete
      const response = await Endpoint.getShippingZones()
      setShippingZones(response.data.data);
    } catch (err) {
      setError('Failed to delete zone');
      console.error('Delete Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = (type) => {
  if (type === 'abuja') {
    const newZone = {
      id: null, // Use null instead of undefined
      name: '',
      areas: [],
      price: 0,
      timeframe: '',
      preparationTime: '',
      type: 'abuja'
    };
    setEditingItem({ ...newZone, type: 'abuja' });
    setNewItem({ ...newZone });
  } else if (type === 'interstate') {
    const newRate = {
      id: null, // Use null instead of undefined
      state: '',
      price: 0,
      timeframe: '',
      courier: 'GIG Logistics',
      type: 'interstate'
    };
    setEditingItem({ ...newRate, type: 'interstate' });
    setNewItem({ ...newRate });
  }
};

  const handleCancel = () => {
    setEditingItem(null);
    setNewItem({});
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

   // Render loading state
  if (isLoading && shippingZones.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading shipping data...</p>
        </div>
      </div>
    );
  }

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
                    {/* <input
                      type="text"
                      value={newItem.areas?.join(', ') || ''}
                      onChange={(e) => setNewItem({...newItem, areas: e.target.value.split(', ').filter(area => area.trim())})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Areas (comma separated, e.g., Garki, Wuse, Maitama)"
                    /> */}
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
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preparation Time
                        </label>
                        <input
                          type="text"
                          value={newItem.preparationTime || ''}
                          onChange={(e) => setNewItem({...newItem, preparationTime: e.target.value})}
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
                        {/* <p className="text-gray-600 mb-2">
                          Areas: {zone.areas.join(', ')}
                        </p> */}
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
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Current Pickup Address</h4>
                        <p className="text-gray-700 mt-1">{pickupSettings.address}</p>
                      </div>
                      <button 
                        onClick={() => setShowAddressForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 mt-3"
                      >
                        <Edit2 className="w-4 h-4" />
                        Change Address
                      </button>
                       
                    </div>
                    {showAddressForm && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="font-medium mb-4">Update Pickup Address</h4>
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
                  
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => setShowAddressForm(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button 
                      onClick={handleSavePickup}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4" /> Save Address
                    </button>
                  </div>
                </div>
                        )}
                  </div>

                 
                  
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