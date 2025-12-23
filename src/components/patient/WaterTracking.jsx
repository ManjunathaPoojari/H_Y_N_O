import React, { useState } from 'react';

const WaterTracking = () => {
  const [glasses, setGlasses] = useState(3); // Example starting value
  const target = 8;

  const addGlass = () => {
    if (glasses < target) {
      setGlasses(glasses + 1);
    }
  };

  const removeGlass = () => {
    if (glasses > 0) {
      setGlasses(glasses - 1);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Water Intake Tracker 💧
        </h2>
        <p className="text-gray-600 mb-4">Target: {target} Glasses</p>
        <p className="text-lg text-blue-600 mb-6">
          You've had {glasses} glasses today
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={removeGlass}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            disabled={glasses === 0}
          >
            – Remove Glass
          </button>
          <button
            onClick={addGlass}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            disabled={glasses === target}
          >
            + Add Glass
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterTracking;
