//const ipcRenderer = require('electron').ipcRenderer
window.addEventListener('DOMContentLoaded', () => {
	const i18n = new (require('../../electron/shared/i18n/i18n'))();

	var html =
		"<div id='date-pick-modal' class='modal-bg'></div>" +
		"<div id='date-time-pick'>" +
		"<div id='date-pick' class='date-pick text-center'>" +
		"<div id='date-pick-body-current' class='date-pick-body'>" +
		"<div id='date-pick-month' class='date-pick-month'>" +
		"<span id='date-pick-prev1' class='date-pick-controls date-pick-prev-month'>" +
		"<i id='date-pick-prev' class='prev'></i>" +
		'</span>' +
		"<span id='date-pick-month-current'></span>" +
		"<span id='date-pick-next3' class='date-pick-controls date-pick-next-month'>" +
		"<i id='date-pick-next' class='next'></i>" +
		'</span>' +
		'</div>' +
		"<div id='date-pick-week-days-current' class='date-pick-week-days'>" +
		"<span class='date-pick-week-day'>" +
		i18n.__('calendar', 'Mo') +
		'</span>' +
		"<span class='date-pick-week-day'>" +
		i18n.__('calendar', 'Tu') +
		'</span>' +
		"<span class='date-pick-week-day'>" +
		i18n.__('calendar', 'We') +
		'</span>' +
		"<span class='date-pick-week-day'>" +
		i18n.__('calendar', 'Th') +
		'</span>' +
		"<span class='date-pick-week-day'>" +
		i18n.__('calendar', 'Fr') +
		'</span>' +
		"<span class='date-pick-week-day'>" +
		i18n.__('calendar', 'Sa') +
		'</span>' +
		"<span class='date-pick-week-day'>" +
		i18n.__('calendar', 'Su') +
		'</span>' +
		'</div>' +
		"<div id='date-pick-days-current' class='date-pick-days'></div>" +
		'</div>' +
		'</div>' +
		"<div class='time-picker' data-time='00:00'>" +
		"<div class='hour'>" +
		"<input id='numeric' type='number' class='hr' value='0' min='0' max='23' oninput='window.format(this)'/>" +
		'</div>' +
		"<div class='separator'>:</div>" +
		"<div class='minute'>" +
		"<input type='number' class='min' value='0' min='0' max='59' oninput='window.format(this)' />" +
		'</div>' +
		'</div>' +
		'</div>';

	window.format = (input) => {
		/*         if(input.value.length === 1) {
          input.value = "0" + input.value
        } */
	};

	document.getElementById('date-pick-container').innerHTML = html;

	const hr_element = document.querySelector('.time-picker .hour .hr');
	const min_element = document.querySelector('.time-picker .minute .min');
	hr_element.addEventListener('change', hour_change);
	min_element.addEventListener('change', minute_change);

	document
		.getElementById('date-pick-prev1')
		.addEventListener('click', function () {
			_makeCalender('prev');
		});
	document
		.getElementById('date-pick-next3')
		.addEventListener('click', function () {
			_makeCalender('next');
		});

	var months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	var globalYear, globalMonth, globalDay;

	var monthVariable = new Date().getMonth();
	var yearVariable = new Date().getFullYear();
	var date = new Date();
	var oldDate = 0;

	window._clearCalendar = () => (oldDate = 0);

	window._makeCalender = function (status, newDate) {
		if (oldDate === newDate) return;

		var newSpan; // for creating a new span node
		var newContent; // for creating new day of month to go into span node
		var datePickBody = document.getElementById('date-pick-days-current');

		if (status === 'prev') {
			while (datePickBody.firstChild) {
				// removes all span nodes from datePickBody element
				datePickBody.removeChild(datePickBody.firstChild);
			}
			monthVariable -= 1; // decreases the month variable by 1 month
		} else if (status === 'next') {
			while (datePickBody.firstChild) {
				// removes all span nodes from datePickBody element
				datePickBody.removeChild(datePickBody.firstChild);
			}
			monthVariable += 1; // increases the month variable by 1 month
		} else if (status === 'set') {
			while (datePickBody.firstChild) {
				// removes all span nodes from datePickBody element
				datePickBody.removeChild(datePickBody.firstChild);
			}

			date.setTime(newDate);

			if (!isValidDate(date)) {
				date = new Date();
			}

			if (oldDate === 0) {
				monthVariable = date.getMonth();
				yearVariable = date.getFullYear();
			}
		} else {
			monthVariable = date.getMonth(); // sets monthVariable to current month by default
		} // if

		oldDate = newDate;

		var selectedYear = (globalYear = date.getFullYear());
		var selectedMonth = (globalMonth = date.getMonth());
		var selectedDay = date.getDate(); // for highlighting current date

		var d = new Date(yearVariable, monthVariable); // creates year and date based on the status of monthVariable
		var year = (globalYear = d.getFullYear());
		var month = (globalMonth = d.getMonth());

		let currentDate = new Date();
		let currentDay = currentDate.getDate();
		let currentMonth = currentDate.getMonth();
		let currentYear = currentDate.getFullYear();

		var dayOfWeek = (d.getDay() || 7) - 1;
		var numOfDaysInMonth = daysInMonth(year, month);
		var extraBoxes = 42 - numOfDaysInMonth;
		var extraBoxesRight = extraBoxes - dayOfWeek;
		var extraBoxesLeft = extraBoxes - extraBoxesRight;

		var datePickMonthCurrent = document.getElementById(
			'date-pick-month-current',
		);
		datePickMonthCurrent.innerHTML =
			i18n.__('calendar', months[month]) + ' ' + year; // outputs date month and year on page

		for (var i = 1; i <= extraBoxesLeft; i++) {
			newSpan = document.createElement('span');
			newSpan.className = 'date-pick-day date-pick-extra-box';

			newContent = document.createTextNode('.');
			newSpan.appendChild(newContent);

			datePickBody.appendChild(newSpan);
		} // for

		for (var j = 1; j <= numOfDaysInMonth; j++) {
			newSpan = document.createElement('span');
			//newSpan.className = "date-pick-day date-pick-selectatble"
			newSpan.setAttribute('data-day', j);

			//if (j < currentDay && month <= currentMonth && year <= currentYear) {
			if (year < currentYear) {
				//&& month <= currentMonth && j < currentDay) {
				newSpan.className = 'date-pick-day date-pick-unselectable';
			} else if (year === currentYear && month < currentMonth) {
				newSpan.className = 'date-pick-day date-pick-unselectable';
			} else if (
				year === currentYear &&
				month === currentMonth &&
				j < currentDay
			) {
				newSpan.className = 'date-pick-day date-pick-unselectable';
			} else {
				newSpan.className = 'date-pick-day date-pick-selectatble';
			}

			if (
				j === selectedDay &&
				month === selectedMonth &&
				year === selectedYear
			) {
				newSpan.className += ' date-pick-selected-day';
			} // if

			newContent = document.createTextNode(j);
			newSpan.appendChild(newContent);

			datePickBody.appendChild(newSpan);
		} // for

		if (extraBoxesRight >= 0) {
			for (var k = 1; k <= extraBoxesRight; k++) {
				newSpan = document.createElement('span');
				newSpan.className = 'date-pick-day date-pick-extra-box';

				newContent = document.createTextNode('.');
				newSpan.appendChild(newContent);

				datePickBody.appendChild(newSpan);
			} // for
		} // if

		var datePickSelectatble = document.getElementsByClassName(
			'date-pick-selectatble',
		);
		for (var i = 0; i < datePickSelectatble.length; i++) {
			// adds changeSelectedDay event listener to each day
			datePickSelectatble[i].onclick = changeSelectedDay;
		}

		hr_element.value = date.getHours();
		min_element.value = date.getMinutes();
	};

	function changeSelectedDay() {
		datePickSelectedDay = document.getElementsByClassName(
			'date-pick-selected-day',
		);
		if (datePickSelectedDay[0] !== undefined) {
			datePickSelectedDay[0].classList.remove('date-pick-selected-day');
			datePickSelectedDay = document.getElementsByClassName(
				'date-pick-selected-day',
			);
		}
		clickedElement = event.target;
		clickedElement.classList.add('date-pick-selected-day');

		globalDay = clickedElement.getAttribute('data-day');
		globalDay = parseInt(globalDay);
		date.setFullYear(globalYear, globalMonth, globalDay);
		_sendSelectedDate();
	}

	function hour_change(e) {
		if (e.target.value > 23) {
			e.target.value = 23;
		} else if (e.target.value < 0) {
			e.target.value = '0';
		}
		if (e.target.value == '') {
			e.target.value = '0';
		}
		date.setHours(parseInt(e.target.value));
		_sendSelectedDate();
	}

	function minute_change(e) {
		if (e.target.value > 59) {
			e.target.value = 59;
		} else if (e.target.value < 0) {
			e.target.value = '0';
		}
		if (e.target.value == '') {
			e.target.value = '0';
		}
		date.setMinutes(parseInt(e.target.value));
		_sendSelectedDate();
	}

	function _sendSelectedDate() {
		let timestemp = date.valueOf();
		ipcRenderer.send('set-processing-property', {
			prop: 'nextDistributeAt',
			value: timestemp,
		});
	}

	// month is 0-based but days are 1-based. Asking for day 0 and adding 1 to the current month gives you number of days in the month
	function daysInMonth(year, month) {
		return new Date(year, month + 1, 0).getDate();
	}

	function isValidDate(d) {
		return d instanceof Date && !isNaN(d);
	}
});
