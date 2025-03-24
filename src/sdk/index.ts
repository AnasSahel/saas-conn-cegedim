import { createHash } from 'node:crypto';
import { z } from 'zod';
import {
    AuthenticationSchema,
    AuthenticationType,
    CegedimWebserviceReadDossierSalarieResponseSchema,
    CegedimWebserviceReadDossierSalarieResponseType,
    WebserviceParamsReadDossierSalarieSchema,
    WebserviceParamsReadDossierSalarieType,
} from './model';
import { generateSalt, generateUtcNow } from './utils';

/**
 * Creates a Cegedim SDK instance.
 *
 * @param endpoint The endpoint URL.
 * @param auth The authentication information.
 * @returns A Cegedim SDK instance.
 */
export function createCegedimSdk(endpoint: string, auth: AuthenticationType) {
    const parsedAuth = AuthenticationSchema.safeParse(auth);
    if (!parsedAuth.success) {
        throw new Error(parsedAuth.error.errors[0].message);
    }
    const { id, pw, code, secret, idtype, skipsso } = parsedAuth.data;

    const generatePrivatetoken = () => {
        const salt = generateSalt();
        const utcNow = generateUtcNow();
        const hash = createHash('sha256').update(`${salt}${secret}${utcNow}`).digest('hex');

        return `${code}${salt}${hash}`;
    };

    const runRequest = async (schema: z.ZodSchema, params: unknown): Promise<unknown> => {
        const parsedParams = schema.safeParse(params);
        if (!parsedParams.success) {
            throw new Error(parsedParams.error.errors[0].message);
        }
        const privatetoken = generatePrivatetoken();
        const context = { id, pw, idtype, skipsso, privatetoken, ...parsedParams.data };

        const contextString = JSON.stringify(context);

        const response = await fetch(`${endpoint}?ctx=${contextString}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const text = await response.text();

        return JSON.parse(text.substring(1, text.length - 1));
    };

    return {
        readDossierSalarie: async (
            params: WebserviceParamsReadDossierSalarieType
        ): Promise<CegedimWebserviceReadDossierSalarieResponseType> => {
            const response = await runRequest(WebserviceParamsReadDossierSalarieSchema, params);
            const parsedResponse = CegedimWebserviceReadDossierSalarieResponseSchema.safeParse(response);
            if (!parsedResponse.success) {
                throw new Error(`Failed to parse response: ${parsedResponse.error.message}`);
            }
            return parsedResponse.data!;
        },
    };
}
