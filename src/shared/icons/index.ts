import {
	Sparkles,
	User,
	Bot,
	Send,
	X,
	FileSearch,
	Search,
	RefreshCw,
	Pencil,
	CircleCheck,
	CircleAlert,
	Loader,
	ChevronRight,
	ChevronDown,
	Code,
	CircleStop,
} from "lucide-static";

const iconMap: Record<string, string> = {
	sparkles: Sparkles,
	user: User,
	bot: Bot,
	send: Send,
	x: X,
	fileSearch: FileSearch,
	search: Search,
	refreshCw: RefreshCw,
	edit3: Pencil,
	checkCircle: CircleCheck,
	alertCircle: CircleAlert,
	loader: Loader,
	chevronRight: ChevronRight,
	chevronDown: ChevronDown,
	code: Code,
	circleStop: CircleStop,
};

export function getIconSvg(name: string): string {
	return iconMap[name] ?? "";
}

export function icon(name: string, size: number = 24): string {
	const svg = getIconSvg(name);
	if (!svg) return "";
	return svg
		.replace(/width="24"/, `width="${size}"`)
		.replace(/height="24"/, `height="${size}"`);
}

export const AI_ICON: string = icon("sparkles");
export const USER_ICON: string = icon("user");
export const BOT_ICON: string = icon("bot");
export const SEND_ICON: string = icon("send");
export const CLOSE_ICON: string = icon("x");
export const READ_TOOL_ICON: string = icon("fileSearch");
export const SEARCH_TOOL_ICON: string = icon("search");
export const EDIT_REWRITE_ICON: string = icon("refreshCw");
export const EDIT_UPDATE_ICON: string = icon("edit3");
export const CHECK_ICON: string = icon("checkCircle");
export const ERROR_ICON: string = icon("alertCircle");
export const LOADING_ICON: string = icon("loader");
export const CHEVRON_RIGHT_ICON: string = icon("chevronRight");
export const CHEVRON_DOWN_ICON: string = icon("chevronDown");
export const CODE_ICON: string = icon("code");
export const STOP_ICON: string = icon("circleStop");
