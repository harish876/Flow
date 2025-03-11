// src/config/milestones.ts

/**
 * Each milestone has:
 *  - id: the unique identifier
 *  - label: how it's displayed in dropdowns
 *  - enabled: whether this milestone is visible at all
 *  - extendedEnabled: whether the 'extended' variant is allowed
 */
export interface MilestoneConfig {
    id: string
    label: string
    enabled: boolean
    extendedEnabled: boolean
  }
  
  // Example config:
  export const MILESTONES: MilestoneConfig[] = [
    {
      id: "milestone1",
      label: "Milestone 1",
      enabled: true,
      extendedEnabled: true,
    },
    {
      id: "milestone2",
      label: "Milestone 2",
      enabled: true,
      extendedEnabled: true,
    },
    {
      id: "milestone3",
      label: "Milestone 3",
      enabled: true,
      extendedEnabled: false,
    },
    // Add more as needed
]
  