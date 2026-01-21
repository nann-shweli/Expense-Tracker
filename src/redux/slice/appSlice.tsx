import { createSlice, PayloadAction } from "@reduxjs/toolkit";

 enum ThemeMode {
	Light = "light",
	Dark = "dark",
	System = "system"
}

type AppState = {
	theme: ThemeMode;
}

export const initialState: AppState = {
	theme:  ThemeMode.Light,
}

const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setTheme(state, action: PayloadAction<AppState["theme"]>) {
			state.theme = action.payload;
		},
	},
});

export const { setTheme } = appSlice.actions;
export default appSlice.reducer;