type ArrowDirection = 'up-right' | 'down' | 'up';

const arrowPaths: Record<ArrowDirection, string> = {
  'up-right': 'M6 18 18 6M6 6h12v12',
  down: 'M12 4v16M5 13l7 7 7-7',
  up: 'M12 20V4M5 11l7-7 7 7',
};

export function Arrow({ direction = 'up-right' }: { direction?: ArrowDirection }) {
  return <svg className="ui-icon icon-arrow" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={arrowPaths[direction]}/></svg>;
}

export function MenuIcon({ open }: { open: boolean }) {
  return <svg className="ui-icon icon-menu" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d={open ? 'M6 6l12 12M6 18 18 6' : 'M4 6h16M4 12h16M4 18h16'}/></svg>;
}

export function CloseIcon() {
  return <MenuIcon open/>;
}
