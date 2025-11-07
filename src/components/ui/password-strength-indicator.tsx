import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const calculateStrength = (pwd: string) => {
    let score = 0;
    const feedback = [];

    if (pwd.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[a-z]/.test(pwd)) score += 1;
    else feedback.push('Lowercase letter');

    if (/[A-Z]/.test(pwd)) score += 1;
    else feedback.push('Uppercase letter');

    if (/[0-9]/.test(pwd)) score += 1;
    else feedback.push('Number');

    if (/[@#$%^&+=!]/.test(pwd)) score += 1;
    else feedback.push('Special character (@#$%^&+=!)');

    return { score, feedback };
  };

  const { score, feedback } = calculateStrength(password);

  const getStrengthColor = () => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${score <= 2 ? 'text-red-600' : score <= 3 ? 'text-yellow-600' : score <= 4 ? 'text-blue-600' : 'text-green-600'}`}>
          {getStrengthText()}
        </span>
      </div>
      {feedback.length > 0 && (
        <ul className="text-xs text-gray-600 space-y-1">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              <span className="text-red-500">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
