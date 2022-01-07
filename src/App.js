import React, { useState } from 'react';
import './App.css';
import Buttons from './Buttons';

export default function App() {
	const initialTimerValue = {
		secounds: 0,
		timerOn: false,
		timerInterval: undefined,
	};

	const initialSessionValue = 25;
	const initialBreakValue = 5;

	const [sessionValue, setSessionValue] = useState(initialSessionValue);
	const [breakValue, setBreakValue] = useState(initialBreakValue);
	const [timerState, setTimerState] = useState(true); // true = session, false = break
	const [timer, setTimer] = useState(initialTimerValue);
	const timerTickRate = 33; // 33ms

	function handleSessionChange(operator) {
		if (!timer.timerOn) {
			if (operator) setSessionValue(sessionValue + 1);
			else if (sessionValue > 1) setSessionValue(sessionValue - 1);
		}
	}

	function handleBreakChange(operator) {
		if (!timer.timerOn) {
			if (operator) {
				if (breakValue < 60) setBreakValue(breakValue + 1);
			} else if (breakValue > 1) setBreakValue(breakValue - 1);
		}
	}

	function sessionBreakSwap(timerInterval, initTimerValue, newTimerState) {
		clearInterval(timerInterval);
		setTimer(initTimerValue);
		setTimerState(!newTimerState);
		// handleStartStop(!newTimerState);
	}

	function handleStartStop(newTimerState = timerState) {
		if (!timer.timerOn) {
			console.log('start');
			const initialIntervalSecounds = timer.secounds;
			const timeStamp = Date.now();
			const timerInterval = setInterval(() => {
				const sec = Math.floor(
					initialIntervalSecounds + (Date.now() - timeStamp) / 1000
				);
				setTimer({
					secounds: sec,
					timerOn: true,
					timerInterval,
				});

				// if session is active and timer run out clear session interval
				if (newTimerState) {
					if (sec >= sessionValue * 60) {
						sessionBreakSwap(timerInterval, initialTimerValue, newTimerState);
						handleStartStop(!newTimerState);
					}
				}

				// if break is active and timer run out clear break interval
				if (!newTimerState) {
					if (sec >= breakValue * 60) {
						sessionBreakSwap(timerInterval, initialTimerValue, newTimerState);
						handleStartStop(!newTimerState);
					}
				}
			}, timerTickRate);
		} else {
			clearInterval(timer.timerInterval);
			setTimer({ ...timer, timerOn: false });
		}
	}

	function handleReset() {
		clearInterval(timer.timerInterval);
		setTimer(initialTimerValue);
		setSessionValue(initialSessionValue);
		setBreakValue(initialBreakValue);
		setTimerState(true);
	}

	function getColor(_timer) {
		const { minutes, secounds } = parseTime(_timer);
		if (minutes === 0 && secounds <= 30) return { color: 'var(--alert-color)' };
		return { color: 'inherit' };
	}

	function parseTime(_timer) {
		const startedMinutesSinceTimerStart = Math.ceil(_timer.secounds / 60);
		const minutesBase = timerState ? sessionValue : breakValue;
		let minutes = minutesBase - startedMinutesSinceTimerStart;
		let secounds = (60 - (_timer.secounds % 60)) % 60;
		return { minutes, secounds };
	}

	function timerDisplay(_timer) {
		let { minutes, secounds } = parseTime(_timer);

		if (minutes < 10) minutes = `0${minutes}`;
		if (secounds < 10) secounds = `0${secounds}`;

		const output = `${minutes}:${secounds}`;
		return output.split('').map((char, i) => (
			<span key={i} className='timer-digit'>
				{char}
			</span>
		));
	}

	return (
		<div className='App'>
			<div id='container'>
				<div id='timer'>
					<p id='timer-label'>{timerState ? 'SESSION' : 'BREAK'}</p>
					<div id='timer-value' style={getColor(timer)}>
						{timerDisplay(timer)}
					</div>
					<div id='controls'>
						<div type='button' className='control' onClick={handleStartStop}>
							{timer.timerOn ? 'stop' : 'start'}
						</div>
						<div className='control' onClick={handleReset}>
							reset
						</div>
					</div>
				</div>

				<div id='session'>
					<p id='session-label'>
						Session Length: {'\u00A0'}
						{sessionValue}
					</p>
					<Buttons handleClick={handleSessionChange} />
				</div>

				<div id='break'>
					<p id='break-label'>
						Break Length: {'\u00A0'}
						{breakValue}
					</p>
					<Buttons handleClick={handleBreakChange} />
				</div>
			</div>
		</div>
	);
}
