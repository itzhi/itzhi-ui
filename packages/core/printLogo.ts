export default function () {
	if (PROD) {
		const logo = `
------------------------------------------------
 ____  ____  ____  _   _  ____     __  __  ____ 
(_  _)(_  _)(_   )( )_( )(_  _)___(  )(  )(_  _)
 _)(_   )(   / /_  ) _ (  _)(_(___))(__)(  _)(_ 
(____) (__) (____)(_) (_)(____)   (______)(____)
------------------------------------------------
			author: itzhi
`
	const rainbowGradient	= `
background: linear-gradient(135deg, orange 60%, cyan);
background-clip: text;
color: transparent;
font-size: 16px;
line-height: 1;
font-family: monospace;
font-weight: 600;
	`
		console.info(`%c${logo}`, rainbowGradient)
	} else if (DEV) {
		console.log('[itzhi-ui]: dev mode...')
	}
}
