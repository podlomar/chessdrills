import { describe, expect, it } from 'vitest';
import { App } from '@/app.tsx';

describe('toolchain', () => {
  it('resolves the @/ alias and compiles JSX', () => {
    expect(App).toBeTypeOf('function');
  });
});
