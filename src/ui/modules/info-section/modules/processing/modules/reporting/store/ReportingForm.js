import { toNaiveUtcTimestamp } from '../../../script/naiveUtcTimestamp';

export default class ReportingForm {
  // Sent props - props, sent to task reporting
  success = true;
  description = '';
  nextDistributeAt = Date.now() + 60 * 60 * 1000; // in hour from now

  // Logical props - control reporting generating
  isScheduleCall = true;

  generateReporting() {
    const reporting = {
      success: this.success,
      description: this.description,
    };
    if (this.isScheduleCall) {
      reporting.nextDistributeAt = toNaiveUtcTimestamp(this.nextDistributeAt);
    }

    return reporting;
  }
}
