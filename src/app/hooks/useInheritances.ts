import { useState } from 'react';
import type { Thought, EmotionalTheme, Visibility } from '../types/inheritance';
import { randomTheme } from '../types/inheritance';

const KEY = 'the_inheritance_messages';

function load(): Thought[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

function persist(items: Thought[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function useInheritances() {
  const [thoughts, setThoughts] = useState<Thought[]>(load);

  const add = (draft: {
    message: string;
    name?: string;
    anonymous: boolean;
    visibility: Visibility;
    theme: EmotionalTheme;
  }): Thought => {
    const item: Thought = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      theme: draft.theme ?? randomTheme(),
      ...draft,
    };
    const next = [...thoughts, item];
    setThoughts(next);
    persist(next);
    return item;
  };

  return { thoughts, inheritances: thoughts, add };
}
