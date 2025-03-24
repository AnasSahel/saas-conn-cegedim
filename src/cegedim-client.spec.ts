// import { ConnectorError, StandardCommand } from '@sailpoint/connector-sdk'
// import { MyClient } from './my-client'

import 'dotenv/config';
import 'isomorphic-fetch';
import { createCegedimClient } from './cegedim-client';

const mockConfig: unknown = {
    endpoint: process.env.CEGEDIM_ENDPOINT,
    id: process.env.CEGEDIM_ID,
    pw: process.env.CEGEDIM_PW,
    code: process.env.CEGEDIM_CODE,
    secret: process.env.CEGEDIM_SECRET,
};

describe('connector client unit tests', () => {
    const client = createCegedimClient(mockConfig);

    it('connector client should be created', async () => {
        expect(client).toBeTruthy();
    });

    it('connector client test connection', async () => {
        expect(await client.testConnection()).toStrictEqual({});
    }, 120000);

    it('connector client get all accounts', async () => {
        const allAccounts = await client.getAllAccounts();
        expect(allAccounts.length).toBeGreaterThan(0);
    }, 120000);
});
