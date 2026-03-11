import{j as t}from"./index-CS7YcJzC.js";function l({label:r,checked:e,onChange:n,description:s}){return t.jsxs("div",{className:"flex items-start gap-3",children:[t.jsx("button",{role:"switch","aria-checked":e,onClick:()=>n(!e),className:`
          relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent
          transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 mt-0.5
          ${e?"bg-blue-600":"bg-slate-300 dark:bg-slate-600"}
        `,children:t.jsx("span",{className:`
            pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow
            transition-transform duration-200
            ${e?"translate-x-4":"translate-x-0"}
          `})}),t.jsxs("div",{children:[t.jsx("div",{className:"text-sm font-medium text-slate-700 dark:text-slate-200",children:r}),s&&t.jsx("div",{className:"text-xs text-slate-400 dark:text-slate-500 mt-0.5",children:s})]})]})}export{l as T};
