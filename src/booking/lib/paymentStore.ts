// 결제 단계에서 선택한 프로그램 코드 보관 (토스 리다이렉트 후 success 페이지에서 사용)
const KEY = 'rf_program_code'

export const saveProgramCode = (code: string): void => sessionStorage.setItem(KEY, code)
export const getProgramCode = (): string | null => sessionStorage.getItem(KEY)
export const clearProgramCode = (): void => sessionStorage.removeItem(KEY)
