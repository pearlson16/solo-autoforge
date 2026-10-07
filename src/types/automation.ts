import type { Rarity } from '../hooks/useAutoForge';

export interface AutoDisenchanterRules {
  autoScrapCommon: boolean;
  autoScrapRare: boolean;
  autoScrapEpic: boolean;
  autoScrapIfStatLower: boolean;
  autoFuseIdentical: boolean; // Combine 3 items of same rarity into 1 higher rarity item
  conveyorSpeedLevel: number; // 1 to 5
}

export const DEFAULT_AUTOMATION_RULES: AutoDisenchanterRules = {
  autoScrapCommon: true,
  autoScrapRare: false,
  autoScrapEpic: false,
  autoScrapIfStatLower: false,
  autoFuseIdentical: true,
  conveyorSpeedLevel: 1,
};

export interface ConveyorItem {
  id: string;
  name: string;
  rarity: Rarity;
  color: string;
  progress: number; // 0 to 100% along the belt
  action: 'forge' | 'scrap' | 'fuse' | 'equip';
}
