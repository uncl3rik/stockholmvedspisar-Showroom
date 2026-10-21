# Kontakt och sparade designer

Formuläret skickar till https://formspree.io/f/mbgdvppa. Endpoint och alternativ mejladress finns i src/lib/contact.ts. Mottagare och eventuell aktivering hanteras i Formspree-kontot; kontrollera att mottagaren är glittergruvanab@gmail.com.

Designer sparas lokalt (högst tio utkast), laddas ner som text med återöppningslänk eller kopieras som länk. På kontaktsidan kan besökaren välja ett sparat utkast och slå av/på bifogad design. Länken innehåller inga personliga kontaktuppgifter.

Verifiera leverans med ett eget provutskick. Automatiska tester använder en simulerad HTTP-tjänst och skickar inga mejl. Testa även utan bifogad design, med avbruten anslutning samt sparande och återöppning på mobil.
