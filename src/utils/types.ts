export interface Credentials {
    items: Credential[];
}

export interface Credential {
    id: string;
    creationDate: string;
    revisionDate: string;
    name: string;
    uris: string[];
    username: string | null;
    password: string | null;
}
