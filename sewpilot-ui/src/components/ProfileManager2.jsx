import React, { useState, useEffect } from 'react';

const initialState = {
  name: '',
  height: '',
  weight: '',
  posture: 'neutral',
  stance: 'regular',
  chest: '',
  waist: '',
  hip: '',
  armLength: '',
  bicepCircumference: '',
  legLength: '',
  thighCircumference: '',
  inseam: ''
};

const presets = {
  S: { chest: 34, waist: 28, hip: 34, armLength: 24, bicepCircumference: 12, legLength: 30, thighCircumference: 18, inseam: 29 },
  M: { chest: 38, waist: 32, hip: 38, armLength: 25, bicepCircumference: 13, legLength: 32, thighCircumference: 20, inseam: 31 },
  L: { chest: 42, waist: 36, hip: 42, armLength: 26, bicepCircumference: 14, legLength: 34, thighCircumference: 22, inseam: 33 }
};

const ProfileManager2 = () => {
  const [form, setForm] = useState(initialState);
  const [expanded, setExpanded] = useState({ metadata: true, torso: true, arms: true, legs: true });
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('profiles2');
    if (saved) setProfiles(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const applyPreset = (size) => {
    setForm((prev) => ({ ...prev, ...presets[size] }));
  };

  const validate = () => {
    const numericFields = ['height','weight','chest','waist','hip','armLength','bicepCircumference','legLength','thighCircumference','inseam'];
    const newErrors = {};
    numericFields.forEach(field => {
      const value = parseFloat(form[field]);
      if (isNaN(value) || value <= 0) newErrors[field] = 'Must be a positive number';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = () => {
    if (!validate()) return;
    const updated = [...profiles];
    if (activeProfile !== null) {
      updated[activeProfile] = form;
    } else {
      updated.push(form);
    }
    setProfiles(updated);
    localStorage.setItem('profiles2', JSON.stringify(updated));
    setActiveProfile(updated.length - 1);
  };

  const selectProfile = (index) => {
    setForm(profiles[index]);
    setActiveProfile(index);
  };

  const deleteProfile = (index) => {
    const updated = profiles.filter((_, i) => i !== index);
    setProfiles(updated);
    localStorage.setItem('profiles2', JSON.stringify(updated));
    if (activeProfile === index) {
      setActiveProfile(null);
      setForm(initialState);
    }
  };

  const toggleSection = (section) => setExpanded(prev => ({ ...prev, [section]: !prev[section] }));

  const renderInput = (name, label) => (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-sm font-medium">{label}</label>
      <input id={name} name={name} type="number" value={form[name]} onChange={handleChange} className="border rounded p-1" />
      {errors[name] && <span className="text-red-500 text-xs">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="space-y-4 p-4">
      <div className="flex space-x-2">
        {['S','M','L'].map(size => (
          <button key={size} className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => applyPreset(size)}>{size}</button>
        ))}
      </div>

      <div className="border rounded">
        <button onClick={() => toggleSection('metadata')} className="w-full text-left p-2 bg-gray-200 font-semibold">Metadata</button>
        {expanded.metadata && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input id="name" name="name" type="text" value={form.name} onChange={handleChange} className="border rounded p-1" />
            </div>
            {renderInput('height', 'Height (in)')}
            {renderInput('weight', 'Weight (lb)')}
            <div className="flex flex-col space-y-1">
              <label htmlFor="posture" className="text-sm font-medium">Posture</label>
              <select id="posture" name="posture" value={form.posture} onChange={handleChange} className="border rounded p-1">
                <option value="neutral">Neutral</option>
                <option value="forward">Forward</option>
                <option value="back">Back</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="stance" className="text-sm font-medium">Stance</label>
              <select id="stance" name="stance" value={form.stance} onChange={handleChange} className="border rounded p-1">
                <option value="regular">Regular</option>
                <option value="wide">Wide</option>
                <option value="narrow">Narrow</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="border rounded">
        <button onClick={() => toggleSection('torso')} className="w-full text-left p-2 bg-gray-200 font-semibold">Torso</button>
        {expanded.torso && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput('chest', 'Chest Circumference (in)')}
            {renderInput('waist', 'Waist Circumference (in)')}
            {renderInput('hip', 'Hip Circumference (in)')}
          </div>
        )}
      </div>

      <div className="border rounded">
        <button onClick={() => toggleSection('arms')} className="w-full text-left p-2 bg-gray-200 font-semibold">Arms</button>
        {expanded.arms && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput('armLength', 'Arm Length (in)')}
            {renderInput('bicepCircumference', 'Bicep Circumference (in)')}
          </div>
        )}
      </div>

      <div className="border rounded">
        <button onClick={() => toggleSection('legs')} className="w-full text-left p-2 bg-gray-200 font-semibold">Legs</button>
        {expanded.legs && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput('legLength', 'Leg Length (in)')}
            {renderInput('thighCircumference', 'Thigh Circumference (in)')}
            {renderInput('inseam', 'Inseam (in)')}
          </div>
        )}
      </div>

      <button onClick={saveProfile} className="px-4 py-2 bg-green-500 text-white rounded">Save Profile</button>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Saved Profiles</h2>
        {profiles.map((profile, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="flex-1">{profile.name || `Profile ${index + 1}`}{activeProfile === index && ' (Active)'}</span>
            <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => selectProfile(index)}>Select</button>
            <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => { setActiveProfile(index); setForm(profile); }}>Edit</button>
            <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => deleteProfile(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileManager2;
