// @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: ['src/components/deprecated/**', 'src/components/ui/**', 'src/services/deprecated/**'],
  },
  ...tanstackConfig,
]