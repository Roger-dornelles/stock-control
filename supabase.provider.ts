import { createClient } from "@supabase/supabase-js";

const ws = require("ws");

export const SupabaseProvider = {
	provide: "SUPABASE_CLIENT",
	useFactory: () => {
		const url = process.env.SUPABASE_URL;
		const key = process.env.SUPABASE_KEY;

		if (!url || !key) {
			throw new Error("SUPABASE_URL e SUPABASE_KEY são obrigatórios");
		}

		return createClient(url, key, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
			realtime: {
				transport: ws,
			},
		});
	},
};
