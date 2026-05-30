import { Check, Circle, Lock } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming' | 'locked';
}

interface ProgressBarProps {
  steps: Step[];
}

export default function ProgressBar({ steps }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.status === 'completed'
                    ? 'bg-green-500 border-green-500 text-white'
                    : step.status === 'current'
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : step.status === 'locked'
                    ? 'bg-gray-200 border-gray-300 text-gray-400'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {step.status === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : step.status === 'locked' ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              <span
                className={`mt-2 text-xs sm:text-sm text-center ${
                  step.status === 'completed'
                    ? 'text-green-600 font-medium'
                    : step.status === 'current'
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
