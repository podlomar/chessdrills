import { describe, expect, it } from 'vitest';
import { App } from '@/app/App.tsx';

describe('toolchain', () => {
  it('resolves the @/ alias and compiles JSX', () => {
    expect(App).toBeTypeOf('function');
  });
});
