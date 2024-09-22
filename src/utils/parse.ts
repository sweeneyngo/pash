
import { z } from 'zod';
// import data from './data.json';
import { Credential, Credentials } from './types';

/* See BitWarden interface: https://bitwarden.com/help/export-your-data/ */
const PasswordHistoryItemSchema = z.object({
    lastUsedDate: z.string(), // Assuming ISO date string
    password: z.string()
});

const UriSchema = z.object({
    match: z.string().nullable(),
    uri: z.string()
});

const LoginSchema = z.object({
    fido2Credentials: z.array(z.any()),
    uris: z.array(UriSchema),
    username: z.string().nullable(),
    password: z.string().nullable(),
    totp: z.string().nullable()
});

const ItemSchema = z.object({
    passwordHistory: z.union([
        z.array(PasswordHistoryItemSchema),
        z.null()
    ]),
    revisionDate: z.string(),
    creationDate: z.string(),
    deletedDate: z.string().nullable(),
    id: z.string(),
    organizationId: z.string().nullable(),
    folderId: z.string().nullable(),
    type: z.number(),
    reprompt: z.number(),
    name: z.string(),
    notes: z.string().nullable(),
    favorite: z.boolean(),
    login: LoginSchema.optional(),
    collectionIds: z.string().nullable()
});

const FolderSchema = z.object({
    id: z.string(),
    name: z.string()
});

const JSONDataSchema = z.object({
    encrypted: z.boolean(),
    folders: z.array(FolderSchema),
    items: z.array(ItemSchema)
});

function validate(data: any) {
    const parsed = JSONDataSchema.safeParse(data);
    if (!parsed.success) {
        console.error("Invalid data format: ", parsed.error);
        throw new Error("Invalid data format");
    }

    return parsed.data;
}

function getData(data: any) {

    let input;
    try {
        input = validate(data);
    } catch (error) {
        throw new Error("Invalid BitWarden data format");
    }

    const result: Credentials = {
        items: []
    };

    input.items.forEach(item => {
        if (!item.login) return; // For Secure Note(s)
        const credential: Credential = {
            id: item.id,
            creationDate: item.creationDate,
            revisionDate: item.revisionDate,
            name: item.name,
            uris: item.login.uris.map(uri => uri.uri),
            username: item.login.username,
            password: item.login.password
        };
        result.items.push(credential);
    })

    return result;
}

export { getData }
