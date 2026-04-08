import { useState } from 'react';
import { Users, Shuffle, Download } from 'lucide-react';
import { motion } from 'motion/react';

interface RandomGroupProps {
  names: string[];
}

export default function RandomGroup({ names }: RandomGroupProps) {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<string[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateGroups = () => {
    setIsGenerating(true);
    
    // Small delay to show animation
    setTimeout(() => {
      const shuffled = [...names].sort(() => Math.random() - 0.5);
      const newGroups: string[][] = [];
      
      for (let i = 0; i < shuffled.length; i += groupSize) {
        newGroups.push(shuffled.slice(i, i + groupSize));
      }
      
      setGroups(newGroups);
      setIsGenerating(false);
    }, 600);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Group,Name\n";

    groups.forEach((group, groupIndex) => {
      group.forEach(name => {
        // Escape quotes in name
        const safeName = name.replace(/"/g, '""');
        csvContent += `Group ${groupIndex + 1},"${safeName}"\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "groups.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              People per Group
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="2"
                max={Math.max(2, Math.min(20, names.length))}
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="w-12 text-center font-bold text-lg text-blue-600 bg-blue-50 py-1 rounded-md">
                {groupSize}
              </span>
            </div>
          </div>
          
          <button
            onClick={generateGroups}
            disabled={isGenerating || names.length < 2}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Shuffle className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {groups.length > 0 ? 'Regenerate Groups' : 'Generate Groups'}
          </button>
        </div>
        
        {names.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Will create approximately {Math.ceil(names.length / groupSize)} groups from {names.length} people
          </div>
        )}
      </div>

      {/* Results */}
      {groups.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Grouping Results</h3>
            <button
              onClick={downloadCSV}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={idx}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="font-semibold text-gray-800">Group {idx + 1}</h4>
                  <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {group.length} members
                  </span>
                </div>
                <ul className="divide-y divide-gray-100">
                  {group.map((name, nameIdx) => (
                    <li key={nameIdx} className="px-4 py-3 text-gray-700 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{name}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
