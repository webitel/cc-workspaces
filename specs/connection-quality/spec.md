# Connection quality — specified

> **Source of truth:** Jira + Confluence. See [`as-built.md`](./as-built.md) and
> [`delta.md`](./delta.md).

| | |
| --- | --- |
| **Module** | Workspace (cross-cutting) |
| **Feature** | Network quality monitoring |
| **Status** | **DONE** |
| **Priority** | P0 |
| **Quarter** | 26.02 |
| **Owner** | Olena Bilianska |
| **Source** | Укргаз |
| **Spec** | [WPR/1178402825 `26.02 [Workspace] Перевірка якості мережі`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1178402825/26.02+Workspace) |

> One of only two features in this spec set with a complete, accepted,
> acceptance-criteria-level specification (the other is
> [`../video/`](../video/)). It includes thresholds, tooltip texts and
> localisation for three languages.

## 1. Problem and goal

**Problem:** the agent does not know why call quality is bad.

**Goal — real-time connection monitoring:**

- track the state periodically
- show the agent the current network state at login and continuously in Workspace
- notify the agent when indicators fall below threshold
- let the agent launch a deeper check

## 2. Two modes of measurement

### 2.1. Continuous, automatic

> *"Постійно і автоматично можуть відстежуватися два параметри: **Ping і
> Jitter**."*

Drives the header icon colour (US_01) and the yellow/red notifications (US_03).

### 2.2. On demand, manual

> *"Користувач може вручну запустити глибшу перевірку якості (**Packet loss**).
> Глибша перевірка запускається вручну при кліку на іконку в хедері"* (US_02).

## 3. Thresholds

| Parameter | Green | Yellow | Red |
| --- | --- | --- | --- |
| **Ping (Latency)** | < 150 ms | 150–300 ms | > 300 ms |
| **Jitter** | < 30 ms | 30–50 ms | > 50 ms |
| **Packet Loss** | < 1 % | 1–3 % | > 3 % |
| **MOS** | ≥ 4.0 | 3.5–4.0 | < 3.5 |

> **MOS is explicitly excluded from what the agent sees:**
> *"MOS ніяк не діагностується для користувача, існує як статистичний
> параметр."*

## 4. US_01 — header indicator

**AC_01.01.** An icon in the top bar, coloured by network state per the
thresholds. *"Колір іконки відображає стан мережі в реальному часі, оскільки
постійно і автоматично відстежуються два параметри **Ping і Jitter**."*

**AC_01.02.** Hovering shows a tooltip:

| Colour | Tooltip |
| --- | --- |
| Green | Excellent network quality |
| Yellow | There might be some delay, please check your network |
| Red | Network quality is poor, please check your network |

> The longer variants ("You can click the icon to run a deeper network
> analysis…") are **struck through** in the source — they were specified, then
> withdrawn, while remaining in the localisation table below.

## 5. US_02 — manual check

**AC_02.01.** Clicking the network icon runs a deeper check (**packet loss**).
During the check a **loader replaces the icon**. The result is shown as the
icon's colour.

**AC_02.02.** After the check completes, the system shows a notification per
US_03.

## 6. US_03 — notifications

> *"Сповіщення повинне відображатися **максимальний можливий час**."*

| Trigger | Type | Text |
| --- | --- | --- |
| Red level, **automatic or manual** | `error` | Network quality is poor, please check your network |
| Yellow level, **automatic or manual** | `warning` | There might be some delay, please check your network |
| Green level, **manual only** | `info` | Excellent network quality |

Note the asymmetry: green produces a notification **only** after a manual check —
automatic monitoring never announces good quality.

## 7. Localisation

Three languages specified in the source for every string (English / Українська /
русский), including the withdrawn long tooltip variants.

## 8. Discussion (not in scope)

- store analytics to find persistently problematic agents; build Grafana
  dashboards
- show agents' network state in Supervisor → Agents

## 9. Follow-up

[WPR/1490321650 `26.06 [History,Workspace] Якість мережі при дзвінку`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1490321650/26.06+History+Workspace)
— show the network quality recorded during a call in History.
