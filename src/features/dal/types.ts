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
  avatar_id: string | null | undefined
  avatar_url: string | null | undefined
  avatar_alt: string | null | undefined
}
type SessionResponse =
  | { isAuth: true; user: ProfileDTO }
  | { isAuth: false; user: null }

export type { User, ProfileDTO, SessionResponse }
