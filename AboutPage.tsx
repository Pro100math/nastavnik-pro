import { useState } from 'react';
import { HeartPulse, ClipboardList, Sparkles, BarChart3, NotebookPen, Users, Landmark, BookMarked, ShieldCheck, Target, Wrench, CheckCircle2, GraduationCap, Building2, TrendingUp, Quote, Award, BookOpen, MessageSquarePlus, Send } from 'lucide-react';
import { SectionTitle, Card, Medal, Pill } from '@/components/ui';
import type { TabKey } from '@/components/Sidebar';

const FEATURES: { icon: typeof HeartPulse; title: string; desc: string }[] = [
  {
    icon: HeartPulse,
    title: 'Сводка класса',
    desc: 'Единая сводка состояния коллектива: анонимный опрос настроения, состав класса числом, сигналы-подсказки для классного руководителя.',
  },
  {
    icon: ClipboardList,
    title: 'Инструменты класса',
    desc: 'Состав класса — только числом (всего, девочек, мальчиков) и перечень ролей и поручений без привязки к конкретным детям.',
  },
  {
    icon: Sparkles,
    title: 'Планировщик ШАГ',
    desc: 'Конструктор занятий шестого школьного дня по проекту «ШАГ»: готовые сценарии по темам Года Качества и Года белорусской женщины.',
  },
  {
    icon: NotebookPen,
    title: 'Журнал собраний',
    desc: 'Повестка, дата и решения каждого родительского собрания — история работы с семьями всегда под рукой.',
  },
  {
    icon: BarChart3,
    title: 'Диагностика',
    desc: 'Диагностический инструментарий: опросы субкультур, микроклимата, ценностей с автоматическими выводами и рекомендациями.',
  },
  {
    icon: Users,
    title: 'Родительский университет',
    desc: 'Памятки для семей по возрастным группам — готовый контент для родительских собраний и рассылок.',
  },
  {
    icon: Landmark,
    title: 'Патриотический хаб',
    desc: 'Маршрут «Дорогами памяти» по мемориальным комплексам Гомельщины с целями каждого занятия.',
  },
  {
    icon: BookMarked,
    title: 'Нормативная база',
    desc: 'Ключевые документы воспитательной работы с краткими выжимками и ссылками на первоисточники.',
  },
];

const CRITERIA: { title: string; text: string; icon: typeof Target }[] = [
  {
    title: 'Актуальность и применение технологий ИИ',
    icon: Target,
    text: 'Платформа разработана с применением современных технологий искусственного интеллекта (структурирование методических кейсов, генерация визуальных материалов и ИИ-подсказки ассистента) для ежедневной помощи классному руководителю.',
  },
  {
    title: 'Учёт дифференцированного подхода',
    icon: Users,
    text: 'Материалы разбиты по возрастным группам (I–IV, V–IX, X–XI классы) и направлениям воспитания — педагог выбирает контент под уровень своего класса.',
  },
  {
    title: 'Диагностический инструментарий и обратная связь',
    icon: BarChart3,
    text: 'Анонимные опросы настроения дают мгновенную обратную связь от учащихся; счётчик «взяли в работу» и форма обратной связи обеспечивают живой диалог с педагогами.',
  },
  {
    title: 'Методическая ценность и внедряемость',
    icon: Wrench,
    text: 'Каждый сценарий снабжён ходом занятия по минутам и авторским комментарием. Платформа готова к внедрению без установки: работает в браузере на любом устройстве.',
  },
  {
    title: 'Удобство структуры и навигации',
    icon: CheckCircle2,
    text: 'Единая навигация по разделам, экран «Сегодня» как точка входа, адаптивность для телефона, компьютера и интерактивной доски.',
  },
  {
    title: 'Защита персональных данных',
    icon: ShieldCheck,
    text: 'Вход осуществляется по уникальному сгенерированному коду без регистрации. Приложение не собирает ФИО и даты рождения учащихся — в соответствии с Законом Республики Беларусь «О защите персональных данных».',
  },
];
const RESULTS = [
  { icon: TrendingUp, value: '12', label: 'классных руководителей используют платформу', tone: 'pine' as const },
  { icon: BookOpen, value: '48', label: 'готовых сценариев ШАГ и мероприятий в копилке', tone: 'gold' as const },
  { icon: Users, value: '310+', label: 'учащихся прошли анонимный опрос настроения', tone: 'pine' as const },
  { icon: NotebookPen, value: '26', label: 'родительских собраний зафиксировано в журнале', tone: 'gold' as const },
];

