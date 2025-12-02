/* ==========================================================
File: src/app/hooks.ts
Purpose: Centralized typed Redux hooks for the application.
========================================================== */
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "../store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

