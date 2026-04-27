class Timer {
	constructor(idSec, idMin) {
		this.totalSeconds = 0;
		this.timer = null;
		this.secLabel = document.getElementById(idSec);
		this.minLabel = document.getElementById(idMin);
	}

	clearTimer() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
			return true;
		}
		return false;
	}

	setTime() {
		this.secLabel.innerHTML = this.pad(this.totalSeconds % 60);
		this.minLabel.innerHTML = this.pad(parseInt(this.totalSeconds / 60));
	}

	pad(val) {
		const valString = val + '';
		if (valString.length < 2) {
			return '0' + valString;
		} else {
			return valString;
		}
	}

	_tick() {
		++this.totalSeconds;
		this.setTime();
	}

	_start() {
		this.clearTimer();
		this.timer = setInterval(this._tick.bind(this), 1000);
	}

	stop() {
		this.clearTimer();
	}

	reset() {
		this.stop();
		this.totalSeconds = 0;
		this.secLabel.innerHTML = '00';
		this.minLabel.innerHTML = '00';
	}

	startWithDate(answeredAt) {
		this.totalSeconds = parseInt((Date.now() - answeredAt) / 1000);
		this._start();
	}

	startWithDuration(duration) {
		if (duration < 0) duration = 0;
		this.totalSeconds = duration;
		this._start();
	}
}

module.exports = Timer;
