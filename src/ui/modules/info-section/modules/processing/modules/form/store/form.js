import { formattingFormBeforeSend } from '../../../script/formattingFormBeforeSend.js';

const actions = {
	SEND_FORM: (
		context,
		{ action, task = context.rootGetters.TASK_ON_WORKSPACE } = {},
	) => {
		const form =
			task.attempt?.form?.fields ||
			formattingFormBeforeSend(task.attempt?.form?.body); // in form.fields we already have formatted form if task is call
		return task.attempt.formAction(action.id, form);
	},
};

export default {
	namespaced: true,
	actions,
};
