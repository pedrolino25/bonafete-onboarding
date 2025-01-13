import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  safelist: [
    'quill',
    'ql-toolbar',
    'ql-container',
    'ql-editor',
    'ql-blank',
    'ql-toolbar *',
    'focus-within',
  ],
  prefix: '',
  theme: {
  	fontFamily: {
  		sans: [
  			'Nunito Sans'
  		]
  	},
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			'utility-gray-50': 'var(--utility-gray-50)',
  			'utility-gray-100': 'var(--utility-gray-100)',
  			'utility-gray-200': 'var(--utility-gray-200)',
  			'utility-gray-300': 'var(--utility-gray-300)',
  			'utility-gray-400': 'var(--utility-gray-400)',
  			'utility-gray-500': 'var(--utility-gray-500)',
  			'utility-gray-600': 'var(--utility-gray-600)',
  			'utility-gray-700': 'var(--utility-gray-700)',
  			'utility-gray-800': 'var(--utility-gray-800)',
  			'utility-gray-900': 'var(--utility-gray-900)',
  			'utility-brand-50': 'var(--utility-brand-50)',
  			'utility-brand-100': 'var(--utility-brand-100)',
  			'utility-brand-200': 'var(--utility-brand-200)',
  			'utility-brand-300': 'var(--utility-brand-300)',
  			'utility-brand-400': 'var(--utility-brand-400)',
  			'utility-brand-500': 'var(--utility-brand-500)',
  			'utility-brand-600': 'var(--utility-brand-600)',
  			'utility-brand-700': 'var(--utility-brand-700)',
  			'utility-brand-800': 'var(--utility-brand-800)',
  			'utility-brand-900': 'var(--utility-brand-900)',
  			'utility-error-50': 'var(--utility-error-50)',
  			'utility-error-100': 'var(--utility-error-100)',
  			'utility-error-200': 'var(--utility-error-200)',
  			'utility-error-300': 'var(--utility-error-300)',
  			'utility-error-400': 'var(--utility-error-400)',
  			'utility-error-500': 'var(--utility-error-500)',
  			'utility-error-600': 'var(--utility-error-600)',
  			'utility-error-700': 'var(--utility-error-700)',
  			'utility-warning-50': 'var(--utility-warning-50)',
  			'utility-warning-100': 'var(--utility-warning-100)',
  			'utility-warning-200': 'var(--utility-warning-200)',
  			'utility-warning-300': 'var(--utility-warning-300)',
  			'utility-warning-400': 'var(--utility-warning-400)',
  			'utility-warning-500': 'var(--utility-warning-500)',
  			'utility-warning-600': 'var(--utility-warning-600)',
  			'utility-warning-700': 'var(--utility-warning-700)',
  			'utility-success-50': 'var(--utility-success-50)',
  			'utility-success-100': 'var(--utility-success-100)',
  			'utility-success-200': 'var(--utility-success-200)',
  			'utility-success-300': 'var(--utility-success-300)',
  			'utility-success-400': 'var(--utility-success-400)',
  			'utility-success-500': 'var(--utility-success-500)',
  			'utility-success-600': 'var(--utility-success-600)',
  			'utility-success-700': 'var(--utility-success-700)',
  			'utility-gray-blue-50': 'var(--utility-gray-blue-50)',
  			'utility-gray-blue-100': 'var(--utility-gray-blue-100)',
  			'utility-gray-blue-200': 'var(--utility-gray-blue-200)',
  			'utility-gray-blue-300': 'var(--utility-gray-blue-300)',
  			'utility-gray-blue-400': 'var(--utility-gray-blue-400)',
  			'utility-gray-blue-500': 'var(--utility-gray-blue-500)',
  			'utility-gray-blue-600': 'var(--utility-gray-blue-600)',
  			'utility-gray-blue-700': 'var(--utility-gray-blue-700)',
  			'utility-blue-light-50': 'var(--utility-blue-light-50)',
  			'utility-blue-light-100': 'var(--utility-blue-light-100)',
  			'utility-blue-light-200': 'var(--utility-blue-light-200)',
  			'utility-blue-light-300': 'var(--utility-blue-light-300)',
  			'utility-blue-light-400': 'var(--utility-blue-light-400)',
  			'utility-blue-light-500': 'var(--utility-blue-light-500)',
  			'utility-blue-light-600': 'var(--utility-blue-light-600)',
  			'utility-blue-light-700': 'var(--utility-blue-light-700)',
  			'utility-blue-50': 'var(--utility-blue-50)',
  			'utility-blue-100': 'var(--utility-blue-100)',
  			'utility-blue-200': 'var(--utility-blue-200)',
  			'utility-blue-300': 'var(--utility-blue-300)',
  			'utility-blue-400': 'var(--utility-blue-400)',
  			'utility-blue-500': 'var(--utility-blue-500)',
  			'utility-blue-600': 'var(--utility-blue-600)',
  			'utility-blue-700': 'var(--utility-blue-700)',
  			'utility-blue-dark-50': 'var(--utility-blue-dark-50)',
  			'utility-blue-dark-100': 'var(--utility-blue-dark-100)',
  			'utility-blue-dark-200': 'var(--utility-blue-dark-200)',
  			'utility-blue-dark-300': 'var(--utility-blue-dark-300)',
  			'utility-blue-dark-400': 'var(--utility-blue-dark-400)',
  			'utility-blue-dark-500': 'var(--utility-blue-dark-500)',
  			'utility-blue-dark-600': 'var(--utility-blue-dark-600)',
  			'utility-blue-dark-700': 'var(--utility-blue-dark-700)',
  			'utility-indigo-50': 'var(--utility-indigo-50)',
  			'utility-indigo-100': 'var(--utility-indigo-100)',
  			'utility-indigo-200': 'var(--utility-indigo-200)',
  			'utility-indigo-300': 'var(--utility-indigo-300)',
  			'utility-indigo-400': 'var(--utility-indigo-400)',
  			'utility-indigo-500': 'var(--utility-indigo-500)',
  			'utility-indigo-600': 'var(--utility-indigo-600)',
  			'utility-indigo-700': 'var(--utility-indigo-700)',
  			'utility-purple-50': 'var(--utility-purple-50)',
  			'utility-purple-100': 'var(--utility-purple-100)',
  			'utility-purple-200': 'var(--utility-purple-200)',
  			'utility-purple-300': 'var(--utility-purple-300)',
  			'utility-purple-400': 'var(--utility-purple-400)',
  			'utility-purple-500': 'var(--utility-purple-500)',
  			'utility-purple-600': 'var(--utility-purple-600)',
  			'utility-purple-700': 'var(--utility-purple-700)',
  			'utility-fuchsia-50': 'var(--utility-fuchsia-50)',
  			'utility-fuchsia-100': 'var(--utility-fuchsia-100)',
  			'utility-fuchsia-200': 'var(--utility-fuchsia-200)',
  			'utility-fuchsia-300': 'var(--utility-fuchsia-300)',
  			'utility-fuchsia-400': 'var(--utility-fuchsia-400)',
  			'utility-fuchsia-500': 'var(--utility-fuchsia-500)',
  			'utility-fuchsia-600': 'var(--utility-fuchsia-600)',
  			'utility-fuchsia-700': 'var(--utility-fuchsia-700)',
  			'utility-pink-50': 'var(--utility-pink-50)',
  			'utility-pink-100': 'var(--utility-pink-100)',
  			'utility-pink-200': 'var(--utility-pink-200)',
  			'utility-pink-300': 'var(--utility-pink-300)',
  			'utility-pink-400': 'var(--utility-pink-400)',
  			'utility-pink-500': 'var(--utility-pink-500)',
  			'utility-pink-600': 'var(--utility-pink-600)',
  			'utility-pink-700': 'var(--utility-pink-700)',
  			'utility-orange-dark-50': 'var(--utility-orange-dark-50)',
  			'utility-orange-dark-100': 'var(--utility-orange-dark-100)',
  			'utility-orange-dark-200': 'var(--utility-orange-dark-200)',
  			'utility-orange-dark-300': 'var(--utility-orange-dark-300)',
  			'utility-orange-dark-400': 'var(--utility-orange-dark-400)',
  			'utility-orange-dark-500': 'var(--utility-orange-dark-500)',
  			'utility-orange-dark-600': 'var(--utility-orange-dark-600)',
  			'utility-orange-dark-700': 'var(--utility-orange-dark-700)',
  			'utility-orange-50': 'var(--utility-orange-50)',
  			'utility-orange-100': 'var(--utility-orange-100)',
  			'utility-orange-200': 'var(--utility-orange-200)',
  			'utility-orange-300': 'var(--utility-orange-300)',
  			'utility-orange-400': 'var(--utility-orange-400)',
  			'utility-orange-500': 'var(--utility-orange-500)',
  			'utility-orange-600': 'var(--utility-orange-600)',
  			'utility-orange-700': 'var(--utility-orange-700)',
  			overlay: 'var(--overlay)',
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		boxShadow: {
  			xs: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
  			'brand-md': '0px 0px 0px 4px rgba(17, 33, 49, 0.24)',
  			'gray-md': '0px 0px 0px 4px rgba(16, 24, 40, 0.05)',
  			'error-md': '0px 0px 0px 4px rgba(253, 162, 155, 0.24)',
  			'dropdown-shadow': '0px 12px 16px -4px rgba(16, 24, 40, 0.08)'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
