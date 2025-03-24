import { z } from 'zod';

export const ConfigSchema = z.object({
    endpoint: z.string().url(),
    id: z.string().min(1),
    pw: z.string().min(1),
    code: z.string().min(1),
    secret: z.string().min(1),
});
export type ConfigType = z.input<typeof ConfigSchema>;
