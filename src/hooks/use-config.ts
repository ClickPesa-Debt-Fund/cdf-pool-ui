import { useEffect } from "react";

export const useConfig = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [window.location.pathname]);

  useEffect(() => {
    if (process.env.VITE_NODE_ENV === "production") {
      // const script = document.createElement("script");
      // script.innerHTML = `
      //     (function (h, o, t, j, a, r) {
      //       h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) }
      //       h._hjSettings = { hjid: 3586364, hjsv: 6 }
      //       a = o.getElementsByTagName('head')[0]
      //       r = o.createElement('script'); r.async = 1
      //       r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
      //       a.appendChild(r)
      //     })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
      //     `;
      // document.body.appendChild(script);
    }
  }, []);
};
