// https://stackoverflow.com/a/57920600
const isOnPWA = () => {
	return (
		window.matchMedia('(display-mode: standalone)').matches ||
		window.matchMedia('(display-mode: minimal-ui)').matches ||
		// author @Lera24
		// full screen mode
		('standalone' in navigator && navigator.standalone === true)
	);
};

export default isOnPWA;
