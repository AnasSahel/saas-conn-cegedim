import { z } from 'zod';

export const configSchema = z.object({
    endpoint: z.string().url(),
    code: z.string().min(1),
    secret: z.string().min(1),
    id: z.string().min(1),
    pw: z.string().min(1),
});
export type ConfigType = z.infer<typeof configSchema>;
