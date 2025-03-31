import { z } from 'zod';

export const configSchema = z.object({
    endpoint: z.string().url(),
    code: z.string().min(1),
    secret: z.string().min(1),
    id: z.string().min(1),
    pw: z.string().min(1),

    ddebMin: z.number().default(2),
    dfinMax: z.number().default(1),

    maxIterations: z.number().default(100),
    pageSize: z.number().default(500),
});
export type ConfigType = z.infer<typeof configSchema>;
