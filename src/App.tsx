/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import DataInput from './components/DataInput';
import PrizeDraw from './components/PrizeDraw';
import RandomGroup from './components/RandomGroup';
import { Users, Gift, LayoutGrid } from 'lucide-react';

export default function App() {
  const [names, setNames] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'draw' | 'group'>('draw');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            HR Tools
          </h1>
          <p className="text-sm text-gray-500 mt-1">Prize Draw & Grouping</p>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <DataInput names={names} setNames={setNames} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('draw')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'draw' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Gift className="w-5 h-5" />
            Prize Draw
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'group' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            Random Grouping
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {names.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-2xl border border-gray-200 border-dashed">
                <Users className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium text-gray-500">Please add names in the sidebar to get started.</p>
                <p className="text-sm text-gray-400 mt-2">You can paste a list or upload a CSV file.</p>
              </div>
            ) : activeTab === 'draw' ? (
              <PrizeDraw names={names} />
            ) : (
              <RandomGroup names={names} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
