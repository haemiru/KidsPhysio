import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // 코칭 예약 시스템(booking)은 별도 프로젝트(regist-form)에서 그대로 이식한
    // 코드로, 당시 관례(effect 내 데이터 패칭, 시계용 Date.now 초기화)를 따른다.
    // 메인 KidsPhysio 코드는 위 strict 규칙을 그대로 유지하고, 이 하위 시스템만 완화.
    files: ['src/booking/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/exhaustive-deps': 'off',
      // Supabase/토스의 런타임 페이로드는 정적 타입이 없어 일부 any 캐스팅이 필요.
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])
