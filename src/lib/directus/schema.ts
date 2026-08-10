/** ------------------------------------------------ **/
// TYPES
import { User } from "@directus/types"
import { UUID } from "crypto"

/** ------------------------------------------------ **/
// MAIN SCHEMA
// Nested data needs to be typed in the root schema or else it will not be recognized as a relation
// - https://github.com/directus/directus/issues/23604
// Nested schemas are denoted by the tabbed properties
// We'll have to add `prettier-ignore` here to prevent the tabs from getting cleaned up
// prettier-ignore
export interface DirectusSchema {
	comics: ComicsCollection[]
			authors: NestedUsers[]
	pages: PagesCollection[]
	page_branches: PageBranchesCollection[]
	comic_panels: ComicPanelsCollection[]
	comments: CommentsCollection[]
	directus_users: DirectusUser
	// SETTINGS
	settings: SettingsSingleton
			project_authors: NestedUsers[]
			project_thumbnail: NestedImages
			project_svg_icon: NestedImages
			project_apple_icon: NestedImages
			project_pwa_icon: NestedImages
}

export interface ComicsCollection {
	// Details
	title: string
	slug: string
	description: string
	authors: DirectusUser[]
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
	project_name: string | null
	project_url: string | null
	project_description: string | null
	project_thumbnail: NestedImages | null
	project_authors: NestedUsers[] | null
	// Icons
	project_svg_icon: NestedImages | null
	project_apple_icon: NestedImages | null
	project_pwa_icon: NestedImages | null
}

/** ------------------------------------------------ **/
// NESTED COLLECTIONS
export interface NestedUsers {
	name: string | null
	username: string | null
	homepage_url: string | null
}

export interface NestedImages {
	id: UUID
	filename_disk: string
	type: string
	width: number
	height: number
}
