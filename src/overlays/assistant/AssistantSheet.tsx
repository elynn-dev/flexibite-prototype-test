import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '../../components/Button';
import { Icon, type IconName } from '../../components/Icon';
import { MealMarker } from '../../components/MealTime';
import type { DayKey, MealTime } from '../../data/types';
import { TODAY, addDays, chipLabel, fromKey, toKey } from '../../lib/dates';
import { usePlannerDispatch } from '../../state/PlannerContext';
import avocadoToast from '../../assets/images/avocado-toast.jpg';
import rainbowSalad from '../../assets/images/rainbow-salad.jpg';
import prep1 from '../../assets/images/prep-1.jpg';
import prep2 from '../../assets/images/prep-2.jpg';
import prep3 from '../../assets/images/prep-3.jpg';
import avocadoIcon from '../../assets/ingredients/avocado.svg';
import { DatePicker } from './DatePicker';
import styles from './AssistantSheet.module.css';

/**
 * The assistant conversation (Figma AI-agent-1 … 8). Each step is one "message" in the sheet.
 * Steps ending in "Loading" show only the user's choice for a second before the reply appears.
 */
type Step =
  | 'start'
  | 'pantryLoading'
  | 'pantry'
  | 'ideasLoading'
  | 'ideas'
  | 'mealLoading'
  | 'pickDay'
  | 'calendar'
  | 'dayPicked'
  | 'prepLoading'
  | 'prep';

const AUTO_NEXT: Partial<Record<Step, Step>> = {
  pantryLoading: 'pantry',
  ideasLoading: 'ideas',
  mealLoading: 'pickDay',
  dayPicked: 'prepLoading',
  prepLoading: 'prep',
};

/** Which "message" each step belongs to. */
const MESSAGE: Record<Step, string> = {
  start: 'start',
  pantryLoading: 'pantry',
  pantry: 'pantry',
  ideasLoading: 'ideas',
  ideas: 'ideas',
  mealLoading: 'meal',
  pickDay: 'meal',
  calendar: 'calendar',
  dayPicked: 'calendar',
  prepLoading: 'prep',
  prep: 'prep',
};

const QUICK_DAYS: [string, DayKey][] = [
  ['Today', TODAY],
  ['Tomorrow', toKey(addDays(fromKey(TODAY), 1))],
  ['This Saturday', toKey(addDays(fromKey(TODAY), 3))],
];

const PREP_STEPS: [string, string][] = [
  ['Check avocado ripeness', prep1],
  ['Portion the avocado', prep2],
  ['Freeze for later use', prep3],
];

