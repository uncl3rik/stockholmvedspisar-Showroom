const fs = require('fs');
fs.mkdirSync('public/images/inserts', { recursive: true });
for (const [slug,w,h,d] of [['liggande',735,530,365],['staende',480,550,350]]) {
 const s=.45, width=w*s, height=h*s, dx=d*s*.45, dy=-d*s*.28;
 const x=(600-width-dx)/2, y=325-height, b=325;
 const front=`${x},${y} ${x+width},${y} ${x+width},${b} ${x},${b}`;
 const top=`${x},${y} ${x+dx},${y+dy} ${x+width+dx},${y+dy} ${x+width},${y}`;
 const side=`${x+width},${y} ${x+width+dx},${y+dy} ${x+width+dx},${b+dy} ${x+width},${b}`;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" role="img" aria-label="${slug === 'liggande' ? 'Liggande' : 'Stående'} insats, ${w} × ${h} × ${d} millimeter">
 <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#dedbd1" stroke-width=".5"/></pattern><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7L7 0" stroke="#b4b7ac" stroke-width=".65"/></pattern></defs>
 <path fill="#f2f0e8" d="M0 0h600v420H0z"/><path fill="url(#grid)" d="M25 25h550v370H25z"/>
 <g fill="none" stroke="#b6bbb1" stroke-width=".7" stroke-dasharray="5 5"><path d="M${x-25} ${b}H${x+width+dx+25}M${x} ${y-25}V${b+35}M${x+width} ${y-25}V${b+35}"/></g>
 <g stroke="#3b4b46" stroke-width="1.6" stroke-linejoin="round"><polygon points="${top}" fill="#e6e8de"/><polygon points="${side}" fill="url(#hatch)"/><polygon points="${front}" fill="#f2f0e8"/><rect x="${x+width*.075}" y="${y+height*.14}" width="${width*.85}" height="${height*.72}" fill="#dce2d9"/><path d="M${x+width*.1} ${y+height*.2}h${width*.65}M${x+width*.1} ${y+height*.23}h${width*.44}" stroke="#a2ada3" stroke-width=".8"/><path d="M${x+width*.93} ${y+height*.42}v${height*.16}" stroke-width="3"/></g>
 <g fill="none" stroke="#9b694e" stroke-width="1"><path d="M${x} 349v20m0-10h${width}m0-10v20M${x-28} ${y}h-20m10 0v${height}m-10 0h20"/><path d="M${x+width+12} ${b+13}l${dx} ${dy}m-4-4l8 8M${x+width+8} ${b+9}l8 8"/></g>
 <g font-family="monospace" font-size="13" fill="#745741"><text x="${x+width/2}" y="379" text-anchor="middle">${w}</text><text transform="translate(${x-47} ${y+height/2}) rotate(-90)" text-anchor="middle">${h}</text><text x="${x+width+dx*.6+20}" y="${b+dy*.5+27}" text-anchor="middle">${d}</text></g>
 <g font-family="monospace" font-size="9" letter-spacing="1.5" fill="#66756a"><text x="30" y="40">FORMSTUDIE / ${slug === 'liggande' ? '01' : '02'}</text><text x="570" y="400" text-anchor="end">YTTERMÅTT I MM · PRINCIPSKISS</text></g></svg>`;
 fs.writeFileSync(`public/images/inserts/${slug}.svg`,svg);
}
