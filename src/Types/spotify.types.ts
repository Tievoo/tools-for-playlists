interface PlaylistBase {
    collaborative: boolean
    description: string
    external_urls: {
        spotify: string
    }
    followers: Followers
    href: string
    id: string
    images: Image[]
    name: string
    owner: UserReference
    primary_color: string
    public: boolean
    snapshot_id: string
    type: string
    uri: string
}

export interface Playlist<Item extends TrackItem = TrackItem> extends PlaylistBase {
    tracks: Page<PlaylistedTrack<Item>>
}

export interface Page<TItemType> {
    href: string
    items: TItemType[]
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
}

export interface Followers {
    href: string | null
    total: number
}

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Track {
    artists: Artist[]
    album: Album
    available_markets: string[]
    external_urls: {
        spotify: string
    }
    disc_number: number
    duration_ms: number
    episode: boolean;
    explicit: boolean
    href: string
    id: string
    is_local: boolean
    name: string
    preview_url: string | null
    track: boolean;
    track_number: number
    type: string
    uri: string
    is_playable?: boolean
}

export interface Album {
    album_type: string
    artists: Artist[]
    available_markets: string[]
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    images: Image[]
    name: string
    release_date: string
    release_date_precision: string
    total_tracks: number
    type: string
    uri: string
}

export interface AddedBy {
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    type: string
    uri: string
}

export interface UserReference extends AddedBy {
    display_name: string
}

export interface Artist {
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    name: string
    type: string
    uri: string
}

export interface Episode {
    audio_preview_url: string
    description: string
    html_description: string
    duration_ms: number
    explicit: boolean
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    images: Image[]
    is_externally_hosted: boolean
    is_playable: boolean
    language: string
    languages: string[]
    name: string
    release_date: string
    release_date_precision: string
    type: string
    uri: string
}

export interface PlaylistedTrack<Item extends TrackItem = TrackItem> {
    added_at: string
    added_by: AddedBy
    is_local: boolean
    primary_color: string
    track: Item
}

export type TrackItem = Track;

export interface SimplifiedPlaylist {
    collaborative: boolean
    description: string
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    images: Image[]
    name: string
    owner: UserReference
    primary_color: string
    public: boolean
    snapshot_id: string
    tracks: {
        href: string
        total: number
    }
    type: string
    uri: string
}

export interface User {
    display_name: string
    external_urls: {
        spotify: string
    }
    followers: Followers
    href: string
    id: string
    images: Image[]
    type: string
    uri: string
    email: string
}