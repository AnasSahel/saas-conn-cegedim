import { z } from 'zod';

/**
 * @typedef {Object} AuthenticationType
 * @property {string} id
 * @property {string} pw
 * @property {string} code
 * @property {string} secret
 * @property {string} [idtype=teams]
 * @property {boolean} [skipsso=true]
 * @property {string} script
 * @property {string} wscConf
 */
export const AuthenticationSchema = z.object({
    id: z.string({ message: 'Account id must be a string' }).min(1, { message: 'Account id is required' }),
    pw: z.string({ message: 'Password must be a string' }).min(1, { message: 'Password is required' }),
    code: z.string({ message: 'Code must be a string' }).min(1, { message: 'Code is required' }),
    secret: z.string({ message: 'Secret must be a string' }).min(1, { message: 'Secret is required' }),
    idtype: z.enum(['teams']).default('teams'),
    skipsso: z.boolean().default(true),
});

export type AuthenticationType = z.input<typeof AuthenticationSchema>;

/**
 * @typedef {Object} ReadDossierSalarieWsParamsType
 * @property {string|number|number[][]} [popu]
 * @property {Date} ddeb
 * @property {Date} dfin
 * @property {number} [maxctr]
 * @property {number} [cursplit]
 * @property {boolean} [headerrows=false]
 * @property {('auto'|'lib'|'mnemo'|'info')[]} [wsc_infocomp=['auto']]
 * @property {string} [nom]
 * @property {string} [prenom]
 * @property {string} [localid]
 * @property {string} [numnat]
 */
export const WebserviceParamsReadDossierSalarieSchema = z
    .object({
        popu: z.union([z.string(), z.array(z.number()), z.array(z.array(z.number()))]).optional(),
        ddeb: z
            .union([z.coerce.date().transform((data) => data.toISOString().split('T')[0]), z.string()])
            .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
        dfin: z
            .union([z.coerce.date().transform((data) => data.toISOString().split('T')[0]), z.string()])
            .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
        maxctr: z.number().optional(),
        cursplit: z.number().optional(),
        headerrows: z.boolean().optional().default(false),
        wsc_infocomp: z
            .array(z.enum(['auto', 'lib', 'mnemo', 'info']))
            .optional()
            .default(['auto'])
            .transform((data) => data.join(',')),
        nom: z.string().optional(),
        prenom: z.string().optional(),
        localid: z.string().optional(),
        numnat: z.string().optional(),
    })
    .refine((data) => data.ddeb < data.dfin, {
        message: 'ddeb must be before dfin',
    })
    .refine(
        (data) =>
            !(
                data.popu === undefined &&
                data.nom === undefined &&
                data.prenom === undefined &&
                data.localid === undefined &&
                data.numnat === undefined
            ),
        {
            message: 'At least one of popu, nom, prenom, localid, numnat must be provided',
        }
    )
    .transform((data) => ({ script: '$wsc_readDossierSalarie', wscConf: 'wsc_readDossierSalarie', ...data }));

export type WebserviceParamsReadDossierSalarieType = z.input<typeof WebserviceParamsReadDossierSalarieSchema>;

const commonSchemas = {
    shortDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    autoValSchemaGenerator: (schema: z.ZodType<any, any>) => {
        return z.union([
            schema,
            z.object({
                val: schema,
                auto: z.string().min(1).optional(),
                lib: z.string().optional(),
                mnemo: z.string().optional(),
            }),
        ]);
    },
};

export const EmployeeSchema = z.object({
    mmat: z.number(),
    employee: z.object({
        's1ide.mmat': z.number(),
        's1ide.nom1': commonSchemas.autoValSchemaGenerator(z.string().min(1)),
        's1ide.prenom1': z.string().min(1),
        agregated: z
            .array(
                z.object({
                    's1hier1.ismanager': z.boolean().default(false),
                    's1hier1.hmat': commonSchemas.autoValSchemaGenerator(z.number()).optional(),
                    's1refid.office_email': z.string().optional(),
                    effdate: commonSchemas.shortDate,
                })
            )
            .optional(),
    }),
    contracts: z.object({
        agregated: z.array(
            z.object({
                's2eta.meta': commonSchemas.autoValSchemaGenerator(z.string()).optional(),
                's1contrat.ddeb': commonSchemas.shortDate,
                's1contrat.dfin': commonSchemas.shortDate.optional(),
                's1contrat.msoc': commonSchemas.autoValSchemaGenerator(z.string()),
                's2typecontr.contratpartic': commonSchemas.autoValSchemaGenerator(z.string()).optional(),
                's2typecontr.typcontrat': commonSchemas.autoValSchemaGenerator(z.string()).optional(),
                's2societaire.annee': z.number().optional(),
                's2analyt.axe11': commonSchemas.autoValSchemaGenerator(z.string()).optional(),
                's2emploi.cemploi': commonSchemas.autoValSchemaGenerator(z.string()).optional(),
                's2orggta.morg': commonSchemas.autoValSchemaGenerator(z.string()).optional(),
                's2orggta.morgpath': commonSchemas.autoValSchemaGenerator(z.string()).optional(),
                effdate: commonSchemas.shortDate,
            })
        ),
    }),
});

export const CegedimWebserviceReadDossierSalarieResponseSchema = z.object({
    response: z.object({
        popu: z.array(EmployeeSchema),
        header: z.record(z.string(), z.string()).optional(),
        params: z.record(z.string(), z.unknown()),
        nbcol: z.number().optional(),
        nbinfos: z.number().optional(),
        facturable: z.boolean().optional(),
    }),
});
export type CegedimWebserviceReadDossierSalarieResponseType = z.infer<
    typeof CegedimWebserviceReadDossierSalarieResponseSchema
>;
