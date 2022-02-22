import { render } from 'react-dom';

import App from 'views/App.js';

import './style.css';

window.addEventListener('DOMContentLoaded', () => {
    render(<App />, document.getElementById('app'));
});