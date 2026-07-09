/**
 * Pragmatic prop editing (Group B, v1). Archetype props are not formally
 * schematized, so instead of TS reflection we read the props off the archetype's
 * own canonical example element: `EXAMPLES[id]()` returns `<CoverSlide …/>`, whose
 * `.props` IS the prop object. We surface the trivially-serializable scalar props
 * (string / number / boolean) as form fields and leave complex ReactNode / array
 * props (titles, item lists) on their canonical example value — the documented v1
 * limitation (phase-4 "Slide Studio (Group B)" non-goals).
 */
import { cloneElement, isValidElement, type ReactElement } from 'react';
import { EXAMPLES } from '@butai/slide-kit';

export type ScalarKind = 'string' | 'number' | 'boolean';
export type ScalarValue = string | number | boolean;

export interface EditableProp {
  key: string;
  kind: ScalarKind;
  value: ScalarValue;
}

/** The archetype's canonical example element, or null if none is registered. */
export function exampleElement(id: string): ReactElement | null {
  const factory = EXAMPLES[id];
  if (!factory) return null;
  const el = factory();
  return isValidElement(el) ? el : null;
}

/**
 * The scalar props a v1 form can safely edit. Skips `children`, data-URI image
 * placeholders (long + not meaningfully editable), and any non-scalar prop.
 */
export function editableProps(el: ReactElement): EditableProp[] {
  const props = (el.props ?? {}) as Record<string, unknown>;
  const out: EditableProp[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') continue;
    if (typeof value === 'string') {
      if (value.startsWith('data:')) continue; // placeholder asset — leave canonical
      out.push({ key, kind: 'string', value });
    } else if (typeof value === 'number') {
      out.push({ key, kind: 'number', value });
    } else if (typeof value === 'boolean') {
      out.push({ key, kind: 'boolean', value });
    }
  }
  return out;
}

/** Re-render the example with the user's scalar overrides merged over canonical. */
export function withOverrides(
  el: ReactElement,
  overrides: Record<string, ScalarValue>,
): ReactElement {
  if (Object.keys(overrides).length === 0) return el;
  return cloneElement(el, overrides as Partial<unknown> & Record<string, unknown>);
}
