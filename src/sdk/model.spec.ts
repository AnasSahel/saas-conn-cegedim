import { AuthenticationSchema, WebserviceParamsReadDossierSalarieSchema } from './model';

describe('AuthenticationSchema unit tests', () => {
    it('should validate the AuthenticationSchema', () => {
        const validData = {
            id: '123',
            pw: 'password',
            code: 'code123',
            secret: 'mysecret',
        };
        const result = AuthenticationSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should fail to validate the AuthenticationSchema', () => {
        const invalidData = {
            id: '',
            pw: 'password',
            code: 'code123',
        };

        const result = AuthenticationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
    });

    it('should validate the AuthenticationSchema with default values', () => {
        const validData = {
            id: '123',
            pw: 'password',
            code: 'code123',
            secret: 'mysecret',
        };
        const result = AuthenticationSchema.safeParse(validData);
        expect(result.success).toBe(true);
        const data = result.data!;
        expect(data.idtype).toBe('teams');
        expect(data.skipsso).toBe(true);
    });
});

describe('WebserviceParamsReadDossierSalarieSchema unit tests', () => {
    it('should validate readDossierSalarieWsParams with popu', () => {
        const ddeb = new Date();
        const dfin = new Date();
        dfin.setDate(ddeb.getDate() + 1);
        const validData = {
            popu: 'popu',
            ddeb,
            dfin,
        };
        const result = WebserviceParamsReadDossierSalarieSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should validate readDossierSalarieWsParams with nom', () => {
        const ddeb = new Date();
        const dfin = new Date();
        dfin.setDate(ddeb.getDate() + 1);
        const validData = {
            nom: 'nom',
            ddeb,
            dfin,
        };
        const result = WebserviceParamsReadDossierSalarieSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should validate readDossierSalarieWsParams with prenom', () => {
        const ddeb = new Date();
        const dfin = new Date();
        dfin.setDate(ddeb.getDate() + 1);
        const validData = {
            prenom: 'prenom',
            ddeb,
            dfin,
        };
        const result = WebserviceParamsReadDossierSalarieSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should validate readDossierSalarieWsParams with localid', () => {
        const ddeb = new Date();
        const dfin = new Date();
        dfin.setDate(ddeb.getDate() + 1);
        const validData = {
            localid: 'localid',
            ddeb,
            dfin,
        };
        const result = WebserviceParamsReadDossierSalarieSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should validate readDossierSalarieWsParams with numnat', () => {
        const ddeb = new Date();
        const dfin = new Date();
        dfin.setDate(ddeb.getDate() + 1);
        const validData = {
            numnat: 'numnat',
            ddeb,
            dfin,
        };
        const result = WebserviceParamsReadDossierSalarieSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should fail to validate readDossierSalarieWsParams without popu, nom, prenom, localid, numnat', () => {
        const ddeb = new Date();
        const dfin = new Date();
        dfin.setDate(ddeb.getDate() + 1);
        const invalidData = {
            ddeb,
            dfin,
        };
        const result = WebserviceParamsReadDossierSalarieSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
    });

    it('should fail to validate readDossierSalarieWsParams with ddeb after dfin', () => {
        const ddeb = new Date();
        const dfin = new Date();
        ddeb.setDate(dfin.getDate() + 1);
        const invalidData = {
            ddeb,
            dfin,
            nom: 'nom',
        };
        const result = WebserviceParamsReadDossierSalarieSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
    });

    it('should concatenate wsc_infocomp', () => {
        const ddeb = new Date();
        const dfin = new Date();
        dfin.setDate(ddeb.getDate() + 1);
        const validData = {
            nom: 'nom',
            ddeb,
            dfin,
            wsc_infocomp: ['lib', 'mnemo'],
        };
        const result = WebserviceParamsReadDossierSalarieSchema.safeParse(validData);
        expect(result.success).toBe(true);
        const data = result.data!;
        expect(data.wsc_infocomp).toStrictEqual('lib,mnemo');
    });

    it('should validate with default values', () => {
        const ddeb = new Date();
        const dfin = new Date();
        dfin.setDate(ddeb.getDate() + 1);
        const validData = {
            nom: 'nom',
            ddeb,
            dfin,
        };
        const result = WebserviceParamsReadDossierSalarieSchema.safeParse(validData);
        expect(result.success).toBe(true);
        const data = result.data!;
        expect(data.headerrows).toBe(false);
        expect(data.wsc_infocomp).toStrictEqual('auto');

        expect(data.script).toBe('$wsc_readDossierSalarie');
        expect(data.wscConf).toBe('wsc_readDossierSalarie');
    });
    it('should validate with custom values', () => {
        const ddeb = new Date();
        const dfin = new Date();
        dfin.setDate(ddeb.getDate() + 1);
        const validData = {
            nom: 'customNom',
            ddeb,
            dfin,
            headerrows: true,
            wsc_infocomp: ['lib'],
        };
        const result = WebserviceParamsReadDossierSalarieSchema.safeParse(validData);
        expect(result.success).toBe(true);
        const data = result.data!;
        expect(data.headerrows).toBe(true);
        expect(data.wsc_infocomp).toStrictEqual('lib');
    });
});
