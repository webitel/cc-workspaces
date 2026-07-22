import { formattingFormBeforeSend } from '../../../../ui/modules/info-section/modules/processing/script/formattingFormBeforeSend.js';

export const AUTOSAVE_BEFORE_TIMEOUT_MS = 1000;

export const autosaveProcessingForms = ({ tasks, now, saved }) => {
	const aliveAttempts = new Set();

	tasks.forEach((task) => {
		const attempt = task?.attempt;
		if (!attempt?.form) return;

		aliveAttempts.add(attempt.id);

		if (!attempt._processing?.autosave) return;

		const timeoutAt = attempt.processingTimeoutAt;
		if (!timeoutAt || timeoutAt - now > AUTOSAVE_BEFORE_TIMEOUT_MS) return;

		if (saved.get(attempt.id) === timeoutAt) return;
		saved.set(attempt.id, timeoutAt);

		const fields =
			attempt.form.fields || formattingFormBeforeSend(attempt.form.body); // in form.fields we already have formatted form if task is call
		attempt.saveForm(null, fields);

		saved.forEach((timeoutAt, attemptId) => {
			if (!aliveAttempts.has(attemptId)) saved.delete(attemptId);
		});
	});
};