export function AssistantSheet() {
  const dispatch = usePlannerDispatch();
  const [step, setStep] = useState<Step>('start');
  const [history, setHistory] = useState<Step[]>([]);
  const [pantryTab, setPantryTab] = useState<'storage' | 'fridge' | 'freezer'>('storage');
  const [date, setDate] = useState<{ day: DayKey; meal: MealTime } | null>(null);
  const [closing, setClosing] = useState(false);
  const sheetRef = useRef<HTMLElement>(null);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => dispatch({ type: 'setOverlay', overlay: null }), 300);
  }, [dispatch]);

  // Loading steps move on by themselves.
  useEffect(() => {
    const next = AUTO_NEXT[step];
    if (!next) return;
    const t = setTimeout(() => setStep(next), 1000);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    sheetRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && step !== 'calendar' && close();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close, step]);

  const go = (to: Step) => {
    setHistory((h) => [...h, step]);
    setStep(to);
  };

  const back = () => {
    if (step === 'prepLoading' || step === 'prep') {
      setDate(null);
      setStep('pickDay');
      return;
    }
    setStep(history[history.length - 1] ?? 'start');
    setHistory((h) => h.slice(0, -1));
  };

  const pickDate = (day: DayKey, meal: MealTime = 'lunch') => {
    setDate({ day, meal });
    setStep('dayPicked');
  };

  const commit = () => {
    if (!date) return;
    dispatch({ type: 'addPlans', entries: [{ day: date.day, meal: date.meal, recipeId: 'avocado-toast' }] });
    dispatch({ type: 'selectDay', day: date.day });
  };

  const removeDate = () => {
    setDate(null);
    setStep('pickDay');
  };

  // --- Building blocks ------------------------------------------------------
  const topChip = (chip: ReactNode) => (
    <div className={styles.top}>
      <button type="button" className={styles.back} aria-label="Back" onClick={back}>
        <Icon name="backCircle" size={44} />
      </button>
      {chip}
    </div>
  );
  const promptChip = (icon: IconName, text: string, wide?: boolean) => (
    <span className={`${styles.promptChip} ${wide ? styles.wide : ''}`}>
      <span className={styles.promptIcon}>
        <Icon name={icon} size={39} />
      </span>
      <span>{text}</span>
    </span>
  );
  const mealChip = (
    <span className={styles.mealChip}>
      <img src={avocadoToast} alt="" />
      <span>Avocado Toast</span>
    </span>
  );
  const dateChip = date && (
    <div className={styles.dateChip}>
      <img src={avocadoToast} alt="" />
      <span className={styles.dateMarker}>
        <MealMarker meal={date.meal} size="md" />
      </span>
      <span className={styles.dateText}>{chipLabel(date.day)}</span>
      <button type="button" aria-label={`Remove ${chipLabel(date.day)}`} onClick={removeDate}>
        <Icon name="closeAgent" size={20} />
      </button>
    </div>
  );
  const question = <h2 className={styles.heading}>Which days would you<br />like to plan meals for?</h2>;
  const dayPicker = (
    <div className={styles.pick}>
      <button type="button" className={styles.calendarButton} aria-label="Choose a date" onClick={() => go('calendar')}>
        <Icon name="calendar" size={24} />
      </button>
      <div className={`${styles.quickDays} hide-scrollbar`}>
        {QUICK_DAYS.map(([label, day]) => (
          <button
            key={day}
            type="button"
            className={`${styles.quickDay} ${date?.day === day ? styles.on : ''}`}
            onClick={() => pickDate(day)}
          >
            <i />
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  // --- Steps ----------------------------------------------------------------
  let body: ReactNode;
  let inputLabel = '';
  let placeholder = 'Enter a message';

  switch (step) {
    case 'start':
      body = (
        <>
          <h2 className={`${styles.heading} ${styles.first}`}>How can I help you<br />to plan a meal today?</h2>
          <div className={styles.options}>
            {(
              [
                ['pantryLg', 'Check my pantry', 'pantryLoading'],
                ['recipeLg', 'Find meals for me', 'ideasLoading'],
                ['spatulaLg', 'Plan my prep ahead', null],
              ] as [IconName, string, Step | null][]
            ).map(([icon, text, to]) => (
              <button key={text} type="button" className={styles.option} onClick={() => to && go(to)}>
                <span className={styles.optionIcon}>
                  <Icon name={icon} size={39} />
                </span>
                <span className={styles.optionLabel}>
                  <span>{text}</span>
                  <Icon name="chevronRight" size={24} />
                </span>
              </button>
            ))}
          </div>
        </>
      );
      break;

    case 'pantryLoading':
    case 'pantry':
      inputLabel = 'Anything else to add?';
      placeholder = 'Type ingredients';
      body = (
        <>
          {topChip(promptChip('pantryLg', 'Check my pantry'))}
          {step === 'pantry' && (
            <>
              <h2 className={styles.heading}>Here&rsquo;s what you have<br />in your pantry</h2>
              <div className={styles.tabs} role="tablist">
                {(['storage', 'fridge', 'freezer'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={pantryTab === t}
                    className={styles.tab}
                    onClick={() => setPantryTab(t)}
                  >
                    {t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <div className={styles.pantryRows}>
                {pantryTab === 'storage' && (
                  <>
                    <PantryRow image={<img src={avocadoIcon} alt="" />} name="Avocado" quantity={1} badge="Added recently" />
                    <PantryRow image={<Icon name="onion" size={46} />} name="Onion" quantity={4} />
                  </>
                )}
              </div>
              <div className={styles.buttonRow}>
                <Button variant="dark" onClick={() => go('ideasLoading')}>
                  Suggested meal ideas
                </Button>
              </div>
            </>
          )}
        </>
      );
      break;

    case 'ideasLoading':
    case 'ideas':
      body = (
        <>
          {topChip(promptChip('recipeLg', 'Suggested meal ideas', true))}
          {step === 'ideas' && (
            <>
              <h2 className={styles.heading}>Here&rsquo;s your<br />suggested meal ideas</h2>
              <div className={`${styles.ingredients} hide-scrollbar`}>
                {(
                  [
                    ['Avocado', 1],
                    ['Onion', 4],
                    ['Carrot', 2],
                  ] as const
                ).map(([name, n]) => (
                  <span className={styles.ingredient} key={name}>
                    {name}
                    <b>{n}</b>
                    <small>whole</small>
                  </span>
                ))}
              </div>
              <div className={styles.section}>
                <Icon name="pantry" size={16} />
                Based on your pantry
              </div>
              <div className={styles.meals}>
                <button type="button" className={styles.meal} onClick={() => go('mealLoading')}>
                  <img src={avocadoToast} alt="" />
                  <span className={styles.mealText}>
                    <b>Avocado Toast</b>
                    <small>Easy to cook · 20min</small>
                    <span className={`${styles.need} ${styles.available}`}>Available</span>
                  </span>
                </button>
                <button type="button" className={styles.meal}>
                  <img src={rainbowSalad} alt="" />
                  <span className={styles.mealText}>
                    <b>Rainbow Salad</b>
                    <small>Easy to cook · 20min</small>
                    <span className={styles.need}>
                      <Icon name="pantry" size={16} />
                      <span>Need</span>
                      <b>2+</b>
                    </span>
                  </span>
                </button>
              </div>
            </>
          )}
        </>
      );
      break;

    case 'mealLoading':
    case 'pickDay':
      body = (
        <>
          {topChip(mealChip)}
          {step === 'pickDay' && (
            <>
              {question}
              {dayPicker}
            </>
          )}
        </>
      );
      break;

    case 'calendar':
    case 'dayPicked':
      body = (
        <>
          <h2 className={`${styles.heading} ${styles.first}`}>Which days would you<br />like to plan meals for?</h2>
          {dayPicker}
          {step === 'dayPicked' && <div className={styles.dateWrap}>{dateChip}</div>}
        </>
      );
      break;

    case 'prepLoading':
    case 'prep':
      body = (
        <>
          {topChip(dateChip)}
          {step === 'prep' && (
            <>
              <h2 className={styles.heading}>Here&rsquo;s what to prepare<br />ahead of time</h2>
              <div className={styles.prepSteps}>
                {PREP_STEPS.map(([text, img], i) => (
                  <div className={styles.prepStep} key={text}>
                    <img src={img} alt="" />
                    <span>
                      <span className={styles.stepNumber}>{i + 1}</span>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.buttonRow}>
                <Button
                  onClick={() => {
                    commit();
                    setDate(null);
                    setHistory(['start']);
                    setStep('ideas');
                  }}
                >
                  Make another
                </Button>
                <Button
                  variant="dark"
                  onClick={() => {
                    commit();
                    dispatch({ type: 'showToast', toast: { kind: 'ok', text: 'Plan saved!', durationMs: 2200 } });
                    close();
                  }}
                >
                  Finish planning
                </Button>
              </div>
            </>
          )}
        </>
      );
      break;
  }

  return (
    <>
      <div className={`${styles.scrim} ${closing ? styles.fadeOut : ''}`} onClick={close} />
      <section
        ref={sheetRef}
        className={`${styles.sheet} ${closing ? styles.out : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Plan a meal"
        tabIndex={-1}
      >
        <div className={styles.handle}>
          <i />
        </div>
        <div className={`${styles.feed} hide-scrollbar`} style={{ bottom: inputLabel ? 112 : 128 }}>
          {/* A new key per message replays the "message arrives" animation. A loading step and the
              reply after it share a key, so the reply just appears under the choice that stays put. */}
          <div className={styles.body} key={MESSAGE[step]}>
            {body}
          </div>
        </div>
        <div className={styles.message}>
          {inputLabel && <div className={styles.messageLabel}>{inputLabel}</div>}
          <label className={styles.input}>
            <span className={styles.inputIcon}>
              <Icon name="message" size={42} />
            </span>
            <input type="text" placeholder={placeholder} aria-label={placeholder} />
          </label>
        </div>
      </section>
      {step === 'calendar' && (
        <DatePicker
          onPick={(day, meal) => pickDate(day, meal)}
          onClose={() => setStep(history[history.length - 1] ?? 'pickDay')}
        />
      )}
    </>
  );
}

function PantryRow({ image, name, quantity, badge }: { image: ReactNode; name: string; quantity: number; badge?: string }) {
  return (
    <div className={styles.pantryRow}>
      <span className={styles.pantryImage}>{image}</span>
      <span className={styles.pantryInfo}>
        <span className={styles.pantryName}>{name}</span>
        <span className={styles.pantryQty}>
          {quantity}
          <small>Whole</small>
          <Icon name="chevronDownXs" size={16} />
        </span>
      </span>
      {badge && <span className={styles.badge}>{badge}</span>}
    </div>
  );
}
