import React from 'react';
import NavMenu from './NavMenu';

export default function Layout({ children }: {children:React.ReactNode}) {
    return (
      <div className='flex flex-col h-full w-full dark:bg-slate-800 font-Dosis'>
        <NavMenu />
        <div id="shabba" className='flex flex-col flex-1 m-5 max-h-full min-h-0 text-slate-900 dark:text-white'>
          {children}
        </div>
      </div>
    );
}
