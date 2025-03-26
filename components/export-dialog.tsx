"use client"
import { useState } from 'react';
import { Download, X } from 'lucide-react';

interface ExportOption {
  id: string;
  label: string;
  checked: boolean;
}

interface ExportFormat {
  id: string;
  label: string;
  extension: string;
}

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, metrics: string[]) => void;
}

export default function ExportDialog({ isOpen, onClose, onExport }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [metrics, setMetrics] = useState<ExportOption[]>([
    { id: 'overview', label: "Today's Analytics Overview", checked: true },
    { id: 'engagement', label: 'Engagement Rate', checked: true },
    { id: 'pages', label: 'Most Viewed Pages', checked: true },
    { id: 'activeUsers', label: 'Active Users', checked: true },
    { id: 'acquisition', label: 'User Acquisition', checked: true },
    { id: 'geography', label: 'Geographic Distribution', checked: true },
    { id: 'devices', label: 'Device Categories', checked: true },
  ]);

  const formats: ExportFormat[] = [
    { id: 'csv', label: 'CSV', extension: '.csv' },
    { id: 'excel', label: 'Excel', extension: '.xlsx' },
    { id: 'pdf', label: 'PDF', extension: '.pdf' },
    { id: 'json', label: 'JSON', extension: '.json' },
  ];

  const handleMetricToggle = (metricId: string) => {
    setMetrics(metrics.map(metric => 
      metric.id === metricId ? { ...metric, checked: !metric.checked } : metric
    ));
  };

  const handleExport = () => {
    const selectedMetrics = metrics
      .filter(metric => metric.checked)
      .map(metric => metric.id);
    onExport(selectedFormat, selectedMetrics);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">Export Analytics Data</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#4b5563] mb-2">Export Format</h3>
          <div className="grid grid-cols-2 gap-2">
            {formats.map(format => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`px-4 py-2 rounded border ${
                  selectedFormat === format.id
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {format.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#4b5563] mb-2">Select Metrics</h3>
          <div className="space-y-2">
            {metrics.map(metric => (
              <label
                key={metric.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={metric.checked}
                  onChange={() => handleMetricToggle(metric.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{metric.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
} 