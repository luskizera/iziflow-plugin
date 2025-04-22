// ./
module.exports = {
	darkMode: ["class"],
	content: [
	  "./src/**/*.{ts,tsx}",
	  "./components/**/*.{ts,tsx}",
	  "./app/**/*.{ts,tsx}",
	  "./src/components/**/*.{ts,tsx}"
	],
	theme: {
	  container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px"
		}
	  },
	  fontFamily: {
		sans: ["var(--font-sans)", "sans-serif"],
		mono: ["var(--font-mono)", "monospace"]
	  },
	  extend: {
		fontFamily: {
		  sans: ["var(--font-sans)", "sans-serif"],
		  mono: ["var(--font-mono)", "monospace"]
		},
		colors: {
		  "foreground_primary_default": "var(--primary-900)",
		  "foreground_secondary_default": "var(--zinc-100)",
		  "foreground_destructive_default": "var(--red-900)",
		  "foreground_success_default": "var(--emerald-600)",
		  "foreground_warning_default": "var(--yellow-600)",
		  "foreground_disabled_default": "var(--zinc-600)",
		  "foreground_default": "var(--zinc-50)",
		  "foreground_muted": "var(--zinc-400)",
		  "foreground_accent": "var(--zinc-50)",
		  "background_primary_default": "var(--primary-50)",
		  "background_primary_default_hover": "rgba(250, 250, 250, 0.800000011920929)",
		  "background_primary_light": "var(--primary-900)",
		  "background_primary_light_hover": "var(--primary-950)",
		  "background_secondary_default": "var(--zinc-800)",
		  "background_destructive_default": "var(--red-800)",
		  "background_destructive_default_hover": "rgba(153, 27, 27, 0.800000011920929)",
		  "background_destructive_light": "rgba(220, 38, 38, 0.15000000596046448)",
		  "background_destructive_light_hover": "rgba(220, 38, 38, 0.20000000298023224)",
		  "background_success_default": "var(--emerald-800)",
		  "background_warning_default": "var(--yellow-500)",
		  "background_warning_default_hover": "var(--yellow-600)",
		  "background_warning_light": "rgba(234, 179, 8, 0.15000000596046448)",
		  "background_warning_light_hover": "rgba(234, 179, 8, 0.20000000298023224)",
		  "background_success_default_hover": "var(--emerald-900)",
		  "background_success_light": "rgba(5, 150, 105, 0.15000000596046448)",
		  "background_success_light_hover": "rgba(5, 150, 105, 0.20000000298023224)",
		  "background_disabled_default": "var(--neutral-400)",
		  "background_default": "var(--zinc-950)",
		  "background_card": "var(--zinc-950)",
		  "background_popover": "var(--zinc-950)",
		  "background_input": "var(--zinc-700)",
		  "background_muted": "var(--zinc-800)",
		  "background_accent": "var(--zinc-800)",
		  "border_primary_default": "var(--zinc-300)",
		  "border_destructive_default": "var(--red-900)",
		  "border_success_default": "var(--emerald-600)",
		  "charts_chart_1_opacity100": "rgba(38, 98, 217, 1)",
		  "charts_chart_1_opacity80": "rgba(38, 98, 217, 0.800000011920929)",
		  "charts_chart_1_opacity50": "rgba(38, 98, 217, 0.5)",
		  "charts_chart_1_opacity10": "rgba(38, 98, 217, 0.10000000149011612)",
		  "charts_chart_2_opacity100": "rgba(226, 54, 112, 1)",
		  "charts_chart_2_opacity80": "rgba(226, 54, 112, 1)",
		  "charts_chart_2_opacity50": "rgba(226, 54, 112, 1)",
		  "charts_chart_2_opacity10": "rgba(226, 54, 112, 1)",
		  "charts_chart_3_opacity100": "rgba(232, 140, 48, 1)",
		  "charts_chart_3_opacity80": "rgba(232, 140, 48, 1)",
		  "charts_chart_3_opacity50": "rgba(232, 140, 48, 1)",
		  "charts_chart_3_opacity10": "rgba(232, 140, 48, 1)",
		  "charts_chart_4_opacity100": "rgba(175, 87, 219, 1)",
		  "charts_chart_4_opacity80": "rgba(175, 87, 219, 1)",
		  "charts_chart_4_opacity50": "rgba(175, 87, 219, 1)",
		  "charts_chart_4_opacity10": "rgba(175, 87, 219, 1)",
		  "charts_chart_5_opacity100": "rgba(46, 184, 138, 1)",
		  "charts_chart_5_opacity80": "rgba(46, 184, 138, 1)",
		  "charts_chart_5_opacity50": "rgba(46, 184, 138, 1)",
		  "charts_chart_5_opacity10": "rgba(46, 184, 138, 1)",
		  "border_default": "var(--zinc-700)",
		  "icon_default": "var(--zinc-50)",
		  "icon_muted": "var(--zinc-400)",
		  "icon_accent": "var(--zinc-50)",
		  "icon_primary_default": "var(--primary-900)",
		  "icon_secondary_default": "var(--zinc-100)",
		  "icon_destructive_default": "var(--red-900)",
		  "icon_success_default": "var(--emerald-600)",
		  "icon_warning_default": "var(--yellow-600)",
		  "icon_disabled_default": "var(--zinc-600)",
		  "border_warning_default": "var(--yellow-600)",
		  "icon_destructive_on_destructive": "var(--red-300)",
		  "icon_destructive_hover___on_destructive": "var(--white)"
		},
	  }
	},
	plugins: []
  };
  