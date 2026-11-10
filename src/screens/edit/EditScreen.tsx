import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../components/Button';
import { CroppedImage } from '../../components/CroppedImage';
import { Switch, OverlayHeader } from '../../components/Controls';
import { Icon } from '../../components/Icon';
import { MealMarker } from '../../components/MealTime';
import { RECIPES } from '../../data/recipes';
import { MEAL_LABEL, type DayKey, type MealTime, type PlannedMeal, type PlanEntry } from '../../data/types';
import {
  CALENDAR_MONTH,
  MONTH_SHORT,
  TODAY,
  WEEKDAY_LETTERS,
  calendarDays,
  calendarWeeks,
  fromKey,
  longLabel,
  shortLabel,
  toKey,
} from '../../lib/dates';
import { usePlanner, usePlannerDispatch } from '../../state/PlannerContext';
import { mealsOn } from '../../state/plannerReducer';
import { MealTimeSelect } from './MealTimeSelect';
import { learn, suggestedDays, type History, type Suggestion } from './repeatPattern';
import styles from './EditScreen.module.css';

type EditToast =
  | { kind: 'hint' | 'ok' | 'fail'; text: string }
  | { kind: 'deleted'; text: string }
  | { kind: 'sugg'; text: string };

interface Drag {
  meal: MealTime;
  x: number;
  y: number;
  overDay: DayKey | null;
  nearBin: boolean;
}

const HINT: EditToast = { kind: 'hint', text: 'Drag a recipe onto a day' };

