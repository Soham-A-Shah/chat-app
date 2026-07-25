declare module '*.css';
declare module '*.png' {
  const src: string;
  export default src;
}

declare const process: {
  env: {
    REACT_APP_SOCKET_URL?: string;
  };
};

declare module 'react-emoji' {
  const ReactEmoji: {
    emojify: (text: string) => string | JSX.Element | JSX.Element[];
  };

  export default ReactEmoji;
}

declare module 'react-scroll-to-bottom' {
  import { ComponentType, ReactNode } from 'react';

  type ScrollToBottomProps = {
    className?: string;
    children?: ReactNode;
  };

  const ScrollToBottom: ComponentType<ScrollToBottomProps>;
  export default ScrollToBottom;
}
