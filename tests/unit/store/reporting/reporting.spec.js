import Reporting from '../../../../src/store/modules/post-processing/Reporting';

const comm = { id: '123' };
const member = { communications: [comm] };

describe('Reporting class', () => {
  let task;
  let reporting;

  beforeEach(() => {
    task = {
      id: '1',
      reporting: jest.fn(),
      getMember: jest.fn(() => member),
    };
    reporting = new Reporting(task);
  });

  it('send() calls task\'s reporting() method', () => {
    reporting.isScheduleCall = false;
    const finalReporting = { success: true, description: '' };
    reporting.send();
    expect(task.reporting).toHaveBeenCalledWith(finalReporting);
  });

  it(`if task.isMember is true, send() calls task's reporting() method
   with communications values`, () => {
    task.isMember = true;

    reporting.isScheduleCall = false;
    reporting.communications = [comm];
    reporting.nextCommunication = comm;

    const finalReporting = {
      success: true,
      description: '',
      communications: [comm],
      nextCommunication: comm,
    };
    reporting.send();
    expect(task.reporting).toHaveBeenCalledWith(finalReporting);
  });

  it(`if isScheduleCall state variable is true, send() calls task's reporting() method
   with nextDistributeAt value`, () => {
    const nextDistributeAt = Date.now();

    reporting.nextDistributeAt = nextDistributeAt;

    const finalReporting = {
      success: true,
      description: '',
      nextDistributeAt,
    };
    reporting.send();
    expect(task.reporting).toHaveBeenCalledWith(finalReporting);
  });

  it('_loadCommunications() calls task\'s getMember() method', async () => {
    task.isMember = true;
    await reporting._loadCommunications();
    expect(task.getMember).toHaveBeenCalled();
  });

  it('_loadCommunications() saves received communications', async () => {
    task.isMember = true;
    await reporting._loadCommunications();
    expect(reporting.communications).toEqual([comm]);
  });

  it('startCommunicationAdding() sets isNewCommunication to "true"', () => {
    expect(reporting.isNewCommunication).toBe(false);
    reporting.startCommunicationAdding();
    expect(reporting.isNewCommunication).toBe(true);
  });

  it('startCommunicationEditing() sets passed communication to editedCommunication prop', () => {
    expect(reporting.editedCommunication).toBe(null);
    reporting.startCommunicationEditing(comm);
    expect(reporting.editedCommunication).toEqual(comm);
  });

  it('addCommunication() adds passed value to communications[]', () => {
    reporting.communications = [];
    reporting.addCommunication(comm);
    expect(reporting.communications.includes(comm)).toBe(true);
  });

  it('editCommunication() replaces comm in communications[] with passed value by id', () => {
    reporting.communications = [comm];
    const editedComm = { id: comm.id };
    reporting.editCommunication(editedComm);
    expect(reporting.communications.includes(editedComm)).toBe(true);
    expect(reporting.communications.includes(comm)).toBe(false);
  });

  it('deleteCommunication() deletes received communication from communications[]', () => {
    reporting.communications = [comm];
    reporting.deleteCommunication(comm);
    expect(reporting.communications.length).toBe(0);
  });
});
