export default class Reporting {
  // Sent props - props, sent to task reporting
  success = true;
  description = '';
  nextDistributeAt = Date.now() + 60 * 60 * 1000; // in hour from now
  communications = [];
  nextCommunication = null;

  // Logical props - control reporting generating
  isScheduleCall = true;

  // UI props - used only for ui purposes
  isNewCommunication = false;
  editedCommunication = null;

  constructor(task) {
    this._task = task;
    /*
    * Object.assign(this, progress || {});
    * restore saved progress at init after f5.
    * Progress may be passed, but = null.
    * NOW POST PROCESS DATA ISN'T PERSISTENT SO IT DOESN'T HAVE ANY SENSE
    */
    this._loadCommunications();
  }

  startCommunicationAdding() {
    this.isNewCommunication = true;
  }

  startCommunicationEditing(communication) {
    this.editedCommunication = communication;
  }

  addCommunication(communication) {
    this.communications.push(communication);
  }

  editCommunication(communication) {
    const editedCommIndex = this.communications.findIndex((comm) => comm.id === communication.id);
    this.communications.splice(editedCommIndex, 1, communication);
  }

  deleteCommunication(communication) {
    this.communications.splice(this.communications.indexOf(communication), 1);
    if (this.nextCommunication === communication) this.selectNextCommunication(this.communications[0]);
  }

  selectNextCommunication(communication) {
    this.nextCommunication = communication;
  }

  send() {
    const reporting = this._generateReporting();
    this._task.reporting(reporting);
  }

  _generateReporting() {
    const reporting = {
      success: this.success,
      description: this.description,
    };
    if (this._task.isMember) {
      reporting.communications = this.communications;
      reporting.nextCommunication = this.nextCommunication;
    }
    if (this.isScheduleCall) {
      reporting.nextDistributeAt = this.nextDistributeAt;
    }

    return reporting;
  }

  async _loadCommunications() {
    if (this._task.isMember) {
      const member = await this._task.getMember({ fields: ['communications'] });
      if (member.communications) this.communications = member.communications;
    }
  }
}
