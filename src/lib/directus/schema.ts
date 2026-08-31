/** ------------------------------------------------ **/
// TYPES
import { Settings, User } from "@directus/types"
import { UUID } from "crypto"
import { copyFonts, displayFonts } from "@/styles/fonts"

/** ------------------------------------------------ **/
// MAIN SCHEMA
// Nested data needs to be typed in the root schema or else it will not be recognized as a relation
// - https://github.com/directus/directus/issues/23604
// Nested schemas are denoted by the tabbed properties
// We'll have to add `prettier-ignore` here to prevent the tabs from getting cleaned up
// prettier-ignore
export interface DirectusSchema {
	comics: ComicsCollection[]
			authors: DirectusUser[]
	pages: PagesCollection[]
			plot_suggestions: PlotSuggestionsCollection[]
			page_branches: PageBranchesCollection[]
	comic_panels: ComicPanelsCollection[]
			variables: VariablesCollection[]
	comments: CommentsCollection[]
	directus_users: DirectusUser
	// SETTINGS
	settings: SettingsSingleton
			project_authors: DirectusUser[]
			project_thumbnail: ImageCollection
			project_svg_icon: ImageCollection
			project_apple_icon: ImageCollection
			project_pwa_icon: ImageCollection
			frontpage_comic: ComicsCollection
	directus_settings: DirectusSettings
}
/** ------------------------------------------------ **/

export interface ComicsCollection {
	// Details
	title: string
	slug: string
	description: string
	authors: DirectusUser[] | null
	// Content
	variables: JSON | null
	pages: number[] | PagesCollection[]
	// Appearance
	logo: ImageCollection | null
	thumbnail: ImageCollection | null
	banner: ImageCollection | null
	accent_color: string | null
	display_font: typeof displayFonts // fetch from styles/fonts
	copy_font: typeof copyFonts // fetch from styles/fonts
	// Settings
	landing_page: "cover-page" | "first-page" | "last-page" | number
	// Meta
	id: number
	user_created: DirectusUser
	date_created: "datetime"
	user_updated: DirectusUser
	date_updated: "datetime"
}

/** ------------------------------------------------ **/
export interface PagesCollection {
	// Details
	comic: ComicsCollection
	comic_pagenum: number
	status: "published" | "scheduled" | "draft" | "private"
	title: string
	subtitle: string | null
	description: string | null
	thumbnail: ImageCollection | null
	// Content
	comic_panels: ComicPanelsCollection[]
	// Variables Details
	variables_submit_button_text: string | null
	// Feedback
	plot_prompt: string | null
	plot_suggestions: PlotSuggestionsCollection[]
	allow_user_suggestions: boolean
	allow_user_comments: boolean
	user_comments: []
	// Routing
	prev_pages: PageBranchesCollection[]
	next_pages: PageBranchesCollection[]
	// Meta
	id: number
	user_created: DirectusUser
	date_created: "datetime"
	user_updated: DirectusUser
	date_updated: "datetime"
}

export interface PlotSuggestionsCollection {
	title: string
	slug: string
	users_voted: DirectusUser[] | string[]
	votes: number
	// Meta
	id: number
	page: PagesCollection | number
	sort: number
	user_created: DirectusUser
	date_created: "datetime"
	user_updated: DirectusUser
	date_updated: "datetime"
}

export interface PageBranchesCollection {
	// Meta
	id: number
	sort: number
	sort_next: number
	pages_id: PagesCollection
	linked_pages_id: PagesCollection
}

/** ------------------------------------------------ **/
export interface ComicPanelsCollection {
	// Content
	panel_image: ImageCollection
	panel_title: string | null
	panel_description: string | null
	// User Input
	variables: VariablesCollection[]
	place_after_variables_submitted: boolean
	// Meta
	id: number
	page_id: PagesCollection
	user_created: DirectusUser
	date_created: "datetime"
	user_updated: DirectusUser
	date_updated: "datetime"
}

export interface VariablesCollection {
	// Content
	name: string
	slug: string
	default_value: string
	description: string | null
	prompt: string | null
	// Meta
	panel_id: ComicPanelsCollection
}

/** ------------------------------------------------ **/
export interface CommentsCollection {
	content: string
	// Relational
	parent_page: PagesCollection | number | null
	children_comments: CommentsCollection[]
	parent_comment: CommentsCollection | number | null
	// Meta
	id: number
	user_created: DirectusUser
	date_created: "datetime"
	user_updated: DirectusUser
	date_updated: "datetime"
}

/** ------------------------------------------------ **/
export interface DirectusUser extends User {
	id: string
	email: string
	name: string | null
	username: string | null
	homepage_url: string | null
	avatar: ImageCollection
}

/** ------------------------------------------------ **/
export interface DirectusSettings extends Settings {
	public_registration: boolean
}

/** ------------------------------------------------ **/
export interface SettingsSingleton {
	// Meta
	id: UUID
	user_updated: DirectusUser
	date_updated: "datetime"
	date_established: "datetime"
	// Details
	project_name: string | null
	project_url: string | null
	project_description: string | null
	project_thumbnail: ImageCollection | null
	project_authors: DirectusUser[] | null
	frontpage_comic: ComicsCollection | null
	// Icons
	project_svg_icon: ImageCollection | null
	project_apple_icon: ImageCollection | null
	project_pwa_icon: ImageCollection | null
}

/** ------------------------------------------------ **/
export interface ImageCollection {
	id: UUID
	filename_disk: string
	type: string
	width: number
	height: number
	description: string
}
