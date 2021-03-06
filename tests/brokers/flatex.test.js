import {parseData, canParseData} from '../../src/brokers/flatex';
import {buySamples, sellSamples, dividendsSamples} from './__mocks__/flatex';
import Big from 'big.js';

describe('Flatex broker', () => {
    let consoleErrorSpy;

    test('should accept Buy, Sell, Div Flatex PDFs only', () => {
        expect(canParseData(['flatex Bank AG', 'Kauf'])).toEqual(true);
        expect(canParseData(['FinTech Group Bank AG', 'Kauf'])).toEqual(true); // old bank name
        expect(canParseData(['flatex Bank AG', 'Verkauf'])).toEqual(true);
        expect(canParseData(['flatex Bank AG', 'Dividendengutschrift'])).toEqual(
            true
        );
    });

    test('should not accept any PDFs', () => {
        expect(canParseData(['42'])).toEqual(false);
    });

    describe('Buy', () => {
        test('should map pdf data of sample 1 correctly', () => {
            const activity = parseData(buySamples[0]);

            expect(activity).toEqual({
                broker: 'flatex',
                type: 'Buy',
                date: '2019-05-16',
                isin: 'US0378331005',
                company: 'APPLE INC.',
                shares: 4,
                price: 170,
                amount: 680,
                fee: +Big(5.9).plus(Big(0.85)),
                tax: 0,
            });
        });

        test('should map pdf data of sample 2 correctly', () => {
            const activity = parseData(buySamples[1]);

            expect(activity).toEqual({
                broker: 'flatex',
                type: 'Buy',
                date: '2020-03-05',
                isin: 'US4642863926',
                company: 'ISHS-ISHARES MSCI WLD ETF',
                shares: 20,
                price: 82.4959,
                amount: 1649.92,
                fee: 5.9,
                tax: 0,
            });
        });

        test('should map pdf data of sample 3 correctly', () => {
            const activity = parseData(buySamples[2]);

            expect(activity).toEqual({
                broker: 'flatex',
                type: 'Buy',
                date: '2019-10-17',
                isin: 'US5949181045',
                company: 'MICROSOFT',
                shares: 12,
                price: 125.5,
                amount: 1506,
                fee: +Big(5.9).plus(Big(0.85)),
                tax: 0,
            });
        });

        test('should map pdf data of sample 5 correctly', () => {
            const activity = parseData(buySamples[4]);

            expect(activity).toEqual({
                broker: 'flatex',
                type: 'Buy',
                date: '2018-04-03',
                isin: 'US88160R1014',
                company: 'TESLA INC.',
                shares: 1,
                price: 207.83,
                amount: 207.83,
                fee: +Big(5.9).plus(Big(0.71)),
                tax: 0,
            });
        });
    });

    describe('Sell', () => {
        test('should map pdf data of sample 1 correctly', () => {
            const activity = parseData(sellSamples[0]);

            expect(activity).toEqual({
                broker: 'flatex',
                type: 'Sell',
                date: '2019-05-20',
                isin: 'US30303M1027',
                company: 'FACEBOOK INC.A',
                shares: 4,
                price: 164.5,
                amount: 658,
                fee: +Big(3.8).plus(Big(0.85)),
                tax: 28.33,
            });
        });

        test('should map pdf data of sample 2 correctly', () => {
            const activity = parseData(sellSamples[1]);

            expect(activity).toEqual({
                broker: 'flatex',
                type: 'Sell',
                date: '2019-05-20',
                isin: 'DE000A1C9KL8',
                company: 'HSBC MSCI WORLD UC.ETF DZ',
                shares: 36,
                price: 18.95,
                amount: 682.2,
                fee: +Big(3.8).plus(Big(0.85)),
                tax: 17.17,
            });
        });
    });

    describe('Dividend', () => {
        test('should map pdf data of sample 1 correctly', () => {
            const activity = parseData(dividendsSamples[0]);

            // stock
            expect(activity).toEqual({
                broker: 'flatex',
                type: 'Dividend',
                date: '2020-02-13',
                isin: 'US0378331005',
                company: 'APPLE INC.',
                shares: 7,
                amount: 4.96,
                price: 4.96 / 7,
                fee: 0,
                tax: +Big(4.96).minus(Big(3.6)), // calculate from Bemessungsgrundlage - Endbetrag#
            });
        });

        test('should map pdf data of sample 2 correctly', () => {
            const activity = parseData(dividendsSamples[1]);

            // stock
            expect(activity).toEqual({
                broker: 'flatex',
                type: 'Dividend',
                date: '2019-12-12',
                isin: 'US5949181045',
                company: 'MICROSOFT',
                shares: 16,
                amount: 6.23, // only available in USD, thus using net dividend in EUR
                price: 6.23 / 16,
                fee: 0,
                tax: 0, // skip bc only available in USD
            });
        });

        test('should map pdf data of sample 3 correctly', () => {
            const activity = parseData(dividendsSamples[2]);

            // index fund
            expect(activity).toEqual({
                broker: 'flatex',
                type: 'Dividend',
                date: '2018-11-09',
                isin: 'DE000A1C9KL8',
                company: 'HSBC MSCI WORLD UC.ETF DZ',
                shares: 36,
                amount: 3.02,
                price: 3.02 / 36,
                fee: 0,
                tax: +Big(3.02).minus(Big(2.18)), // calculate from Bemessungsgrundlage - Endbetrag (note: diff in pdf is wrong by 0,01)
            });
        });
    });

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });
});
