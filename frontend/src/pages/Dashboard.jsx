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
    <div className="min-h-[100dvh] w-full flex flex-col p-3 sm:p-5 md:p-6 max-w-7xl mx-auto">
      {/* Top Header - Quiet, Authoritative Chrome */}
      <header className="w-full flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-[var(--hairline)] gap-3">
        {/* Left: Brand Wordmark & Telemetry Label */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)] flex items-center justify-center text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                CitySync
              </h1>
              <Badge type="Simulated" />
              {user?.isGuestDemo && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[3px] bg-slate-800 text-[var(--text-muted)] border border-white/[0.06]">
                  Demo
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Interconnected infrastructure telemetry &amp; cascade intelligence
            </p>
          </div>
        </div>

        {/* Right: Search, Theme Toggle, Profile */}
        <div className="flex items-center justify-between md:justify-end gap-2">
          {/* Command Bar Button */}
          <button
            onClick={() => setIsCommandBarOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] border border-[var(--hairline)] text-xs text-[var(--text-secondary)] transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="hidden sm:inline">Search actions</span>
            <kbd className="hidden sm:inline text-[10px] font-mono px-1 rounded bg-black/30 text-[var(--text-muted)] border border-white/[0.06]">
              Ctrl+K
            </kbd>
          </button>

          {/* Theme Switcher */}
          <div className="flex items-center gap-0.5 bg-[var(--surface-raised)] border border-[var(--hairline)] rounded-lg p-0.5">
            <button
              onClick={() => setTheme('light')}
              className={`p-1 rounded transition-colors ${
                theme === 'light' ? 'bg-white/10 text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
              title="Light theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1 rounded transition-colors ${
                theme === 'dark' ? 'bg-white/10 text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
              title="Dark theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-[var(--hairline)]">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full border border-[var(--hairline)] object-cover"
              />
            )}
            <span className="hidden lg:inline text-xs text-[var(--text-secondary)]">
              {user?.name?.split(' ')[0]}
            </span>
            <button
              onClick={logout}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation - Segmented Control, Zero Neon Glow */}
      <nav className="w-full flex items-center gap-1 overflow-x-auto py-2.5 border-b border-[var(--hairline)] scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--hairline-focused)] font-semibold shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.03]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-4 py-4">
        {activeTab === 'dashboard' && (
          <>
            {/* System Status Banner */}
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
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
