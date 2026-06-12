const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID?.trim();

let clarityInitialized = false;

export function initializeClarity() {
  if (!CLARITY_PROJECT_ID || clarityInitialized || typeof window === "undefined") {
    return;
  }

  clarityInitialized = true;

  window.clarity =
    window.clarity ||
    function clarityQueue() {
      window.clarity.q = window.clarity.q || [];
      window.clarity.q.push(arguments);
    };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;

  const firstScript = document.getElementsByTagName("script")[0];
  firstScript.parentNode.insertBefore(script, firstScript);
}
