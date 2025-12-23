




import React, { useState, useEffect } from 'react';
import { Scale, Ruler, Plus, Minus } from 'lucide-react'; // Icons for weight and height

// BMI categories with colors and gradients
const BMI_CATEGORIES = {
  underweight: { label: 'Underweight', color: '#3b82f6', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  normal: { label: 'Normal', color: '#10b981', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  overweight: { label: 'Overweight', color: '#f59e0b', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  obesity: { label: 'Obesity', color: '#ef4444', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
};

// Validation ranges (Metric only)
const VALIDATION_RANGES = {
  weight: { min: 30, max: 300 },
  height: { min: 50, max: 250 },
};

const DailyTracker: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Water Tracking State
  const [waterGlasses, setWaterGlasses] = useState<number>(0);

  // Calculate BMI
  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setBmi(null);
      setCategory('');
      setError('Please enter valid numbers for weight and height.');
      return;
    }

    if (w < VALIDATION_RANGES.weight.min || w > VALIDATION_RANGES.weight.max ||
        h < VALIDATION_RANGES.height.min || h > VALIDATION_RANGES.height.max) {
      setBmi(null);
      setCategory('');
      setError(`Values out of range. Weight: ${VALIDATION_RANGES.weight.min}-${VALIDATION_RANGES.weight.max} kg, Height: ${VALIDATION_RANGES.height.min}-${VALIDATION_RANGES.height.max} cm`);
      return;
    }

    setError('');

    const heightM = h / 100; // cm to m
    const bmiValue = w / (heightM ** 2);
    const roundedBmi = Math.round(bmiValue * 10) / 10;
    setBmi(roundedBmi);

    // Determine category
    if (roundedBmi < 18.5) {
      setCategory('underweight');
    } else if (roundedBmi < 25) {
      setCategory('normal');
    } else if (roundedBmi < 30) {
      setCategory('overweight');
    } else {
      setCategory('obesity');
    }
  };

  // Auto-calculate with debounce
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    setDebounceTimer(setTimeout(calculateBMI, 300));
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [weight, height]);

  // Handle input changes (numbers only)
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ''); // Allow numbers and decimal
    setter(value);
  };

  // Water Tracking Effects
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('waterTracker');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        setWaterGlasses(data.glasses);
      } else {
        localStorage.setItem('waterTracker', JSON.stringify({ date: today, glasses: 0 }));
        setWaterGlasses(0);
      }
    } else {
      localStorage.setItem('waterTracker', JSON.stringify({ date: today, glasses: 0 }));
    }
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('waterTracker', JSON.stringify({ date: today, glasses: waterGlasses }));
  }, [waterGlasses]);

  // Water Functions
  const addGlass = () => {
    setWaterGlasses(prev => Math.min(prev + 1, 12)); // Cap at 12 for extra
  };

  const removeGlass = () => {
    setWaterGlasses(prev => Math.max(0, prev - 1));
  };

  const resetWater = () => {
    setWaterGlasses(0);
  };

  const getMotivation = () => {
    if (waterGlasses >= 8) return "Excellent! You're fully hydrated today. 💧";
    if (waterGlasses >= 4) return "Great progress! Keep it up.";
    return "Start hydrating – your body will thank you!";
  };

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl mb-4 text-black font-bold tracking-tight">
          Daily Nutrition Tracker
        </h1>
        <p className="text-gray-600 text-lg">
          Track your daily nutrition goals and calculate your BMI
        </p>
      </div>

      {/* BMI & Health Metrics Section - Modern, Polished Replacement */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Header with Title and Subtitle */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">BMI & Health Metrics</h2>
            <p className="text-gray-600 text-sm">Track your body mass index and health category instantly.</p>
          </div>

          {/* Inputs - Height and Weight with Icons and Soft Focus Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="weight" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Scale className="w-5 h-5 mr-2 text-blue-500" />
                Weight (kg)
              </label>
              <input
                id="weight"
                type="text"
                value={weight}
                onChange={handleInputChange(setWeight)}
                placeholder="e.g., 70"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:scale-105 focus:shadow-lg transition-all duration-200"
                aria-describedby="weight-error"
              />
            </div>
            <div>
              <label htmlFor="height" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Ruler className="w-5 h-5 mr-2 text-green-500" />
                Height (cm)
              </label>
              <input
                id="height"
                type="text"
                value={height}
                onChange={handleInputChange(setHeight)}
                placeholder="e.g., 170"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:scale-105 focus:shadow-lg transition-all duration-200"
                aria-describedby="height-error"
              />
            </div>
          </div>

          {/* Error Message - Soft Fade In/Out */}
          {error && (
            <div
              className="text-red-600 text-sm mb-6 p-4 bg-red-50 border border-red-200 rounded-lg transition-opacity duration-300 opacity-100"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* BMI Result Display */}
          {bmi !== null && category && (
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-gray-800 mb-2">
                Your BMI: <span className="text-3xl font-extrabold" style={{ color: BMI_CATEGORIES[category as keyof typeof BMI_CATEGORIES].color }}>{bmi}</span>
              </div>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white shadow-sm border ${BMI_CATEGORIES[category as keyof typeof BMI_CATEGORIES].border}`}>
                <span className={BMI_CATEGORIES[category as keyof typeof BMI_CATEGORIES].text}>
                  {BMI_CATEGORIES[category as keyof typeof BMI_CATEGORIES].label}
                </span>
              </div>
            </div>
          )}

          {/* Info Line */}
          <div className="text-center text-xs text-gray-500">
            BMI is an estimate. Consult a professional for medical guidance.
          </div>
        </div>
      </div>

      {/* Daily Water Tracking Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Daily Water Tracker</h2>
            <p className="text-gray-600 text-sm">Track your daily water intake – aim for 8 glasses</p>
          </div>

          {/* Large Circular Button with Pitch-Black Border */}
          <div className="flex justify-center mb-8">
            <div className="w-64 h-64 rounded-full border-[12px] border-black bg-white shadow-lg flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">{waterGlasses}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-between px-4">
            <button
              onClick={addGlass}
              className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
              aria-label="Add glass"
            >
              <Plus className="w-6 h-6" />
            </button>
            <button
              onClick={resetWater}
              className="px-4 py-2 bg-gray-500 text-black rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-lg hover:shadow-xl font-medium"
              aria-label="Reset water intake"
            >
              RESET
            </button>
            <button
              onClick={removeGlass}
              className="flex items-center justify-center w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
              aria-label="Remove glass"
            >
              <Minus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DailyTracker;
