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
  thighCircumference: ''
};

const presets = {
  S: {
    chest: 34,
    waist: 28,
    hip: 34,
    armLength: 24,
    bicepCircumference: 12,
    legLength: 30,
    thighCircumference: 18
  },
  M: {
    chest: 38,
    waist: 32,
    hip: 38,
    armLength: 25,
    bicepCircumference: 13,
    legLength: 32,
    thighCircumference: 20
  },
  L: {
    chest: 42,
    waist: 36,
    hip: 42,
    armLength: 26,
    bicepCircumference: 14,
    legLength: 34,
    thighCircumference: 22
  }
};

const ProfileManager = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState({
    metadata: true,
    torso: true,
    arms: true,
    legs: true
  });
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('profiles');
    if (saved) {
      setProfiles(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const applyPreset = (size) => {
    setForm((prev) => ({ ...prev, ...presets[size] }));
  };

  const validate = () => {
    const newErrors = {};
    const numericFields = [
      'height',
      'weight',
      'chest',
      'waist',
      'hip',
      'armLength',
      'bicepCircumference',
      'legLength',
      'thighCircumference'
    ];
    numericFields.forEach((field) => {
      const value = parseFloat(form[field]);
      if (isNaN(value) || value <= 0) {
        newErrors[field] = 'Must be a positive number';
      }
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
    localStorage.setItem('profiles', JSON.stringify(updated));
    setActiveProfile(updated.length - 1);
  };

  const selectProfile = (index) => {
    setForm(profiles[index]);
    setActiveProfile(index);
  };

  const deleteProfile = (index) => {
    const updated = profiles.filter((_, i) => i !== index);
    setProfiles(updated);
    localStorage.setItem('profiles', JSON.stringify(updated));
    if (activeProfile === index) {
      setActiveProfile(null);
      setForm(initialState);
    }
  };

  const toggleSection = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-2">
        {['S', 'M', 'L'].map((size) => (
          <button
            key={size}
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => applyPreset(size)}
          >
            {size}
          </button>
        ))}
      </div>
      {/* Metadata Section */}
      <div className="border rounded-md">
        <div
          className="bg-gray-200 px-4 py-2 cursor-pointer"
          onClick={() => toggleSection('metadata')}
        >
          Metadata
        </div>
        {expanded.metadata && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Height (in)</label>
              <input
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.height && <p className="text-red-500 text-xs">{errors.height}</p>}
            </div>
            <div>
              <label className="block text-sm">Weight (lbs)</label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.weight && <p className="text-red-500 text-xs">{errors.weight}</p>}
            </div>
            <div>
              <label className="block text-sm">Posture</label>
              <select
                name="posture"
                value={form.posture}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="neutral">Neutral</option>
                <option value="slouched">Slouched</option>
                <option value="erect">Erect</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Stance</label>
              <select
                name="stance"
                value={form.stance}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="regular">Regular</option>
                <option value="wide">Wide</option>
                <option value="narrow">Narrow</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Torso Section */}
      <div className="border rounded-md">
        <div
          className="bg-gray-200 px-4 py-2 cursor-pointer"
          onClick={() => toggleSection('torso')}
        >
          Torso
        </div>
        {expanded.torso && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Chest Circumference (in)</label>
              <input
                type="number"
                name="chest"
                value={form.chest}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.chest && <p className="text-red-500 text-xs">{errors.chest}</p>}
            </div>
            <div>
              <label className="block text-sm">Waist Circumference (in)</label>
              <input
                type="number"
                name="waist"
                value={form.waist}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.waist && <p className="text-red-500 text-xs">{errors.waist}</p>}
            </div>
            <div>
              <label className="block text-sm">Hip Circumference (in)</label>
              <input
                type="number"
                name="hip"
                value={form.hip}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.hip && <p className="text-red-500 text-xs">{errors.hip}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Arms Section */}
      <div className="border rounded-md">
        <div
          className="bg-gray-200 px-4 py-2 cursor-pointer"
          onClick={() => toggleSection('arms')}
        >
          Arms
        </div>
        {expanded.arms && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Arm Length (in)</label>
              <input
                type="number"
                name="armLength"
                value={form.armLength}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.armLength && <p className="text-red-500 text-xs">{errors.armLength}</p>}
            </div>
            <div>
              <label className="block text-sm">Bicep Circumference (in)</label>
              <input
                type="number"
                name="bicepCircumference"
                value={form.bicepCircumference}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.bicepCircumference && (
                <p className="text-red-500 text-xs">{errors.bicepCircumference}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legs Section */}
      <div className="border rounded-md">
        <div
          className="bg-gray-200 px-4 py-2 cursor-pointer"
          onClick={() => toggleSection('legs')}
        >
          Legs
        </div>
        {expanded.legs && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Leg Length (in)</label>
              <input
                type="number"
                name="legLength"
                value={form.legLength}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.legLength && <p className="text-red-500 text-xs">{errors.legLength}</p>}
            </div>
            <div>
              <label className="block text-sm">Thigh Circumference (in)</label>
              <input
                type="number"
                name="thighCircumference"
                value={form.thighCircumference}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.thighCircumference && (
                <p className="text-red-500 text-xs">{errors.thighCircumference}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={saveProfile}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Save Profile
      </button>

      {/* Saved Profiles */}
      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-semibold">Saved Profiles</h2>
        {profiles.map((profile, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="flex-1">
              {profile.name || `Profile ${index + 1}`}
              {activeProfile === index && ' (Active)'}
            </span>
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded"
              onClick={() => selectProfile(index)}
            >
              Select
            </button>
            <button
              className="px-2 py-1 bg-yellow-500 text-white rounded"
              onClick={() => {
                setActiveProfile(index);
                setForm(profile);
              }}
            >
              Edit
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => deleteProfile(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileManager;
