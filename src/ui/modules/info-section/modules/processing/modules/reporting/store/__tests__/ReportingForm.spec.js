import ReportingForm from '../ReportingForm';

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
    reporting = new ReportingForm(task);
  });

  it('generateReporting() correctly generates simple reporting', () => {
    reporting.isScheduleCall = false;
    const form = { success: true, description: '' };
    Object.assign(reporting, form);
    const reportingResult = reporting.generateReporting();
    expect(reportingResult).toEqual(form);
  });

  it(`if isScheduleCall state variable is true, generateReporting() includes
   nextDistributeAt value in result`, () => {
    const nextDistributeAt = Date.now();

    reporting.nextDistributeAt = nextDistributeAt;

    const finalReporting = {
      success: true,
      description: '',
      nextDistributeAt,
    };
    Object.assign(reporting, finalReporting);
    const result = reporting.generateReporting();
    expect(result).toEqual(finalReporting);
  });
});
