import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, Trash2, AlertCircle, Wand2 } from 'lucide-react';

interface DataInputProps {
  names: string[];
  setNames: (names: string[]) => void;
}

export default function DataInput({ names, setNames }: DataInputProps) {
  const [inputType, setInputType] = useState<'paste' | 'csv'>('paste');
  const [pasteText, setPasteText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasteSubmit = () => {
    const parsedNames = pasteText
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    
    setNames(parsedNames);
    setPasteText(''); // ✅ 匯入後清空文字框
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const parsedNames: string[] = [];
        results.data.forEach((row: any) => {
          if (Array.isArray(row)) {
            row.forEach(cell => {
              if (typeof cell === 'string' && cell.trim()) {
                parsedNames.push(cell.trim());
              }
            });
          } else if (typeof row === 'string' && row.trim()) {
             parsedNames.push(row.trim());
          } else if (typeof row === 'object' && row !== null) {
             const values = Object.values(row);
             if (values.length > 0 && typeof values[0] === 'string' && values[0].trim()) {
                 parsedNames.push(values[0].trim());
             }
          }
        });
        setNames(parsedNames);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Failed to parse CSV file.');
      }
    });
  };

  const clearNames = () => {
    setNames([]);
    setPasteText('');
  };

  const loadSampleData = () => {
    setNames([
      "Alice Smith", "Bob Jones", "Charlie Brown", "Diana Prince", 
      "Eve Adams", "Frank Castle", "Grace Hopper", "Alice Smith", 
      "Bob Jones", "Hank Pym", "Ivy Pepper"
    ]);
  };

  const counts = names.reduce((acc, name) => {
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const hasDuplicates = Object.values(counts).some(count => count > 1);

  const removeDuplicates = () => {
    setNames([...new Set(names)]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Source</h2>
        
        <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
          <button
            onClick={() => setInputType('paste')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              inputType === 'paste' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setInputType('csv')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              inputType === 'csv' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload CSV
          </button>
        </div>

        {inputType === 'paste' ? (
          <div className="space-y-3">
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
              placeholder="Paste names here...&#10;One name per line or separated by commas."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            <button
              onClick={handlePasteSubmit}
              disabled={!pasteText.trim()}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Import Names
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload CSV file</p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <button 
            onClick={loadSampleData}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            Load Sample Data
          </button>
        </div>
      </div>

      {names.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Current List ({names.length})
            </h3>
            <div className="flex items-center gap-2">
              {hasDuplicates && (
                <button
                  onClick={removeDuplicates}
                  className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded font-medium transition-colors"
                >
                  Remove Duplicates
                </button>
              )}
              <button 
                onClick={clearNames}
                className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
                title="Clear list"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg max-h-60 overflow-y-auto p-2">
            <ul className="space-y-1">
              {names.map((name, idx) => {
                const isDuplicate = counts[name] > 1;
                return (
                  <li 
                    key={idx} 
                    className={`text-sm px-2 py-1 rounded border shadow-sm truncate flex justify-between items-center ${
                      isDuplicate ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-100 text-gray-700'
                    }`}
                  >
                    <span>{name}</span>
                    {isDuplicate && (
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-red-200 text-red-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Duplicate
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
