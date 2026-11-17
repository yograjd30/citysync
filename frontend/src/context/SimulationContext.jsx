import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { apiRequest } from '../api/client';

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  const [step, setStep] = useState(144); // Start at midday 12:00
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1); // 1x, 2x, 5x
  const [seed, setSeed] = useState(42);
  const [activeEvents, setActiveEvents] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [config, setConfig] = useState(null);
  const [currentState, setCurrentState] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState('downtown');
  const [selectedNode, setSelectedNode] = useState('downtown:traffic');
  const [pulseHistory, setPulseHistory] = useState([82, 81, 80, 83, 85, 84, 82]);

  const timerRef = useRef(null);

  // 1. Fetch static city configuration on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await apiRequest('/api/simulation/config');
        setConfig(data);
      } catch (err) {
        console.error('Failed to load simulation config', err);
      }
    }
    loadConfig();
  }, []);

  // 2. Fetch or calculate current state when step, seed, activeEvents, or interventions change
  const fetchState = useCallback(async (currentStep, currentEvents, currentInterventions) => {
    try {
      const qEvents = encodeURIComponent(JSON.stringify(currentEvents));
      const qInterventions = encodeURIComponent(JSON.stringify(currentInterventions));
      const data = await apiRequest(
        `/api/simulation/state?step=${currentStep}&seed=${seed}&events=${qEvents}&interventions=${qInterventions}`
      );
      setCurrentState(data);
      setPulseHistory((prev) => {
        const next = [...prev.slice(-20), data.stabilityIndex];
        return next;
      });
    } catch (err) {
      console.error('Failed to fetch simulation step', err);
    } finally {
      setIsLoading(false);
    }
  }, [seed]);

  useEffect(() => {
    fetchState(step, activeEvents, interventions);
  }, [step, activeEvents, interventions, fetchState]);

  // 3. Playback clock loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(200, 1000 / playSpeed);
      timerRef.current = setInterval(() => {
        setStep((prev) => (prev + 1) % 288);
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playSpeed]);

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const stepForward = () => setStep((prev) => (prev + 1) % 288);
  const stepBackward = () => setStep((prev) => (prev - 1 + 288) % 288);

  const addEvent = (newEvent) => {
    setActiveEvents((prev) => [...prev, newEvent]);
  };

  const removeEvent = (index) => {
    setActiveEvents((prev) => prev.filter((_, i) => i !== index));
  };

  const clearEvents = () => setActiveEvents([]);

  const toggleIntervention = (action) => {
    setInterventions((prev) => {
      const exists = prev.some((i) => i.actionId === action.actionId && i.targetZone === action.targetZone);
      if (exists) {
        return prev.filter((i) => !(i.actionId === action.actionId && i.targetZone === action.targetZone));
      }
      return [...prev, action];
    });
  };

  const clearInterventions = () => setInterventions([]);

  return (
    <SimulationContext.Provider
      value={{
        step,
        setStep,
        isPlaying,
        togglePlay,
        playSpeed,
        setPlaySpeed,
        stepForward,
        stepBackward,
        seed,
        setSeed,
        activeEvents,
        addEvent,
        removeEvent,
        clearEvents,
        interventions,
        toggleIntervention,
        clearInterventions,
        config,
        currentState,
        timeline,
        isLoading,
        selectedZone,
        setSelectedZone,
        selectedNode,
        setSelectedNode,
        pulseHistory,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
