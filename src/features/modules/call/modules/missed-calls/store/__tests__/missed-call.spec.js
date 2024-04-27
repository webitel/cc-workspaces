import missed from '../missed-calls';
import missedAPI from '../../api/missed';
import contextMock
  from '../../../../../../../../tests/unit/mocks/store/contextMock';

describe('missed call store', () => {
  let context = null;

  beforeEach(() => {
    context = contextMock(vi);
  });

  it('LOAD_DATA_LIST calls api method and calls mutations with its result', async () => {
    const items = [1, 2, 3];
    const next = true;
    const mock = vi.spyOn(missedAPI, 'getMissedCalls').mockImplementationOnce(() => Promise.resolve({ items, next }));
    await missed.actions.LOAD_DATA_LIST(context);
    expect(mock).toHaveBeenCalled();
    expect(context.commit).toHaveBeenCalledWith('SET_DATA_LIST', items);
    expect(context.commit).toHaveBeenCalledWith('SET_NEXT', next);
  });

  it('LOAD_NEXT_PAGE calls api method and calls mutations with its result', async () => {
    const items = [1, 2, 3];
    const next = true;
    const page = 23;
    const missedList = [3, 2, 1];
    context.state = { page, missedList };
    const mock = vi.spyOn(missedAPI, 'getMissedCalls').mockImplementationOnce(() => Promise.resolve({ items, next }));
    await missed.actions.LOAD_NEXT_PAGE(context);
    expect(context.commit).toHaveBeenCalledWith('SET_PAGE', page + 1);
    expect(mock).toHaveBeenCalled();
    expect(context.commit).toHaveBeenCalledWith('SET_DATA_LIST', [...missedList, ...items]);
    expect(context.commit).toHaveBeenCalledWith('SET_NEXT', next);
  });

  it('REDIAL calls api method and calls missed reinit', async () => {
    const missd = { id: 1 };
    const mock = vi.spyOn(missedAPI, 'redialToMissed').mockImplementationOnce(() => Promise.resolve());
    await missed.actions.REDIAL(context, missd);
    expect(mock).toHaveBeenCalledWith({ callId: missd.id });
    expect(context.dispatch).toHaveBeenCalledWith('INITIALIZE_MISSED');
  });

  it('HIDE_MISSED calls api method and calls missed reinit', async () => {
    const missd = { id: 1 };
    const mock = vi.spyOn(missedAPI, 'hideMissedCall').mockImplementationOnce(() => Promise.resolve());
    await missed.actions.HIDE_MISSED(context, missd);
    expect(mock).toHaveBeenCalledWith({ callId: missd.id });
    expect(context.dispatch).toHaveBeenCalledWith('INITIALIZE_MISSED');
  });
});
