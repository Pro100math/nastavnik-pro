import { useState } from 'react';
import { Activity, KeyRound, Loader2, ShieldCheck, ArrowRight, Sparkles, Copy, Check, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function generateCode(): string {
  let out = '';
  for (let i = 0; i < 6; i++) out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return out;
}

const STORAGE_KEY = 'nastawnik-teacher-code';
const LOCAL_CODES_KEY = 'nastawnik-local-codes';

export function getStoredCode(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearStoredCode() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function saveLocalCode(code: string) {
  try {
    const raw = localStorage.getItem(LOCAL_CODES_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(code)) {
      list.push(code);
      localStorage.setItem(LOCAL_CODES_KEY, JSON.stringify(list));
    }
  } catch {
    /* ignore */
  }
}

function isLocalCodeValid(code: string): boolean {
  try {
    const raw = localStorage.getItem(LOCAL_CODES_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(code);
  } catch {
    return false;
  }
}
type Stage = 'enter' | 'generated';
type Lang = 'be' | 'ru';

const TEXT = {
  be: {
    role: 'Класны кіраўнік',
    loginTitle: 'Уваход у кабінет',
    loginDesc: 'Увядзіце ваш персанальны код доступу.',
    codeLabel: 'Код доступу',
    placeholder: 'Напрыклад, K7M4P9',
    enterBtn: 'Увайсці',
    noCode: 'Няма свайго кода?',
    genBtn: 'Згенераваць код',
    readyTitle: 'Ваш код гатовы!',
    readyDesc: 'Запішыце яго ў нататнік',
    yourCode: 'Персанальны ключ',
    copy: 'Скапіраваць',
    copied: 'Скапіравана',
    enterCab: 'Увайсці ў кабінет',
    haveCode: 'У мяне ўжо ёсць код',
    protected: 'Без збору персанальных даных',
    errNotFound: 'Код не знойдзены. Праверце ўвод або згенеруйце новы.',
  },
  ru: {
    role: 'Классный руководитель',
    loginTitle: 'Вход в кабинет',
    loginDesc: 'Введите ваш персональный код доступа.',
    codeLabel: 'Код доступа',
    placeholder: 'Например, K7M4P9',
    enterBtn: 'Войти',
    noCode: 'Нет своего кода?',
    genBtn: 'Сгенерировать код',
    readyTitle: 'Ваш код готов!',
    readyDesc: 'Запишите его в блокнот',
    yourCode: 'Персональный ключ',
    copy: 'Копировать',
    copied: 'Скопировано',
    enterCab: 'Войти в кабинет',
    haveCode: 'У меня уже есть код',
    protected: 'Без сбора персональных данных',
    errNotFound: 'Код не найден. Проверьте ввод или сгенерируйте новый.',
  },
};

export default function AuthScreen({ onSuccess }: { onSuccess: (code: string) => void }) {
  const [lang, setLang] = useState<Lang>('be');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('enter');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const t = TEXT[lang];

  const handleGenerate = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);

    let created = generateCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateCode();
      try {
        const { error: err } = await supabase
          .from('teacher_codes')
          .insert({ code: candidate })
          .select('code')
          .single();
        if (!err || (err as { code?: string }).code !== '23505') {
          created = candidate;
          break;
        }
      } catch {
        created = candidate;
        break;
      }
    }

    saveLocalCode(created);
    setGeneratedCode(created);
    setStage('generated');
    setBusy(false);
  };

  const handleEnter = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (busy || !normalized) return;
    setBusy(true);
    setError(null);

    try {
      const { data } = await supabase
        .from('teacher_codes')
        .select('code')
        .eq('code', normalized)
        .maybeSingle();

      if (data?.code) {
        const validCode = data.code as string;
        saveLocalCode(validCode);
        try { localStorage.setItem(STORAGE_KEY, validCode); } catch { /* ignore */ }
        onSuccess(validCode);
        return;
      }
    } catch {
      /* Проверка локального хранилища при отсутствии сети */
    }

    if (isLocalCodeValid(normalized)) {
      try { localStorage.setItem(STORAGE_KEY, normalized); } catch { /* ignore */ }
      onSuccess(normalized);
      return;
    }

    setError(t.errNotFound);
    setBusy(false);
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard?.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEnterGenerated = () => {
    if (generatedCode) {
      try { localStorage.setItem(STORAGE_KEY, generatedCode); } catch { /* ignore */ }
      onSuccess(generatedCode);
    }
  };
  const formContent = (
    <div className="flex h-full flex-col justify-between text-ink-900">
      {stage === 'enter' ? (
        <>
          <div>
            <div className="flex items-center justify-between border-b border-ink-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-600 text-white">
                  <Activity className="h-3.5 w-3.5" strokeWidth={2.4} />
                </span>
                <div className="leading-none">
                  <h1 className="text-xs font-extrabold tracking-tight text-sky-800 md:text-[clamp(7px,0.75vw,12px)]">
                    Настаўнік<span className="text-pine-600">PRO</span>
                  </h1>
                  <p className="mt-0.5 text-[10px] text-ink-500 md:text-[clamp(5px,0.52vw,9px)]">{t.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLang(lang === 'be' ? 'ru' : 'be')}
                className="inline-flex items-center gap-1 rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-bold text-ink-700 hover:bg-ink-100 md:text-[clamp(5px,0.52vw,9px)]"
              >
                <Globe className="h-2.5 w-2.5" />
                {lang === 'be' ? 'БЕЛ' : 'РУС'}
              </button>
            </div>

            <h2 className="mt-2.5 text-sm font-bold md:mt-[4%] md:text-[clamp(7px,0.72vw,11px)]">{t.loginTitle}</h2>
            <p className="mt-0.5 text-xs leading-snug text-ink-500 md:text-[clamp(5px,0.55vw,9px)]">{t.loginDesc}</p>

            <form onSubmit={handleEnter} className="mt-2.5 space-y-2 md:mt-[3%] md:space-y-[2.5%]">
              <label className="block">
                <span className="text-[11px] font-semibold text-ink-600 md:text-[clamp(5px,0.55vw,9px)]">{t.codeLabel}</span>
                <div className="mt-1 flex items-center gap-1.5 rounded-lg border border-ink-200 px-2.5 py-1.5 focus-within:border-pine-500 md:py-[2.5%]">
                  <KeyRound className="h-3.5 w-3.5 shrink-0 text-ink-400 md:h-[0.85em] md:w-[0.85em]" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder={t.placeholder}
                    className="w-full min-w-0 bg-transparent text-xs font-bold tracking-[0.14em] text-ink-800 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-300 md:text-[clamp(6px,0.68vw,11px)]"
                  />
                </div>
              </label>
              {error && (
                <div className="rounded border border-gold-200 bg-gold-100/60 px-2 py-1 text-[10px] text-gold-800 md:text-[clamp(5px,0.52vw,8.5px)]">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-pine-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-pine-800 disabled:opacity-60 md:py-[2.8%] md:text-[clamp(6px,0.65vw,10.5px)]"
              >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <>{t.enterBtn} <ArrowRight className="h-3.5 w-3.5" /></>}
              </button>
            </form>
          </div>

          <div className="mt-2.5 border-t border-ink-100 pt-2 text-center md:mt-[2%] md:pt-[2%]">
            <p className="text-[11px] text-ink-500 md:text-[clamp(5px,0.52vw,8.5px)]">{t.noCode}</p>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={busy}
              className="mt-1 inline-flex items-center gap-1 rounded-lg bg-gold-100 px-3 py-1 text-[11px] font-bold text-gold-800 transition hover:bg-gold-200 disabled:opacity-60 md:mt-[1%] md:text-[clamp(5.5px,0.58vw,9.5px)]"
            >
              <Sparkles className="h-3 w-3" /> {t.genBtn}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-gold-700" />
            <div>
              <h2 className="text-xs font-bold md:text-[clamp(7px,0.72vw,11px)]">{t.readyTitle}</h2>
              <p className="text-[11px] text-ink-500 md:text-[clamp(5px,0.55vw,9px)]">{t.readyDesc}</p>
            </div>
          </div>

          <div className="my-2 rounded-xl border border-dashed border-gold-300 bg-gold-100/40 p-2.5 text-center md:my-[3%] md:p-[3.5%]">
            <p className="text-[10px] font-bold uppercase text-ink-400 md:text-[clamp(5px,0.5vw,8px)]">{t.yourCode}</p>
            <p className="mt-1 text-lg font-extrabold tracking-[0.14em] text-pine-800 md:text-[clamp(10px,1.15vw,18px)]">{generatedCode}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-1.5 inline-flex items-center gap-1 rounded border border-ink-200 bg-white px-2.5 py-1 text-[11px] font-bold text-ink-700 hover:bg-ink-50 md:text-[clamp(5px,0.55vw,9px)]"
            >
              {copied ? <Check className="h-3 w-3 text-pine-600" /> : <Copy className="h-3 w-3" />}
              {copied ? t.copied : t.copy}
            </button>
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={handleEnterGenerated}
              disabled={busy}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-pine-700 px-3 py-2 text-xs font-bold text-white hover:bg-pine-800 md:py-[2.8%] md:text-[clamp(6px,0.65vw,10.5px)]"
            >
              {t.enterCab} <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => { setStage('enter'); setGeneratedCode(null); setError(null); }}
              className="block w-full text-center text-[11px] font-bold text-ink-400 hover:text-ink-600 md:text-[clamp(5px,0.55vw,9px)]"
            >
              {t.haveCode}
            </button>
          </div>
        </>
      )}

      <div className="mt-2 flex items-center justify-center gap-1.5 rounded bg-pine-50 px-2 py-1 text-[10px] text-ink-600 md:mt-[2%] md:text-[clamp(5px,0.5vw,8px)]">
        <ShieldCheck className="h-3 w-3 shrink-0 text-pine-600" />
        <span className="truncate">{t.protected}</span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#eaf3f7] p-3 md:p-0">
      <div className="relative w-full max-w-[1440px] overflow-hidden rounded-2xl shadow-lg md:aspect-[720/405] md:rounded-none md:shadow-none">
        <img
          src="/S8sQxR-BbX9oX82LpGHSU.jpg"
          alt="Учительница держит планшет в классе"
          className="h-auto w-full object-cover md:absolute md:inset-0 md:h-full"
        />

        <div className="hidden md:block md:absolute md:left-[38.4%] md:top-[55.4%] md:h-[32.6%] md:w-[23.4%] md:overflow-hidden md:rounded-[1.2%] md:bg-white md:px-[1.1%] md:py-[0.7%] md:shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
          {formContent}
        </div>
      </div>

      <div className="mt-3 w-full max-w-md rounded-2xl border border-ink-200/80 bg-white p-5 shadow-card md:hidden">
        {formContent}
      </div>
    </div>
  );
}
