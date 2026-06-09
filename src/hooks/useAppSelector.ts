import { useSelector, type TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@store/index'

/** Hook tipado de selector para evitar casteos manuales */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
