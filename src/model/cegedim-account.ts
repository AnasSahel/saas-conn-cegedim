import {
    SimpleKey,
    StdAccountCreateOutput,
    StdAccountListOutput,
    StdAccountReadOutput,
} from '@sailpoint/connector-sdk';
import { z } from 'zod';

const cegedimAccountSchema = z.object({
    mmat: z.number(),
    employee: z.object({
        's1ide.mmat': z.number(),
        's1ide.nom1': z.string().or(z.object({ val: z.string() }).transform((val) => val.val)),
        's1ide.prenom1': z.string(),
        agregated: z
            .array(
                z.object({
                    's1hier1.ismanager': z.boolean().default(false),
                    's1hier1.hmat': z
                        .number()
                        .or(z.object({ val: z.number() }).transform((val) => val.val))
                        .optional(),
                    's1refid.office_email': z.string().default(''),
                    effdate: z.string(),
                })
            )
            .optional(),
    }),
    contracts: z.object({
        agregated: z.array(
            z.object({
                's2eta.meta': z
                    .object({ val: z.string(), auto: z.string() })
                    .or(z.string().transform((val) => ({ val, auto: '' })))
                    .optional(),
                's1contrat.ddeb': z.string(),
                's1contrat.msoc': z
                    .object({ val: z.string(), auto: z.string() })
                    .or(z.string().transform((val) => ({ val, auto: '' })))
                    .optional(),
                's2typecontr.contratpartic': z
                    .object({
                        val: z.string(),
                        auto: z.string().default(''),
                        mnemo: z.string().default(''),
                        info: z.string().default(''),
                    })
                    .or(z.string().transform((val) => ({ val, auto: '', mnemo: '', info: '' })))
                    .optional(),
                's2typecontr.typcontrat': z
                    .object({ val: z.string(), auto: z.string().default(''), mnemo: z.string().default('') })
                    .or(z.string().transform((val) => ({ val, auto: '', mnemo: '' })))
                    .optional(),
                's2societaire.annee': z.number().optional(),
                's2analyt.axe11': z
                    .object({
                        val: z.string(),
                        lib: z.string().default(''),
                        mnemo: z.string().default(''),
                        info: z.string().default(''),
                    })
                    .or(z.string().transform((val) => ({ val, lib: '', mnemo: '', info: '' })))
                    .optional(),
                's2emploi.cemploi': z
                    .object({
                        val: z.string(),
                        lib: z.string().default(''),
                        mnemo: z.string().default(''),
                        info: z.string().default(''),
                    })
                    .or(z.string().transform((val) => ({ val, lib: '', mnemo: '', info: '' })))
                    .optional(),
                's2orggta.morg': z.string().optional(),
                's2orggta.morgpath': z.string().optional(),
                's1contrat.dfin': z.string().optional(),
                effdate: z.string(),
            })
        ),
    }),
});

export function toSailPointObject(
    data: unknown
): StdAccountListOutput | StdAccountCreateOutput | StdAccountReadOutput | StdAccountListOutput {
    const parsedAccount = cegedimAccountSchema.parse(data);

    const employeeDetails =
        parsedAccount.employee.agregated
            ?.filter((item) => new Date(item.effdate) <= new Date())
            .sort((a, b) => new Date(a.effdate).getTime() - new Date(b.effdate).getTime())
            .reverse()[0] || null;
    const contractDetails =
        parsedAccount.contracts?.agregated
            ?.filter((item) => new Date(item.effdate) <= new Date())
            .sort((a, b) => new Date(a.effdate).getTime() - new Date(b.effdate).getTime())
            .reverse()[0] || null;

    return {
        key: SimpleKey(parsedAccount.mmat.toString()),
        identity: parsedAccount.mmat.toString(),
        attributes: {
            mmat: parsedAccount.mmat,

            s1ide_mmat: parsedAccount.employee['s1ide.mmat'].toString(),
            s1ide_nom1: parsedAccount.employee['s1ide.nom1'],
            s1ide_prenom1: parsedAccount.employee['s1ide.prenom1'],

            s1hier1_ismanager: employeeDetails?.['s1hier1.ismanager'] ?? false,
            s1hier1_hmat: employeeDetails?.['s1hier1.hmat']?.toString() ?? '',
            s1refid_office_email: employeeDetails?.['s1refid.office_email'] ?? '',
            employee_effdate: employeeDetails?.effdate ?? '',

            s2eta_meta_val: contractDetails?.['s2eta.meta']?.val ?? '',
            s2eta_meta_auto: contractDetails?.['s2eta.meta']?.auto ?? '',

            s1contrat_msoc_val: contractDetails?.['s1contrat.msoc']?.val ?? '',
            s1contrat_msoc_auto: contractDetails?.['s1contrat.msoc']?.auto ?? '',

            s2typecontr_contratpartic_val: contractDetails?.['s2typecontr.contratpartic']?.val ?? '',
            s2typecontr_contratpartic_auto: contractDetails?.['s2typecontr.contratpartic']?.auto ?? '',
            s2typecontr_contratpartic_mnemo: contractDetails?.['s2typecontr.contratpartic']?.mnemo ?? '',
            s2typecontr_contratpartic_info: contractDetails?.['s2typecontr.contratpartic']?.info ?? '',

            s2typecontr_typcontrat_val: contractDetails?.['s2typecontr.typcontrat']?.val ?? '',
            s2typecontr_typcontrat_auto: contractDetails?.['s2typecontr.typcontrat']?.auto ?? '',
            s2typecontr_typcontrat_mnemo: contractDetails?.['s2typecontr.typcontrat']?.mnemo ?? '',

            s2societaire_annee: contractDetails?.['s2societaire.annee'] ?? null,

            s2analyt_axe11_val: contractDetails?.['s2analyt.axe11']?.val ?? '',
            s2analyt_axe11_lib: contractDetails?.['s2analyt.axe11']?.lib ?? '',
            s2analyt_axe11_mnemo: contractDetails?.['s2analyt.axe11']?.mnemo ?? '',
            s2analyt_axe11_info: contractDetails?.['s2analyt.axe11']?.info ?? '',

            s2emploi_cemploi_val: contractDetails?.['s2emploi.cemploi']?.val ?? '',
            s2emploi_cemploi_lib: contractDetails?.['s2emploi.cemploi']?.lib ?? '',
            s2emploi_cemploi_mnemo: contractDetails?.['s2emploi.cemploi']?.mnemo ?? '',
            s2emploi_cemploi_info: contractDetails?.['s2emploi.cemploi']?.info ?? '',

            s1contrat_ddeb: contractDetails?.['s1contrat.ddeb'] ?? '',
            s1contrat_dfin: contractDetails?.['s1contrat.dfin'] ?? '',
            s2orggta_morg: contractDetails?.['s2orggta.morg'] ?? '',
            s2orggta_morgpath: contractDetails?.['s2orggta.morgpath'] ?? '',

            contract_effdate: contractDetails?.effdate ?? '',
        },
    };
}
