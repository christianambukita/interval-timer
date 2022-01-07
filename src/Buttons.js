export default function ({ handleClick }) {
	return (
		<div className='buttons'>
			<p className='symbol' onClick={() => handleClick(true)}>
				+
			</p>
			<div className='vertical-line'></div>
			<p className='symbol' onClick={() => handleClick(false)}>
				-
			</p>
		</div>
	);
}
