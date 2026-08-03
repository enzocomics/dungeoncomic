/** ------------------------------------------------ **/
// TYPES
import { User } from "@directus/types"
import { UUID } from "crypto"

/** ------------------------------------------------ **/
// MAIN SCHEMA
// Nested data needs to be typed in the root schema or else it will not be recognized as a relation
// - https://github.com/directus/directus/issues/23604
// prettier-ignore
export interface DirectusSchema {
	comics: ComicsCollection[]
	pages: PagesCollection[]
	page_branches: PageBranchesCollection[]
	comic_panels: ComicPanelsCollection[]
	comments: CommentsCollection[]
	directus_users: DirectusUser
	// SETTINGS
	settings: SettingsSingleton
			project_authors: SettingsNestedAuthors[]
			project_thumbnail: NestedImage
}

export interface ComicsCollection {
	// Details
	title: string
	slug: string
	description: string
	// Content
	pages: number[] | PagesCollection[]
	// Meta
	id: number
	user_created: UUID
	date_created: "datetime"
	user_updated: UUID
	date_updated: "datetime"
}

export interface PagesCollection {
	// Details
	comic: number | ComicsCollection
	comic_pagenum: number
	title: string | null
	// Content
	comic_panels: number[] | ComicPanelsCollection[]
	// Routing
	prev_pages: number[] | PagesCollection[]
	next_pages: number[] | PagesCollection[]
	// Meta
	id: number
	user_created: UUID
	date_created: "datetime"
	user_updated: UUID
	date_updated: "datetime"
}

export interface PageBranchesCollection {
	// Content
	branch_title: string | null
	branch_description: string | null
	// Meta
	id: number
	pages_id: number
	linked_pages_id: number
}

export interface ComicPanelsCollection {
	// Content
	panel_image: UUID
	panel_title: string | null
	panel_description: string | null
	// Meta
	id: number
	user_created: UUID
	date_created: "datetime"
	user_updated: UUID
	date_updated: "datetime"
}

export interface CommentsCollection {
	// Meta
	id: number
	user_created: UUID
	date_created: "datetime"
	user_updated: UUID
	date_updated: "datetime"
}

export interface DirectusUser extends User {
	name: string | null
	username: string | null
	homepage_url: string | null
}

/** ------------------------------------------------ **/
// SETTINGS - SINGLETON
export interface SettingsSingleton {
	// Meta
	id: UUID
	user_updated: UUID
	date_updated: "datetime"
	date_established: "datetime"
	// Details
	project_title: string | null
	project_url: string | null
	project_description: string | null
	project_thumbnail: NestedImage | null
	project_authors: SettingsNestedAuthors[] | null
	// Icons
	project_favicon: UUID | null
	project_svg_icon: UUID | null
	project_apple_icon: UUID | null
	project_pwa_icon: UUID | null
}

export interface SettingsNestedAuthors {
	name: string | null
	username: string | null
	homepage_url: string | null
}

export interface NestedImage {
	id: UUID
	filename_disk: string
	type: string
	width: number
	height: number
}
