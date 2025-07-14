import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useWritePrescriptionMutation } from '../../redux/features/prescription/prescriptionApi';

export default function PrescriptionForm() {
  const params = useParams();
  const navigate = useNavigate();
  const appointmentId = params.id === 'general' ? undefined : params.id;
  const [writePrescription, { isLoading, isSuccess, error }] = useWritePrescriptionMutation();
  const { user } = useSelector(state => state.auth);

  const [prescriptionItems, setPrescriptionItems] = useState([
    { id: 1, name: "Paracetamol 200 mg", morning: "before", noon: "before", night: "before", note: "Take with food" },
    { id: 2, name: "Ibuprofen 400 mg", morning: "after", noon: "after", night: "after", note: "As needed for pain" }
  ]);

  const [patientInfo, setPatientInfo] = useState({
    name: "John Doe",
    date: new Date().toISOString().split('T')[0],
    age: "35",
    gender: "Male",
    weight: "75 kg",
    address: "123 Main St, City"
  });

  const addPrescriptionItem = () => {
    const newId = prescriptionItems.length + 1;
    setPrescriptionItems([...prescriptionItems, { 
      id: newId, 
      name: "", 
      morning: "before", 
      noon: "before", 
      night: "before", 
      note: "" 
    }]);
  };

  const updateMedication = (id, field, value) => {
    setPrescriptionItems(prescriptionItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo({ ...patientInfo, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!appointmentId) {
      alert('Appointment ID is required');
      return;
    }

    const formattedItems = prescriptionItems.map(item => ({
      name: item.name,
      morningBefore: item.morning === "before",
      morningAfter: item.morning === "after",
      noonBefore: item.noon === "before",
      noonAfter: item.noon === "after",
      nightBefore: item.night === "before",
      nightAfter: item.night === "after",
      note: item.note || undefined
    }));

    try {
      const result = await writePrescription({
        appointmentId,
        items: formattedItems
      }).unwrap();
      
      if (result.success) {
        alert('Prescription saved successfully!');
        navigate('/appointments');
      }
    } catch (err) {
      console.error('Failed to save prescription:', err);
      alert('Failed to save prescription. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen p-4">
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 text-white p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">e-Clinic</h1>
              <p className="text-sm opacity-90">Specialist online healthcare</p>
              <p className="text-sm font-medium">Dr. {user?.fullName}</p>
            </div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="text-blue-500 font-bold text-sm">e-Clinic</div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700">
                  Patient name:
                </label>
                <input
                  type="text"
                  id="patient-name"
                  value={patientInfo.name}
                  onChange={(e) => handlePatientInfoChange('name', e.target.value)}
                  className="mt-1 block w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 py-1 px-0"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  value={patientInfo.address}
                  onChange={(e) => handlePatientInfoChange('address', e.target.value)}
                  className="mt-1 block w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 py-1 px-0"
                  required
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  value={patientInfo.date}
                  onChange={(e) => handlePatientInfoChange('date', e.target.value)}
                  className="mt-1 block w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 py-1 px-0"
                  required
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age:
                </label>
                <input
                  type="text"
                  id="age"
                  value={patientInfo.age}
                  onChange={(e) => handlePatientInfoChange('age', e.target.value)}
                  className="mt-1 block w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 py-1 px-0"
                  required
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender:
                </label>
                <input
                  type="text"
                  id="gender"
                  value={patientInfo.gender}
                  onChange={(e) => handlePatientInfoChange('gender', e.target.value)}
                  className="mt-1 block w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 py-1 px-0"
                  required
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight:
                </label>
                <input
                  type="text"
                  id="weight"
                  value={patientInfo.weight}
                  onChange={(e) => handlePatientInfoChange('weight', e.target.value)}
                  className="mt-1 block w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 py-1 px-0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Prescription Section */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold text-blue-500">Rx</div>
              <button
                type="button"
                onClick={addPrescriptionItem}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1 text-sm transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Medication
              </button>
            </div>

            {/* Medication Table */}
            <div className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-100 grid grid-cols-12 gap-2 p-3 font-medium text-sm border-b">
                <div className="col-span-3">Medication</div>
                <div className="col-span-2 text-center">Morning</div>
                <div className="col-span-2 text-center">Noon</div>
                <div className="col-span-2 text-center">Night</div>
                <div className="col-span-3 text-center">Note</div>
              </div>

              {/* Medication Rows */}
              {prescriptionItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border-b bg-white items-center">
                  {/* Medication Name */}
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateMedication(item.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none py-1 px-0 text-sm"
                      required
                    />
                  </div>

                  {/* Morning */}
                  <div className="col-span-2">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`m${item.id}-before`}
                          name={`morning-${item.id}`}
                          value="before"
                          checked={item.morning === "before"}
                          onChange={() => updateMedication(item.id, 'morning', 'before')}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                          required
                        />
                        <label htmlFor={`m${item.id}-before`} className="text-xs">
                          Before
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`m${item.id}-after`}
                          name={`morning-${item.id}`}
                          value="after"
                          checked={item.morning === "after"}
                          onChange={() => updateMedication(item.id, 'morning', 'after')}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor={`m${item.id}-after`} className="text-xs">
                          After
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Noon */}
                  <div className="col-span-2">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`n${item.id}-before`}
                          name={`noon-${item.id}`}
                          value="before"
                          checked={item.noon === "before"}
                          onChange={() => updateMedication(item.id, 'noon', 'before')}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                          required
                        />
                        <label htmlFor={`n${item.id}-before`} className="text-xs">
                          Before
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`n${item.id}-after`}
                          name={`noon-${item.id}`}
                          value="after"
                          checked={item.noon === "after"}
                          onChange={() => updateMedication(item.id, 'noon', 'after')}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor={`n${item.id}-after`} className="text-xs">
                          After
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Night */}
                  <div className="col-span-2">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`e${item.id}-before`}
                          name={`night-${item.id}`}
                          value="before"
                          checked={item.night === "before"}
                          onChange={() => updateMedication(item.id, 'night', 'before')}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                          required
                        />
                        <label htmlFor={`e${item.id}-before`} className="text-xs">
                          Before
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`e${item.id}-after`}
                          name={`night-${item.id}`}
                          value="after"
                          checked={item.night === "after"}
                          onChange={() => updateMedication(item.id, 'night', 'after')}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor={`e${item.id}-after`} className="text-xs">
                          After
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="col-span-3">
                    <textarea
                      value={item.note}
                      onChange={(e) => updateMedication(item.id, 'note', e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs h-16 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Add medication notes..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
            <div className="flex justify-center items-center gap-6 text-sm text-blue-500">
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>+92404234647</span>
              </div>
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Livedoctor.com</span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-2 text-sm transition-colors flex items-center"
            >
              {isLoading ? 'Saving...' : 'Save Prescription'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}