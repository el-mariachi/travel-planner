import { postToBackend } from "../postToBackend";
import { getImage } from "../getImage";

jest.mock('../postToBackend');
const mockAlert = jest.fn();
const mockConsole = jest.fn();
beforeAll(() => {
    global.alert = mockAlert;
    global.console = {
        ...console,
        error: mockConsole
    };
});

const sampleData = {
    url: 'image url',
    submitNo: 1
};

(postToBackend as unknown as jest.Mock).mockImplementation((endpoint, request) => {
    const { name, submitNo } = request;
    if (!name) {
        return Promise.reject('error')
    }
    return Promise.resolve({
        submitNo,
        url: 'image url'
    });
});

describe('Testing getImage functionality', () => {
    it('should pass submitNo around', () => {
        return getImage('London', 'England', 1).then(data => {
            expect(data).toEqual(sampleData);
        });
    });
    it('should throw with no input', () => {
        // @ts-ignore
        return expect(getImage()).rejects.toMatch('error');
    });
});