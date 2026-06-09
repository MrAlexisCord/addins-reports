import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@store/index'

/** Hook tipado de dispatch para evitar usar `any` */
export const useAppDispatch = () => useDispatch<AppDispatch>()