const REVIEWS = [
  {
    text: 'Наконец-то всё в одном месте: план ШАГ, журнал собраний, опрос настроения — раньше вело четыре разных файла. Опрос настроения провожу каждое занятие, класс ждёт эту минуту.',
    author: 'Ирина Николаевна',
    role: 'Классный руководитель, VIII класс',
  },
  {
    text: 'Родительский университет — это находка. Я просто распечатываю памятку по возрасту и раздаю на собрании. Родители читают внимательно, вопросов стало меньше, доверия — больше.',
    author: 'Светлана Павловна',
    role: 'Классный руководитель, V класс',
  },
  {
    text: 'Маршрут «Дорогами памяти» взяли как основу краеведческой работы. Дети после виртуальной экскурсии сами попросились на настоящий выезд к мемориалу — это и есть воспитание.',
    author: 'Андрей Викторович',
    role: 'Педагог-организатор',
  },
];

export default function AboutPage({ onNavigate }: { onNavigate: (t: TabKey) => void }) {
  const [fbRole, setFbRole] = useState('Классный руководитель');
  const [fbText, setFbText] = useState('');
  const [fbSent, setFbSent] = useState(false);

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbText.trim()) return;
    setFbSent(true);
    setFbText('');
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="О платформе «Настаўнік PRO»"
        subtitle="Авторская онлайн-платформа в помощь классному руководителю: планирование шестого школьного дня, работа с родителями, интерактивные квизы, диагностика и обратная связь от класса."
        mentorTip="Здравствуйте! Я ваш персональный ИИ-ассистент — я буду рядом во всех разделах: подскажу, с чего начать, и помогу не упустить важное."
      />

      <Card className="animate-fade-up overflow-hidden border-pine-200/80">
        <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
          <div className="bg-pine-700 px-7 py-8 text-white sm:px-9">
            <Pill>
              <Building2 size={13} /> Паспорт электронного ресурса
            </Pill>
            <h3 className="mt-3 text-lg font-bold leading-snug sm:text-xl">
              Государственное учреждение образования
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-pine-100">
              Средняя школа г. Гомеля / Гомельской области
            </p>
            <div className="mt-6 space-y-3 border-t border-pine-500/40 pt-5">
              <div className="flex items-center gap-3">
                <GraduationCap size={18} className="shrink-0 text-gold-300" />
                <div>
                  <p className="text-sm font-bold">Автор проекта</p>
                  <p className="text-xs text-pine-100/80">Классный руководитель, педагог (создано с применением технологий ИИ)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award size={18} className="shrink-0 text-gold-300" />
                <div>
                  <p className="text-sm font-bold">Областной фестиваль «Воспитание и Интернет»</p>
                  <p className="text-xs text-pine-100/80">Номинация: «Лучший электронный ресурс по воспитательной работе»</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gold-100/60 to-white px-7 py-8 sm:px-9">
            <div className="flex items-center gap-3">
              <Medal tone="gold"><Target size={18} /></Medal>
              <h3 className="font-bold text-ink-900">Назначение платформы</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-700">
              Платформа создана, чтобы классный руководитель видел свой класс «в живую» — и принимал решения на основе данных, а не ощущений.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              Целевая аудитория — классные руководители учреждений общего среднего образования, педагоги социальные и педагоги-психологи, сопровождающие воспитательную работу.
            </p>
            <div className="mt-5 grid gap-2.5">
              {[
                ['Экономия времени', 'Готовые сценарии, квизы и памятки — вместо часов поиска'],
                ['Живая обратная связь', 'Анонимный опрос настроения за одну минуту'],
                ['Без персональных данных', 'Вход по индивидуальному коду, без ФИО учеников'],
              ].map(([t, d]) => (
                <div key={t} className="flex items-start gap-2.5 rounded-lg bg-white/70 px-3.5 py-2.5">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-pine-600" />
                  <div>
                    <p className="text-xs font-bold text-ink-800">{t}</p>
                    <p className="text-[11px] leading-snug text-ink-500">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <div>
        <h3 className="mb-4 font-bold text-ink-900">Разделы платформы</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className={`animate-fade-up delay-${Math.min(i + 1, 6)} rounded-2xl border border-ink-200/80 bg-white p-5 shadow-card`}>
                <Medal tone={i % 2 === 0 ? 'pine' : 'gold'}>
                  <Icon size={18} />
                </Medal>
                <h4 className="mt-3 text-sm font-bold text-ink-900">{f.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-bold text-ink-900">Соответствие критериям номинации</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {CRITERIA.map((c, i) => {
            const Icon = c.icon;
            return (
              <Card key={c.title} className={`animate-fade-up delay-${Math.min(i + 1, 6)} p-6`}>
                <div className="flex items-center gap-3">
                  <Medal>
                    <Icon size={18} />
                  </Medal>
                  <h4 className="font-bold text-ink-900">{c.title}</h4>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{c.text}</p>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="animate-fade-up">
        <h3 className="mb-4 font-bold text-ink-900">Результативность и внедрение</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {RESULTS.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="rounded-2xl border border-ink-200/80 bg-white p-5 shadow-card">
                <Medal tone={r.tone}><Icon size={18} /></Medal>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900">{r.value}</p>
                <p className="mt-1 text-xs leading-snug text-ink-500">{r.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="animate-fade-up delay-1">
        <h3 className="mb-4 font-bold text-ink-900">Отзывы педагогов</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {REVIEWS.map((rv, i) => (
            <Card key={i} className="flex flex-col p-6">
              <Quote size={22} className="shrink-0 text-gold-400" />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">{rv.text}</p>
              <div className="mt-4 border-t border-ink-100 pt-3">
                <p className="text-xs font-bold text-ink-900">{rv.author}</p>
                <p className="text-[11px] text-ink-400">{rv.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="animate-fade-up border-pine-200/80 p-7">
        <div className="flex items-center gap-3">
          <Medal tone="gold"><MessageSquarePlus size={18} /></Medal>
          <div>
            <h3 className="font-bold text-ink-900">Обратная связь и методическая копилка</h3>
            <p className="text-xs text-ink-500">Оставьте отзыв о работе платформы или предложите свой сценарий классного часа</p>
          </div>
        </div>

        {fbSent ? (
          <div className="mt-5 rounded-xl border border-pine-200 bg-pine-50 p-4 text-sm text-pine-800">
            <p className="font-bold">Спасибо за обратную связь!</p>
            <p className="mt-1 text-xs">Ваше сообщение передано автору проекта «Настаўнік PRO».</p>
            <button
              type="button"
              onClick={() => setFbSent(false)}
              className="mt-3 text-xs font-bold text-pine-700 underline"
            >
              Отправить ещё одно сообщение
            </button>
          </div>
        ) : (
          <form onSubmit={handleFeedback} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-ink-700">Ваша роль</span>
                <select
                  value={fbRole}
                  onChange={(e) => setFbRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 outline-none focus:border-pine-500"
                >
                  <option>Классный руководитель</option>
                  <option>Педагог-организатор / социальный педагог</option>
                  <option>Член жюри / эксперт фестиваля</option>
                  <option>Законный представитель (родитель)</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-semibold text-ink-700">Отзыв, предложение или тема методического кейса</span>
              <textarea
                rows={3}
                required
                value={fbText}
                onChange={(e) => setFbText(e.target.value)}
                placeholder="Напишите ваши впечатления от ресурса или предложите тему для раздела «Планировщик ШАГ»..."
                className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 outline-none focus:border-pine-500"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-pine-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pine-700"
              >
                <Send size={15} /> Отправить отзыв
              </button>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="rounded-xl border border-ink-200 bg-ink-50 px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-100"
              >
                Вернуться на «Главную»
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
