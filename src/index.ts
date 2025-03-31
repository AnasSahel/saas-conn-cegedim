import {
    Context,
    createConnector,
    logger,
    readConfig,
    Response,
    StdAccountListInput,
    StdAccountListOutput,
    StdTestConnectionInput,
    StdTestConnectionOutput,
} from '@sailpoint/connector-sdk';
import { z } from 'zod';
import { CegedimClient } from './cegedim-client';
import { toSailPointObject } from './model/cegedim-account';

// Connector must be exported as module property named connector
export const connector = async () => {
    // Get connector source config
    const config = await readConfig();

    // Use the vendor SDK, or implement own client as necessary, to initialize a client
    const client = new CegedimClient(config);

    return createConnector()
        .stdTestConnection(
            async (context: Context, input: StdTestConnectionInput, res: Response<StdTestConnectionOutput>) => {
                logger.info('saas-conn-cegedim:stdTestConnection: Running test connection');
                res.send(await client.testConnection());
            }
        )
        .stdAccountList(async (context: Context, input: StdAccountListInput, res: Response<StdAccountListOutput>) => {
            logger.info('saas-conn-cegedim:stdAccountList: Running stdAccountList');
            const accounts = await client.getAllAccounts();

            logger.info(`saas-conn-cegedim:stdAccountList: stdAccountList found ${accounts.length} accounts`);

            for (const cegedimAccount of accounts) {
                try {
                    const sailPointAccount = toSailPointObject(cegedimAccount);
                    res.send(sailPointAccount);
                } catch (error) {
                    logger.error(
                        `saas-conn-cegedim:stdAccountList: Error parsing account data: ${error as z.ZodError}.message`
                    );
                    continue;
                }
            }
            logger.info(`saas-conn-cegedim:stdAccountList: stdAccountList sent ${accounts.length} accounts`);
        });
    // .stdAccountRead(async (context: Context, input: StdAccountReadInput, res: Response<StdAccountReadOutput>) => {
    //     const cegedimAccount = await client.getAccount(input.identity);

    //     try {
    //         const account = fromCegedimResponse(cegedimAccount, 'current');
    //         res.send({
    //             key: SimpleKey(account.mmat.toString()),
    //             identity: account.mmat.toString(),
    //             attributes: {
    //                 mmat: account.mmat,
    //                 s1ide_prenom1: account.s1ide_prenom1,
    //                 s1ide_nom1: account.s1ide_nom1,
    //             },
    //         });
    //         logger.info(`saas-conn-cegedim:stdAccountRead: stdAccountRead read account : ${input.identity}`);
    //     } catch (error) {
    //         logger.error(`saas-conn-cegedim:stdAccountRead: Error parsing account data: ${error}`);
    //     }
    // });
};
