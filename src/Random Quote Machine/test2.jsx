import { createRoot } from "react-dom/client";

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"><h1>test2</h1></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render()
root.render("test2 hello");
