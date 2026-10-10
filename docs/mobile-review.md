# Mobilgenomgång · 2026-10-06

## Bedömning

Behåll showroomets mörka grund, ljusa produktbilder och återhållsamma texter. Den viktigaste förbättringen är en kortare väg från inspiration till en konkret modell och ett tydligt materialval. Showroomet kan utveckla rum, video och 3D; kollektionen ska snabbt besvara hur modellen ser ut och vilka utföranden som finns.

## Genomfört

- Produktbild och utförandeval ligger direkt under modellnamnet. På höga mobilskärmar följer en kompakt bild med medan användaren väljer material. På korta skärmar används vanlig scrollning.
- Keramiken visas med produktminiatyrer, brännkammaren med namngivna färgval. En ändring behåller övriga val och visar den registrerade kombinationens riktiga bild.
- 72 bildkopplade kombinationer i 26 utföranden. Saknade kombinationer erbjuds inte; andra modeller visar tydligt märkta referensbilder.
- Förstoring, länk till valt utförande och korrekt modell-/materialkontext i kontaktformuläret.
- Tekniska uppgifter och galleri är utfällbara. Galleri och stor bild monteras först vid öppning.
- Sökning före filter, kompakt horisontell filterrad och två modellkort per rad i mobilen. Inmatningsfält har 16 px text.

## Nästa prioriteringar

1. **Tillbehör:** lägg upp verifierade relationer mellan utföranden och golvskydd, anslutningar och andra tillbehör. Visa dem på kaminen först när det finns rätt kombinationsbilder eller korrekt 3D-underlag. Materialväljaren är klar; visualisering av dessa separata tillbehör ingår ännu inte.
2. **Produktunderlag:** komplettera saknade måttenheter och artikelnummer från distributören. Katalogens snapshot ska inte uppfattas som lagerstatus eller aktuell prislista.
3. **Före lansering:** aktivera verklig kontaktleverans, testa leveransen och uppdatera integritetsinformationen. Formuläret är fortfarande en demo enligt tidigare beslut.
4. **Video och 3D:** börja med ett välgjort pilotutförande och återanvänd konfiguratorns stabila ID:n. Behåll en lätt bildvy och ladda den tyngre visningen när besökaren väljer den. Mät den publicerade sidan på verkliga mobiler innan fler effekter införs.

## Kontroller

Lint, TypeScript via produktionsbygget, katalogkontroll och fyra automatiserade tester av konfigurationslogiken. Alla 72 bildkopplingar kontrollerade i katalogen. ERIKs tolv keramik-/brännkammarkombinationer provade i webbläsaren, samt omladdning med valt utförande, kontaktkontext, bilddialog/Escape och galleri. Mobilbredder 320 och 390 px samt skrivbord 1280 px granskade; inget horisontellt sidöverflöde i de kontrollerade vyerna. KOZA och NB kontrollerade som modeller utan registrerade materialkombinationer. Delad konfigurationslänk verifierad även i produktionsbygget. Ingen verklig enhet eller mätning av produktionssidans laddningstid ingår i denna kontroll.

Referens för flödet: https://www.spisochkamin.se/produkt/kamin-erik-ba1/. Befintliga lokala katalogbilder används, med tidigare dokumenterade källor och tillstånd.
