import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSimulation } from '../context/SimulationContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CommandBar } from '../components/common/CommandBar';

// Dashboard sub-components
import { KPIRow } from '../components/dashboard/KPIRow';
import { TimeScrubber } from '../components/dashboard/TimeScrubber';
import { IsometricMap } from '../components/dashboard/IsometricMap';
import { ZoneDetailPane } from '../components/dashboard/ZoneDetailPane';
import { AlertFeed } from '../components/dashboard/AlertFeed';
import { GuidedFirstRun } from '../components/dashboard/GuidedFirstRun';

// Innovation page views
import { ScenarioLab } from './ScenarioLab';
import { InterconnectionsGraph } from './InterconnectionsGraph';
import { EarlyWarnings } from './EarlyWarnings';
import { Recommendations } from './Recommendations';
import { Resilience } from './Resilience';
import { ModelInfo } from './ModelInfo';

import {
  Activity,
  LogOut,
  Sun,
  Moon,
  Search,
  LayoutDashboard,
  GitFork,
  Network,
  ShieldAlert,
  Lightbulb,
  ShieldCheck,
  Cpu,
  Command,
} from 'lucide-react';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);

  const {
    step,
    setStep,
    isPlaying,
    togglePlay,
    playSpeed,
    setPlaySpeed,
    stepForward,
    stepBackward,
    currentState,
    pulseHistory,
    selectedZone,
    setSelectedZone,
    activeEvents,
  } = useSimulation();

  useEffect(() => {
    const handleOpenCommandBar = () => setIsCommandBarOpen(true);
    window.addEventListener('citysync:open-command-bar', handleOpenCommandBar);
    return () => window.removeEventListener('citysync:open-command-bar', handleOpenCommandBar);
  }, []);

  const navTabs = [
    { id: 'dashboard', label: 'Operations', icon: LayoutDashboard },
    { id: 'scenarios', label: 'Scenario Lab', icon: GitFork },
    { id: 'graph', label: 'Ripple Engine', icon: Network },
    { id: 'warnings', label: 'Early Warnings', icon: ShieldAlert },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'resilience', label: 'Resilience & Brief', icon: ShieldCheck },
    { id: 'models', label: 'Model Cards', icon: Cpu },
  ];

  return (
    <div className="min-h-[100dvh] w-full flex flex-col p-3 sm:p-5 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <header className="w-full flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-3">
        {/* Left: Brand & Honesty Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/10">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg font-bold tracking-tight text-white">
                CitySync
              </h1>
              <Badge type="Simulated" />
              {user?.isGuestDemo && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Evaluator Demo Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-teal-400/80 font-mono">
              "See the chain reaction before it happens"
            </p>
          </div>
        </div>

        {/* Right: Command Bar trigger, Theme toggle, Profile */}
        <div className="flex items-center justify-between md:justify-end gap-2.5">
          {/* Command Bar Button */}
          <button
            onClick={() => setIsCommandBarOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Command Bar</span>
            <kbd className="hidden sm:inline text-[10px] font-mono px-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Ctrl+K
            </kbd>
          </button>

          {/* Theme Switcher */}
          <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-700/50 rounded-xl p-1">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'light' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Light theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'dark' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Dark theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-2 pl-2">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full border border-teal-400/40 object-cover"
              />
            )}
            <span className="hidden lg:inline text-xs font-medium text-slate-300">
              {user?.name?.split(' ')[0]}
            </span>
            <Button variant="glass" size="sm" icon={LogOut} onClick={logout} title="Sign Out">
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Pills Bar */}
      <nav className="w-full flex items-center gap-1.5 overflow-x-auto py-3 border-b border-white/5 scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-5 py-4">
        {activeTab === 'dashboard' && (
          <>
            {/* Evaluator Guided Tour */}
            <GuidedFirstRun onSelectTab={setActiveTab} />

            {/* KPI Cards Row */}
            <KPIRow currentState={currentState} pulseHistory={pulseHistory} />

            {/* 24h Time Scrubber */}
            <TimeScrubber
              step={step}
              setStep={setStep}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              playSpeed={playSpeed}
              setPlaySpeed={setPlaySpeed}
              stepForward={stepForward}
              stepBackward={stepBackward}
              activeEvents={activeEvents}
            />

            {/* Main Interactive Map & Feed Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Map Canvas (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <IsometricMap
                  currentState={currentState}
                  selectedZone={selectedZone}
                  onSelectZone={setSelectedZone}
                />
              </div>

              {/* Detail Pane & Alert Feed (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {selectedZone && (
                  <ZoneDetailPane
                    zoneId={selectedZone}
                    currentState={currentState}
                    onClose={() => setSelectedZone(null)}
                  />
                )}
                <AlertFeed activeAlerts={currentState?.activeAlerts} onSelectNode={setSelectedZone} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'scenarios' && <ScenarioLab />}
        {activeTab === 'graph' && <InterconnectionsGraph />}
        {activeTab === 'warnings' && <EarlyWarnings />}
        {activeTab === 'recommendations' && <Recommendations />}
        {activeTab === 'resilience' && <Resilience />}
        {activeTab === 'models' && <ModelInfo />}
      </main>

      {/* Command Bar Modal */}
      <CommandBar
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
        onNavigate={setActiveTab}
      />
    </div>
  );
}
