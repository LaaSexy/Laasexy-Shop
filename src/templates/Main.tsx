import { ReactNode } from 'react';

import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="min-h-screen w-full text-gray-700 antialiased">
    {props.meta}

    <div className="mx-auto max-w-screen-lg">
      {/* For globle menu */}
      <div className="content  text-xl">{props.children}</div>
      <div className="border-t border-gray-300 py-8 text-center text-sm">
        © 2025 {AppConfig.title}.<br /> Powered with{' '}
        <span role="img" aria-label="Love">
          ♥
        </span>{' '}
        by <a href="https://laasexy.github.io/LaaSexy-Portfolio/">Laasexy</a>
      </div>
    </div>
  </div>
);

export { Main };
