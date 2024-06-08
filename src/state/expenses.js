import { atom } from "recoil";

export const expensesState = atom({
    key: "expenses",
    default: [],
})