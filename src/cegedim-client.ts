import { ConnectorError } from '@sailpoint/connector-sdk';
import * as crypto from 'crypto';
import { configSchema, ConfigType } from './model/config';

const SCRIPT_READ_DOSSIER_SALARIE = '$wsc_readDossierSalarie';
const WSC_CONF_READ_DOSSIER_SALARIE = 'wsc_readDossierSalarie';

export class CegedimClient {
    private readonly config: ConfigType;

    constructor(config: unknown) {
        const parsedConfig = configSchema.safeParse(config);
        if (!parsedConfig.success) {
            throw new ConnectorError(`saas-conn-cegedim: config must be valid: ${parsedConfig.error}`);
        }
        this.config = parsedConfig.data;
    }

    private generatePrivatetoken(): string {
        const { secret, code } = this.config;
        const now = new Date();

        const salt = crypto.randomBytes(2).toString('hex'); // generate random 4-character string
        const utcNow = `${now.toISOString().slice(0, 19).replace(/[-:T]/g, '')}`;
        const hash = crypto.createHash('sha256').update(`${salt}${secret}${utcNow}`).digest('hex');

        return `${code}${salt}${hash}`;
    }

    /**
     * Calculates date range for API queries based on configuration settings.
     * @returns {Object} Object with start date (ddeb) and end date (dfin)
     */
    private getDateRange(): { ddeb: Date; dfin: Date } {
        const today = new Date();

        // Create new date objects without using toString()
        const ddeb = new Date(today);
        const dfin = new Date(today);

        // Adjust dates based on config
        ddeb.setMonth(ddeb.getMonth() - this.config.ddebMin);
        dfin.setMonth(dfin.getMonth() + this.config.dfinMax);

        return { ddeb, dfin };
    }

    private async callReadDossierSalarie(
        popu: string,
        range: [string | Date, string | Date],
        maxctr?: number,
        cursplit?: number
    ) {
        const authParams = {
            id: this.config.id,
            pw: this.config.pw,
            idtype: 'teams',
            skipsso: true,
            privatetoken: this.generatePrivatetoken(),
            script: SCRIPT_READ_DOSSIER_SALARIE,
            wscConf: WSC_CONF_READ_DOSSIER_SALARIE,
        };

        const wsParams = {
            popu,
            ddeb: typeof range[0] === 'string' ? range[0] : range[0].toISOString().slice(0, 10),
            dfin: typeof range[1] === 'string' ? range[1] : range[1].toISOString().slice(0, 10),
            wsc_infocomp: 'auto,lib,mnemo,info',
            ...(maxctr !== undefined && { maxctr }),
            ...(cursplit !== undefined && { cursplit }),
        };

        const context = { ...authParams, ...wsParams };

        const response = await fetch(`${this.config.endpoint}?ctx=${JSON.stringify(context)}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new ConnectorError(`saas-conn-cegedim: Request failed with status ${response.status}`);
        }

        const text = await response.text();
        const jsonResponse = JSON.parse(text.substring(1, text.length - 1));

        if (jsonResponse.error) {
            throw new ConnectorError(`saas-conn-cegedim: ${jsonResponse.error.join('\n')}`);
        }

        return jsonResponse.response;
    }

    async getAllAccounts() {
        const accountList = [];
        const { ddeb, dfin } = this.getDateRange();

        let page = 1;

        while (page <= this.config.maxIterations) {
            const response = await this.callReadDossierSalarie('$all', [ddeb, dfin], this.config.pageSize, page);
            const popu = response.popu;

            if (page > 1 && accountList.length > 0) {
                const lastItemPrevious = accountList[accountList.length - 1].mmat;
                const lastItemCurrent = popu[popu.length - 1].mmat;

                if (lastItemPrevious === lastItemCurrent) {
                    break;
                }
            }

            accountList.push(...popu);

            if (popu.length === 0) {
                break;
            }
            page++;
        }

        return accountList;
    }

    async getAccount(identity: string) {
        const { ddeb, dfin } = this.getDateRange();
        const response = await this.callReadDossierSalarie(`[${identity}]`, [ddeb, dfin]);

        if (response && response.length > 0) {
            return response[0];
        } else {
            return null;
        }
    }

    async testConnection(): Promise<{}> {
        await this.callReadDossierSalarie('$all', ['1900-01-01', new Date()], 1, 1);
        return {};
    }
}
