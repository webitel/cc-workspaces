function toNaiveUtc(timestamp) {
  const date = new Date(timestamp);
  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );
}
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

    const ts = this.nextDistributeAt;
    console.log(new Date(ts).toISOString()); // UTC
    console.log(new Date(ts).toString());

    console.log('Before', this.nextDistributeAt)

    if (this.isScheduleCall) {
      reporting.nextDistributeAt = toNaiveUtc(this.nextDistributeAt);

      console.log('After', reporting.nextDistributeAt)
    }

    return reporting;
  }
}
