/** ------------------------------------------------ **/
// TYPES
import { User } from "@directus/types"
import { UUID } from "crypto"

/** ------------------------------------------------ **/
// MAIN SCHEMA
export interface DirectusSchema {
	comics: ComicsCollection[]
	pages: PagesCollection[]
	page_branches: PageBranchesCollection[]
	comic_panels: ComicPanelsCollection[]
	comments: CommentsCollection[]
	directus_users: DirectusUser
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
	username: string
}
