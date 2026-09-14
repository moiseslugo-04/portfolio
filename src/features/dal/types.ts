type User = {
  id: string
  name: string
  email: string
  username: string
}

type ProfileDTO = {
  id: string
  name: string
  email: string
  username: string
  bio: string | null
  job_title: string
  avatar_id: string | null | undefined
  avatar_url: string | null | undefined
  avatar_alt: string | null | undefined
  social_links: SocialLink[]
}

type SocialLink = { id: string; platform_name: string; platform_url: string }
type SessionResponse =
  | { isAuth: true; user: ProfileDTO }
  | { isAuth: false; user: null }

export type { User, ProfileDTO, SessionResponse, SocialLink }
