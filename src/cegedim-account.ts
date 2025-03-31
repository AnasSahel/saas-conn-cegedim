// import { z } from 'zod';

// // Helper function to transform string to Date
// const stringToDate = () => z.string().transform((val) => new Date(val));

// // Generic schema for a string or an object with a 'val' property
// const valuedString = () =>
//     z
//         .union([
//             z.string(),
//             z.object({
//                 val: z.string(),
//                 lib: z.string().default(''),
//                 auto: z.string().default(''),
//                 mnemo: z.string().default(''),
//             }),
//         ])
//         .transform((val) => {
//             if (typeof val === 'string') {
//                 return { val, lib: '', auto: '', mnemo: '' };
//             }
//             return val;
//         });

// // Schema for Employee
// const employeeSchema = z.object({
//     's1ide.mmat': z.number(),
//     's1ide.nom1': valuedString(),
//     's1ide.prenom1': valuedString(),
//     aggregated: z.array(
//         z.object({
//             's1hier1.ismanager': z.boolean(),
//             's1hier1.hmat': z.union([z.number(), z.object({ val: z.number() })]).transform((val) => {
//                 if (typeof val === 'number') {
//                     return val;
//                 }
//                 return val.val || null;
//             }),
//             's1refid.office_email': z.string().email(),
//             effdate: stringToDate(),
//         })
//     ),
// });

// // Schema for Contract
// const contractSchema = z.object({
//     's2eta.meta': valuedString().optional(),
//     's1contrat.msoc': valuedString().optional(),
//     's2typecontr.typcontrat': valuedString().optional(),
//     's2typecontr.contratpartic': valuedString().optional(),
//     's2analyt.axe11': valuedString().optional(),
//     's2emploi.cemploi': valuedString().optional(),
//     's2societaire.annee': z.number().optional(),
//     's1contrat.ddeb': stringToDate(),
//     's1contrat.dfin': stringToDate().optional(),
//     's2orggta.morg': z.string().optional(),
//     's2orggta.morgpath': z.string().optional(),
//     effdate: stringToDate(),
// });

// // Schema for the main Cegedim Account
// const cegedimAccountSchema = z.object({
//     mmat: z.number(),
//     employee: employeeSchema,
//     contracts: z.object({
//         aggregated: z.array(contractSchema),
//     }),
// });

// export const cegedimReadDossierSalarieResponseSchema = z.object({
//     popu: z.array(cegedimAccountSchema),
// });

// /**
//  * Sorts an array of objects by their effective date in ascending order.
//  * @param a - The first object to compare.
//  * @param b - The second object to compare.
//  * @returns A number indicating the sort order.
//  */
// export function sortByEffDate<T extends { effdate: Date }>(a: T, b: T): number {
//     return a.effdate.getTime() - b.effdate.getTime();
// }

// /**
//  * Filters an array of objects to include only those with an effective date before today.
//  * @param data - The object to check.
//  * @returns True if the effective date is before today, false otherwise.
//  */
// export function filterByEffDateBeforeToday<T extends { effdate: Date }>(data: T): boolean {
//     return data.effdate <= new Date();
// }

// /**
//  * Filters an array of objects to include only those with an effective date after today.
//  * @param data - The object to check.
//  * @returns True if the effective date is after today, false otherwise.
//  */
// export function filterByEffDateAfterToday<T extends { effdate: Date }>(data: T): boolean {
//     return data.effdate > new Date();
// }

// /**
//  * Get the most recent employee and contract data (before today).
//  * @param items - Array of items to filter and sort.
//  * @returns The most recent item before today or undefined.
//  */
// export function getMostRecentBeforeToday<T extends { effdate: Date }>(items: T[]): T | undefined {
//     return items.filter(filterByEffDateBeforeToday).sort(sortByEffDate).reverse()[0] || {};
// }

// /**
//  * Get the most recent employee and contract data (after today).
//  * @param items - Array of items to filter and sort.
//  * @returns The most recent item after today or undefined.
//  */
// export function getMostRecentAfterToday<T extends { effdate: Date }>(items: T[]): T | undefined {
//     return items.filter(filterByEffDateAfterToday).sort(sortByEffDate).reverse()[0] || {};
// }

// /**
//  * Parses the Cegedim response and extracts employee and contract details based on the specified period.
//  * @param data - The raw data to parse.
//  * @param period - The period to filter data ('current' or 'next').
//  * @returns An object containing parsed employee and contract details.
//  */
// export function fromCegedimResponse(data: unknown, period: 'current' | 'next' = 'current') {
//     let employeeDetails;
//     let contractDetails;

