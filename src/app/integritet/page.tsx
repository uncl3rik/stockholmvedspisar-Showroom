import { Intro } from '@/components/showroom';
import { contactEmail } from '@/lib/contact';
export const metadata={title:'Integritet & bildinformation'};
export default function Page(){return <><Intro label="INFORMATION" title="Integritet & bilder." description="Om kontaktuppgifter, sparade designer och produktinnehåll."/><article className="legal shell">
<h2>Kontaktformuläret</h2><p>När du skickar formuläret överförs namn, e-postadress och meddelande via Formspree till oss för att vi ska kunna besvara din förfrågan. Om du väljer att bifoga en design följer dess sammanfattning och länk med. Kontaktuppgifterna sparas inte i webbläsarens utkast.</p><p>Kontakta <a href={'mailto:'+contactEmail}>{contactEmail}</a> om du har frågor om dina uppgifter eller vill be oss radera en förfrågan.</p>
<h2>Sparade designer och länkar</h2><p>Med ”Spara min design” lagras upp till tio utkast lokalt i den webbläsare du använder. De kan försvinna om du rensar webbplatsdata. En nedladdad textfil sparas på din enhet.</p><p>Designens val finns i den delbara länken. Alla som får länken kan öppna designen. Namn, e-postadress och meddelande ingår inte i länken. Ett sparat utkast skickas till oss först när du väljer att bifoga det till en förfrågan.</p>
<h2>Produktbilder och miljöer</h2><p>Kratkis bildmaterial används med tillstånd. Produkt- och miljöbilder kan visa andra utföranden inom samma serie.</p>
<h2>Design och tekniska uppgifter</h2><p>Designverktyget är endast till för inspiration och är inte ett bygg- eller installationsunderlag. Kontrollera alltid mått, säkerhetsavstånd och tillverkarens dokumentation för vald modell inför köp och installation.</p>
</article></>}
