class ProcessingTimer {
	constructor() {
		document.getElementById('timer').innerHTML = `
            <div class="base-timer">
            <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g class="base-timer__circle">
                <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                <path
                    id="base-timer-path-remaining"
                    stroke-dasharray="283"
                    class="base-timer__path-remaining ${this.remainingPathColor}"
                    d="
                    M 50, 50
                    m -45, 0
                    a 45,45 0 1,0 90,0
                    a 45,45 0 1,0 -90,0
                    "
                ></path>
                </g>
            </svg>
            <span id="baseTimerLabel" style='visibility: hidden;' class="base-timer__label">${this.timeLeft}</span>
            <input id="resetTimeBtn" class="reset-time-btn" type="image" style='visibility: hidden; contain: content; margin-bottom: 48px; border: none; outline: none;
                'src='../../../img/icon-plus-md.svg' name='resetBtn' alt="reset"/>
            </div>
        `;
	}

	FULL_DASH_ARRAY = 283;

	colorCodes = {
		info: {
			color: 'green',
		},
		warning: {
			color: 'orange',
			threshold: 0,
		},
		alert: {
			color: 'red',
			threshold: 0,
		},
	};

	timeLimit = 0;
	timePassed = 0;
	timerInterval = null;
	timeLeft = this.timeLimit;
	showRenewalButton = false;
	remainingPathColor = this.colorCodes.info.color;

	updateProgress(arg) {
		this.timeLeft = Math.floor((arg.processingTimeoutAt - arg.now) / 1000);
		this.timeLimit = Math.ceil(
			(arg.processingTimeoutAt - arg.startProcessingAt) / 1000,
		);
		this.timePassed = this.timeLimit - this.timeLeft;

		this.showRenewalButton = this.timeLeft <= arg.renewalSec;
		this.colorCodes.warning.threshold = this.timeLimit / 2;
		this.colorCodes.alert.threshold = this.timeLimit / 4;

		if (!this.timerInterval && this.timeLeft !== 0) {
			this.autoReload();
		}
		this._showTimer();
	}

	_showTimer() {
		document.getElementById('baseTimerLabel').innerHTML = this.timeLeft;
		this._setRemainingPathColor(this.timeLeft);
		this._showRenewalButton();
		if (this.timeLeft < 0) {
			this.clearTimeaut();
		}
	}

	_showRenewalButton() {
		if (this.showRenewalButton) {
			document.getElementById('baseTimerLabel').style.visibility = 'hidden';
			document.getElementById('resetTimeBtn').style.visibility = 'visible';
			document.getElementById('resetTimeBtn').onclick = this.resetTime;
		} else {
			document.getElementById('baseTimerLabel').style.visibility = 'visible';
			document.getElementById('resetTimeBtn').style.visibility = 'hidden';
		}
	}

	resetTime() {
		ipcRenderer.send('reset-timer');
	}

	_setRemainingPathColor(timeLeft) {
		const { alert, warning, info } = this.colorCodes;
		if (timeLeft <= alert.threshold) {
			document.getElementById('base-timer-path-remaining').classList.remove(
				...[
					info.color,
					warning.color,
				],
			);
			document
				.getElementById('base-timer-path-remaining')
				.classList.add(alert.color);
		} else if (timeLeft <= warning.threshold) {
			document.getElementById('base-timer-path-remaining').classList.remove(
				...[
					alert.color,
					info.color,
				],
			);
			document
				.getElementById('base-timer-path-remaining')
				.classList.add(warning.color);
		} else {
			document.getElementById('base-timer-path-remaining').classList.remove(
				...[
					alert.color,
					warning.color,
				],
			);
			document
				.getElementById('base-timer-path-remaining')
				.classList.add(info.color);
		}
	}
	autoReload() {
		this.timerInterval = setInterval(() => {
			this._setCircleDasharray();
		}, 1000);
	}

	clearTimeaut() {
		if (this.timerInterval) {
			clearTimeout(this.timerInterval);
			this.timerInterval = null;
		}
		this.timeLeft = this.timeLimit;
		document
			.getElementById('base-timer-path-remaining')
			.setAttribute('stroke-dasharray', '283');
	}

	_calculateTimeFraction() {
		const rawTimeFraction = this.timeLeft / this.timeLimit;
		return rawTimeFraction - (1 / this.timeLimit) * (1 - rawTimeFraction);
	}

	_setCircleDasharray() {
		const circleDasharray = `${(
			this._calculateTimeFraction() * this.FULL_DASH_ARRAY
		).toFixed(0)} 283`;
		document
			.getElementById('base-timer-path-remaining')
			.setAttribute('stroke-dasharray', circleDasharray);
	}
}

module.exports = ProcessingTimer;
