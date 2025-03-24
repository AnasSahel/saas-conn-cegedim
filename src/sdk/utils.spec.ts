import { generateSalt, generateUtcNow } from './utils';

describe('utils unit tests', () => {
    it('should generate an alphanumerical salt of length 4', () => {
        const salt = generateSalt(4);
        expect(salt).toMatch(/^[a-zA-Z0-9]{4}$/);
    });

    it('should generate an alphanumerical salt of length 8', () => {
        const salt = generateSalt(8);
        expect(salt).toMatch(/^[a-zA-Z0-9]{8}$/);
    });

    it('should generate a string utc timestamp', () => {
        const timestamp = generateUtcNow();
        expect(timestamp).toMatch(/^\d{14}$/);
    });
});