//     const parsedData = cegedimAccountSchema.parse(data);

//     if (period === 'next') {
//         employeeDetails = getMostRecentAfterToday(parsedData.employee.aggregated);
//         contractDetails = getMostRecentAfterToday(parsedData.contracts.aggregated);
//     } else {
//         employeeDetails = getMostRecentBeforeToday(parsedData.employee.aggregated);
//         contractDetails = getMostRecentBeforeToday(parsedData.contracts.aggregated);
//     }

//     return {
//         mmat: parsedData.mmat,

//         s1ide_mmat: parsedData.employee['s1ide.mmat'],
//         s1ide_nom1: parsedData.employee['s1ide.nom1'].val,
//         s1ide_prenom1: parsedData.employee['s1ide.prenom1'].val,

//         // Employee details
//         s1hier1_ismanager: employeeDetails?.['s1hier1.ismanager'] || false,
//         s1hier1_hmat: employeeDetails?.['s1hier1.hmat'] || null,
//         s1refid_office_email: employeeDetails?.['s1refid.office_email'] || '',
//         employee_effdate: employeeDetails?.effdate.toString() || '',

//         // Contract details
//         s2eta_meta_val: contractDetails?.['s2eta.meta']?.val || '',
//         s2eta_meta_lib: contractDetails?.['s2eta.meta']?.lib || '',
//         s2eta_meta_auto: contractDetails?.['s2eta.meta']?.auto || '',
//         s2eta_meta_mnemo: contractDetails?.['s2eta.meta']?.mnemo || '',

//         s1contrat_msoc_val: contractDetails?.['s1contrat.msoc']?.val || '',
//         s1contrat_msoc_lib: contractDetails?.['s1contrat.msoc']?.lib || '',
//         s1contrat_msoc_auto: contractDetails?.['s1contrat.msoc']?.auto || '',
//         s1contrat_msoc_mnemo: contractDetails?.['s1contrat.msoc']?.mnemo || '',

//         s2typecontr_typcontrat_val: contractDetails?.['s2typecontr.typcontrat']?.val || '',
//         s2typecontr_typcontrat_lib: contractDetails?.['s2typecontr.typcontrat']?.lib || '',
//         s2typecontr_typcontrat_auto: contractDetails?.['s2typecontr.typcontrat']?.auto || '',
//         s2typecontr_typcontrat_mnemo: contractDetails?.['s2typecontr.typcontrat']?.mnemo || '',

//         s2typecontr_contratpartic_val: contractDetails?.['s2typecontr.contratpartic']?.val || '',
//         s2typecontr_contratpartic_lib: contractDetails?.['s2typecontr.contratpartic']?.lib || '',
//         s2typecontr_contratpartic_auto: contractDetails?.['s2typecontr.contratpartic']?.auto || '',
//         s2typecontr_contratpartic_mnemo: contractDetails?.['s2typecontr.contratpartic']?.mnemo || '',

//         s2analyt_axe11_val: contractDetails?.['s2analyt.axe11']?.val || '',
//         s2analyt_axe11_lib: contractDetails?.['s2analyt.axe11']?.lib || '',
//         s2analyt_axe11_auto: contractDetails?.['s2analyt.axe11']?.auto || '',
//         s2analyt_axe11_mnemo: contractDetails?.['s2analyt.axe11']?.mnemo || '',

//         s2emploi_cemploi_val: contractDetails?.['s2emploi.cemploi']?.val || '',
//         s2emploi_cemploi_lib: contractDetails?.['s2emploi.cemploi']?.lib || '',
//         s2emploi_cemploi_auto: contractDetails?.['s2emploi.cemploi']?.auto || '',
//         s2emploi_cemploi_mnemo: contractDetails?.['s2emploi.cemploi']?.mnemo || '',

//         s2societaire_annee: contractDetails?.['s2societaire.annee'] || null,

//         s1contrat_ddeb: contractDetails?.['s1contrat.ddeb'].toString() || '',
//         s1contrat_dfin: contractDetails?.['s1contrat.dfin']?.toString() || '',

//         s2orggta_morg: contractDetails?.['s2orggta.morg'] || '',

//         s2orggta_morgpath: contractDetails?.['s2orggta.morgpath'] || '',

//         contract_effdate: contractDetails?.effdate.toString() || '',
//     };
// }
