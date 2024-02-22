import axiosMock from '@webitel/ui-sdk/src/tests/mocks/axiosMock';

describe('missedAPI', () => {

  it('hideMissedCall sends request with passed callId and hide_missed: true param', async () => {
    const request = vi.fn(() => Promise.resolve({ data: {} }));
    vi.doMock('axios', axiosMock( { default: { request } }));

    const callId = '123';

    const missedAPI = (await import ('../missed.js')).default;

    await missedAPI.hideMissedCall({ callId });

    expect(JSON.parse(request.mock.lastCall[0].data)).toEqual({
      id: callId,
      hide_missed: true,
    });
  });
});