/** Edit plans (Figma drag-1 … drag-6): move or copy meals by dragging them onto days. */
export function EditScreen() {
  const { plans, selectedDay } = usePlanner();
  const dispatch = usePlannerDispatch();
  const meals = mealsOn(plans, selectedDay);

  const [picked, setPicked] = useState<MealTime | null>(null);
  const [keep, setKeep] = useState(true);
  const [history, setHistory] = useState<History>({});
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  /** Plans added by accepting a suggestion, so "×" can take them back. */
  const [added, setAdded] = useState<PlanEntry[] | null>(null);
  const [deleted, setDeleted] = useState<{ day: DayKey; meal: PlannedMeal } | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [landed, setLanded] = useState<DayKey | null>(null);
  const [toast, setToastState] = useState<EditToast>(HINT);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const binRef = useRef<HTMLButtonElement>(null);

  // What the toast goes back to after a short message.
  const restingToast = useCallback(
    (s: Suggestion | null, p: MealTime | null): EditToast =>
      s ? { kind: 'sugg', text: `${s.lead} · 4 weeks` } : p ? pickToast(p) : HINT,
    [],
  );
  const latest = useRef({ suggestion, picked });
  latest.current = { suggestion, picked };

  const setToast = useCallback(
    (t: EditToast, ms?: number) => {
      clearTimeout(timer.current);
      setToastState(t);
      if (ms) timer.current = setTimeout(() => setToastState(restingToast(latest.current.suggestion, latest.current.picked)), ms);
    },
    [restingToast],
  );
  useEffect(() => () => clearTimeout(timer.current), []);

  const select = (day: DayKey) => dispatch({ type: 'selectDay', day });

  const place = (meal: MealTime, day: DayKey) => {
    const src = selectedDay;
    const plan = meals.find((p) => p.meal === meal);
    setPicked(null);
    setAdded(null);
    setDeleted(null);
    if (!plan) return;
    if (mealsOn(plans, day).some((p) => p.meal === meal)) {
      select(day);
      setToast({ kind: 'fail', text: `${MEAL_LABEL[meal]} is already on ${shortLabel(day)}` }, 2200);
      return;
    }
    dispatch({ type: 'addPlans', entries: [{ day, ...plan }] });
    if (!keep && src !== day) dispatch({ type: 'removePlan', day: src, meal });
    select(day);
    const res = learn(history, meal, plan.recipeId, src, day);
    setHistory(res.history);
    setSuggestion(res.suggestion);
    latest.current.suggestion = res.suggestion;
    setLanded(day);
    setTimeout(() => setLanded(null), 500);
    setToast({ kind: 'ok', text: 'Plans added!' }, 1400);
  };

  const remove = (meal: MealTime) => {
    const plan = meals.find((p) => p.meal === meal);
    if (!plan) return;
    setPicked(null);
    setAdded(null);
    setSuggestion(null);
    setHistory((h) => ({ ...h, [meal]: undefined }));
    dispatch({ type: 'removePlan', day: selectedDay, meal });
    setDeleted({ day: selectedDay, meal: plan });
    setToast({ kind: 'deleted', text: 'Plan deleted' });
  };

  /** The select above a card: move the plan to another meal time on the same day. */
  const changeMealTime = (plan: PlannedMeal, to: MealTime) => {
    if (meals.some((p) => p.meal === to)) {
      setToast({ kind: 'fail', text: `${MEAL_LABEL[to]} is already on ${shortLabel(selectedDay)}` }, 2200);
      return;
    }
    setPicked(null);
    dispatch({ type: 'removePlan', day: selectedDay, meal: plan.meal });
    dispatch({ type: 'addPlans', entries: [{ day: selectedDay, meal: to, recipeId: plan.recipeId }] });
    setToast({ kind: 'ok', text: 'Changes saved!' }, 1400);
  };

  const undoDelete = () => {
    if (!deleted) return;
    dispatch({ type: 'addPlans', entries: [{ day: deleted.day, ...deleted.meal }] });
    setDeleted(null);
    setToast(restingToast(suggestion, null));
  };

  const acceptSuggestion = () => {
    if (added) {
      // Second ✓: keep the added days.
      setAdded(null);
      setSuggestion(null);
      setToast({ kind: 'ok', text: 'Changes saved!' }, 2200);
      return;
    }
    if (!suggestion) return;
    const entries = suggestedDays(suggestion)
      .filter((day) => !mealsOn(plans, day).some((p) => p.meal === suggestion.meal))
      .map((day) => ({ day, meal: suggestion.meal, recipeId: suggestion.recipeId }));
    if (!entries.length) {
      setSuggestion(null);
      setToast({ kind: 'hint', text: 'Nothing more to add in view' }, 2200);
      return;
    }
    dispatch({ type: 'addPlans', entries });
    setAdded(entries);
    setToast({ kind: 'sugg', text: `${entries.length} more ${entries.length === 1 ? 'day' : 'days'} · 4 weeks` });
  };

  const dismissSuggestion = () => {
    added?.forEach((e) => dispatch({ type: 'removePlan', day: e.day, meal: e.meal }));
    setAdded(null);
    setSuggestion(null);
    setToast(picked ? pickToast(picked) : HINT);
  };

  const togglePick = (meal: MealTime) => {
    const next = picked === meal ? null : meal;
    setPicked(next);
    setToast(next ? pickToast(next) : restingToast(suggestion, null));
  };

  // --- Dragging -------------------------------------------------------------
  const start = useRef<{ x: number; y: number; meal: MealTime; id: number } | null>(null);

  const hitTest = (x: number, y: number): Pick<Drag, 'overDay' | 'nearBin'> => {
    const r = binRef.current?.getBoundingClientRect();
    const nearBin = !!r && x > r.left - 28 && x < r.right + 28 && y > r.top - 28 && y < r.bottom + 28;
    if (nearBin) return { overDay: null, nearBin };
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-day]');
    return { overDay: el?.dataset.day ?? null, nearBin: false };
  };

  const onPointerDown = (meal: MealTime) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    start.current = { x: e.clientX, y: e.clientY, meal, id: e.pointerId };
    try {
      // Keep receiving moves while the pointer leaves the card. Can fail if the pointer is already gone.
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* dragging still works without capture */
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const s = start.current;
    if (!s) return;
    if (!drag && Math.hypot(e.clientX - s.x, e.clientY - s.y) <= 6) return;
    if (!drag) {
      setPicked(null);
      setToast({ kind: 'hint', text: 'Drop it on a day' });
    }
    setDrag({ meal: s.meal, x: e.clientX, y: e.clientY, ...hitTest(e.clientX, e.clientY) });
  };

  const onPointerUp = (cancelled: boolean) => () => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    if (!drag) {
      if (!cancelled) togglePick(s.meal);
      return;
    }
    const d = drag;
    setDrag(null);
    if (cancelled) return setToast(restingToast(suggestion, null));
    if (d.nearBin) remove(d.meal);
    else if (d.overDay) place(d.meal, d.overDay);
    else setToast(restingToast(suggestion, null));
  };

  // Keyboard: Enter/Space on a card picks it (pointer events don't fire for keyboard clicks).
  const onCardKeyClick = (meal: MealTime) => (e: ReactMouseEvent) => {
    if (e.detail === 0) togglePick(meal);
  };

  const onDayClick = (day: DayKey) => {
    if (picked) place(picked, day);
    else {
      select(day);
      setPicked(null);
    }
  };

  const step = (delta: number) => {
    const all = calendarDays();
    const i = Math.max(0, Math.min(all.length - 1, all.indexOf(selectedDay) + delta));
    select(all[i]);
    setPicked(null);
  };

  const finish = () => {
    dispatch({ type: 'navigate', screen: 'home' });
    dispatch({ type: 'showToast', toast: { kind: 'ok', text: 'Changes saved!', durationMs: 2200 } });
  };

  return (
    <section className={styles.screen} aria-label="Edit plans">
      <OverlayHeader onClose={() => dispatch({ type: 'navigate', screen: 'home' })} />
      <div className={styles.body}>
        <div className={styles.heading}>
          <div className={`${styles.monthDay} heading-h2`}>
            <button type="button" className={styles.chev} aria-label="Previous day" onClick={() => step(-1)}>
              <Icon name="chevronLeft" size={16} />
            </button>
            <span>{MONTH_SHORT[CALENDAR_MONTH]}</span>
            <span>{fromKey(selectedDay).getDate()}</span>
            <button type="button" className={`${styles.chev} ${styles.next}`} aria-label="Next day" onClick={() => step(1)}>
              <Icon name="chevronLeft" size={16} />
            </button>
          </div>
        </div>

        <div className={styles.dates}>
          <div className={styles.weekdays} aria-hidden="true">
            {WEEKDAY_LETTERS.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
          <div className={styles.weeks}>
            {calendarWeeks().map((week) => (
              <div className={styles.week} key={toKey(week[0])}>
                {week.map((d) => {
                  const day = toKey(d);
                  const list = mealsOn(plans, day);
                  const cls = [
                    styles.day,
                    d.getMonth() !== CALENDAR_MONTH && styles.outside,
                    day === selectedDay && styles.selected,
                    drag?.overDay === day && styles.over,
                    landed === day && styles.landed,
                  ]
                    .filter(Boolean)
                    .join(' ');
                  return (
                    <button
                      key={day}
                      type="button"
                      data-day={day}
                      className={cls}
                      aria-label={`${longLabel(day)}, ${list.length} planned`}
                      onClick={() => onDayClick(day)}
                    >
                      <span>{d.getDate()}</span>
                      {list.length > 0 && (
                        <span className={styles.plan}>
                          {list.map((p) => (
                            <MealMarker key={p.meal} meal={p.meal} />
                          ))}
                        </span>
                      )}
                      {day === TODAY && <i className={styles.today} />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.toastSlot} ${toast.kind === 'sugg' ? styles.right : ''}`}>
          <ToastView
            toast={toast}
            onUndo={undoDelete}
            onAccept={acceptSuggestion}
            onDismiss={dismissSuggestion}
          />
        </div>

        <div className={styles.editPart}>
          <div className={styles.cards}>
            {meals.length === 0 ? (
              <div className={styles.empty}>No recipes on {shortLabel(selectedDay)}. Tap another day.</div>
            ) : (
              meals.map((p) => (
                <div className={styles.slot} key={p.meal}>
                  <MealTimeSelect value={p.meal} onChange={(m) => changeMealTime(p, m)} />
                  <button
                    type="button"
                    className={[
                      styles.card,
                      picked === p.meal && styles.picked,
                      drag?.meal === p.meal && styles.dim,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-label={`${MEAL_LABEL[p.meal]} recipe. Drag onto a day, or press to pick it and then choose a day.`}
                    aria-pressed={picked === p.meal}
                    onPointerDown={onPointerDown(p.meal)}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp(false)}
                    onPointerCancel={onPointerUp(true)}
                    onClick={onCardKeyClick(p.meal)}
                  >
                    <CroppedImage src={RECIPES[p.recipeId].image} crop={RECIPES[p.recipeId].cardCrop} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.keep}>
              <div>
                <div className={styles.keepTitle}>Keep on current day</div>
                <div className={styles.keepHint}>
                  {keep ? 'Plan stays and is copied to the new days' : 'Plan moves to the new days'}
                </div>
              </div>
              <Switch checked={keep} onChange={setKeep} label="Keep on current day" />
            </div>
            <div className={styles.foot}>
              <Button
                ref={binRef}
                className={`${styles.bin} ${drag?.nearBin ? styles.binOver : ''}`}
                aria-label="Delete plan. Drag a recipe here to remove it from this day."
                onClick={() =>
                  picked ? remove(picked) : setToast({ kind: 'hint', text: 'Drag a recipe onto the bin' }, 2000)
                }
              >
                <Icon name="trash" size={20} />
              </Button>
              <button type="button" className={styles.done} onClick={finish}>
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      {drag &&
        createPortal(
          <div className={styles.ghost} style={{ left: drag.x, top: drag.y }}>
            {drag.nearBin && <span className={`${styles.tip} label-xs-regular-upper`}>Remove</span>}
            {!drag.nearBin && drag.overDay && (
              <span className={`${styles.tip} label-xs-regular-upper`}>{shortLabel(drag.overDay)}</span>
            )}
            <CroppedImage
              src={RECIPES[meals.find((p) => p.meal === drag.meal)?.recipeId ?? 'avocado-toast'].image}
              crop={RECIPES[meals.find((p) => p.meal === drag.meal)?.recipeId ?? 'avocado-toast'].cardCrop}
            />
          </div>,
          document.body,
        )}
    </section>
  );
}

function pickToast(meal: MealTime): EditToast {
  return { kind: 'hint', text: `Tap a day to place the ${MEAL_LABEL[meal].toLowerCase()} recipe` };
}

function ToastView({
  toast,
  onUndo,
  onAccept,
  onDismiss,
}: {
  toast: EditToast;
  onUndo: () => void;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  if (toast.kind === 'sugg') {
    return (
      <div className={`${styles.toast} ${styles.sugg} label-xs-bold-upper`} role="status">
        <span className={styles.suggText}>
          <Icon name="sparkle" size={12} />
          {toast.text}
        </span>
        <span className={styles.suggActions}>
          <button type="button" aria-label="Accept" onClick={onAccept}>
            <Icon name="checkOrange" size={20} />
          </button>
          <span className={styles.divider} />
          <button type="button" aria-label="Dismiss" onClick={onDismiss}>
            <Icon name="closeBlack" size={20} />
          </button>
        </span>
      </div>
    );
  }
  return (
    <div className={`${styles.toast} ${styles[toast.kind === 'deleted' ? 'ok' : toast.kind]} label-xs-bold-upper`} role="status">
      <span>{toast.text}</span>
      {toast.kind === 'deleted' && (
        <button type="button" className={styles.undo} aria-label="Undo delete" onClick={onUndo}>
          <Icon name="undo" size={20} />
        </button>
      )}
    </div>
  );
}
