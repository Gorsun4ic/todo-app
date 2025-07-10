import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "api/apiAuth";
import { taskApiSlice } from "api/apiTaskLists";


export const store = configureStore({
	reducer: {
		[authSlice.reducerPath]: authSlice.reducer,
		[taskApiSlice.reducerPath]: taskApiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			authSlice.middleware,
			taskApiSlice.middleware
		),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
