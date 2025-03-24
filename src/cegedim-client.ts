import { ConnectorError } from '@sailpoint/connector-sdk';
import { ConfigSchema } from './model/config';
import { EmployeeListType } from './model/employee';
import { createCegedimSdk } from './sdk';

const LIMIT_LOOP = 1000;

export function createCegedimClient(config: unknown) {
    const parsedConfig = ConfigSchema.safeParse(config);
    if (!parsedConfig.success) {
        throw new ConnectorError(`saas-conn-cegedim - Invalid config: ${parsedConfig.error.message}`);
    }
    const { endpoint, id, pw, code, secret } = parsedConfig.data;

    const sdk = createCegedimSdk(endpoint, { id, code, secret, pw });
    return {
        testConnection: async () => {
            const ddeb = new Date();
            const dfin = new Date();
            ddeb.setFullYear(ddeb.getFullYear() - 1);
            const response = await sdk.readDossierSalarie({
                popu: '$all',
                ddeb,
                dfin,
                maxctr: 2,
                cursplit: 1,
            });

            if (response.response.popu.length > 0) {
                return {};
            }
            throw new ConnectorError('saas-conn-cegedim - Failed to connect to Cegedim');
        },

        getAllAccounts: async (): Promise<EmployeeListType> => {
            let page = 1;
            const pageSize = 100;
            let fullPopu: EmployeeListType = [];

            const ddeb = '1900-01-01';
            const dfin = new Date();
            dfin.setFullYear(dfin.getFullYear() + 1);

            while (page < LIMIT_LOOP) {
                const response = await sdk.readDossierSalarie({
                    popu: '$all',
                    ddeb,
                    dfin,
                    maxctr: pageSize,
                    cursplit: page,
                });

                const { popu } = response.response;

                fullPopu = fullPopu.concat(popu);

                if (popu.length < pageSize) {
                    break;
                }

                page++;
            }

            return fullPopu;
        },
    };
}
