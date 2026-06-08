import { useEffect, useState } from 'react';
import type { PopulationGroup, RegionalMenu } from '../types';

const API_BASE = import.meta.env.DEV ? 'http://localhost:8000' : '';

interface CommunityMenuApi {
  id:           number;
  menu_name:    string;
  description:  string | null;
  foods:        string[];
  region:       string;
  sub_region:   string | null;
  population:   string;
  channel:      string;
  verified:     boolean;
  submitted_at: string;
}

/** Menús comunitarios verificados, agrupados por id de subregión, listos para fusionar con SUBREGIONS. */
export function useCommunityMenus() {
  const [menusBySubRegion, setMenusBySubRegion] = useState<Record<string, RegionalMenu[]>>({});

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/community/menus?verified=true`)
      .then(res => (res.ok ? res.json() : []))
      .then((data: CommunityMenuApi[]) => {
        if (cancelled) return;
        const grouped: Record<string, RegionalMenu[]> = {};
        for (const m of data) {
          if (!m.sub_region) continue;
          const menu: RegionalMenu = {
            id:            `community_${m.id}`,
            name:          m.menu_name,
            description:   m.description ?? '',
            foods:         m.foods,
            population:    m.population as PopulationGroup,
            isTraditional: false,
            submittedAt:   m.submitted_at,
            verified:      true,
          };
          (grouped[m.sub_region] ??= []).push(menu);
        }
        setMenusBySubRegion(grouped);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return menusBySubRegion;
}
