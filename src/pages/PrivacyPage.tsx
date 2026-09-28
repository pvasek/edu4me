import { Link } from 'react-router-dom'
import { Page } from '../ui/anim'
import { availableRemotes } from '../core/persistence/sync'

/** Zásady ochrany soukromí – plain Czech, linked from the profile and required by Google's consent screen. */
export default function PrivacyPage() {
  const drive = availableRemotes().some((r) => r.id === 'gdrive')
  return (
    <Page className="privacy stack">
      <span className="eyebrow">edu4me</span>
      <h1>Jak zacházíme s tvými daty</h1>
      <p>
        edu4me nemá žádný vlastní server ani uživatelské účty. Nesbíráme o tobě žádné údaje, nepoužíváme analytiku ani reklamní
        cookies.
      </p>

      <h2>Co se ukládá</h2>
      <p>
        Tvůj postup: dokončené lekce a jejich výsledky, výsledky her a závěrečných výzev, body XP, odznaky, sbírka prvků, série dní a
        nastavení (vzhled a jméno, pokud ho vyplníš).
      </p>

      <h2>Kde se to ukládá</h2>
      <ul>
        <li>
          <strong>V tvém prohlížeči</strong> (úložiště localStorage na tomto zařízení). Tato data nikam neposíláme. Smažeš je v profilu
          tlačítkem „Smazat postup“ nebo vymazáním dat prohlížeče.
        </li>
        <li>
          <strong>V souboru zálohy</strong>, pokud si ho sám stáhneš. Soubor máš jen ty.
        </li>
        {drive && (
          <li>
            <strong>Na tvém Google Disku</strong>, jen pokud si v profilu zapneš synchronizaci. Postup se uloží do skryté složky této
            aplikace (oprávnění <code>drive.appdata</code>): aplikace vidí jen svůj vlastní soubor, žádné jiné soubory na tvém Disku, a
            nezískává tvůj e-mail ani jméno. Přihlašovací token zůstává jen v tvém prohlížeči a platí zhruba hodinu. Synchronizaci
            vypneš v profilu (můžeš přitom soubor z Disku i smazat); přístup aplikace můžeš kdykoli odebrat také v nastavení účtu
            Google na{' '}
            <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">
              myaccount.google.com/permissions
            </a>
            .
          </li>
        )}
      </ul>

      <h2>Kdo aplikaci provozuje</h2>
      <p>
        Stránky hostuje služba GitHub Pages, která může podle svých pravidel zaznamenávat technické údaje o návštěvě (např. IP adresu).
        Písma a obrázky jsou součástí aplikace, nenačítají se od třetích stran.{drive && ' Knihovna pro přihlášení Google se načte jen tehdy, když synchronizaci používáš.'}
      </p>

      <h2>Kontakt</h2>
      <p>
        Dotazy a připomínky piš do{' '}
        <a href="https://github.com/pvasek/edu4me/issues" target="_blank" rel="noreferrer">
          hlášení na GitHubu
        </a>
        .
      </p>
      <p>
        <Link to="/profil">← Zpět do profilu</Link>
      </p>
    </Page>
  )
}
