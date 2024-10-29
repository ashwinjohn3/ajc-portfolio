import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch"


export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="flex items-center space-x-2">
            <Switch id='theme-switcher'
                checked={ theme === 'dark' }
                onCheckedChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            />
            <label htmlFor="theme-switcher">
                {theme === 'light' ? 'Light' : 'Dark'} Mode
            </label>
        </div>
    )
}