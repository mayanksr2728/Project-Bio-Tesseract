#Kaggle notebook source [dat.4.10.2026]


========


import glob, pandas as pd

files = glob.glob('/kaggle/input/**/*telemetry*.csv', recursive=True)
print(files)

df = pd.read_csv(files[0])
print(files[0])
print(df.shape)
print(df.columns.tolist())
df.head()


import glob, pandas as pd, numpy as np, torch, torch.nn as nn
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# 1. Load and combine files with matching columns
files = glob.glob('/kaggle/input/**/*telemetry*.csv', recursive=True)
cols = ['Category','Condition_Factor','Metric_Unit','Current_Value','Expected_HR_Min','Expected_HR_Max']
dfs = []
for f in files:
    d = pd.read_csv(f)
    print(f.split('/')[-1], d.shape, "OK" if set(cols) <= set(d.columns) else "different columns")
    if set(cols) <= set(d.columns):
        d = d[cols].copy()
        d['Source'] = f.split('/')[-1]
        dfs.append(d)
df = pd.concat(dfs, ignore_index=True).dropna()
df['Current_Value'] = pd.to_numeric(df['Current_Value'], errors='coerce')
df = df.dropna()
print("Total rows:", len(df))

# 2. Features and targets
X = pd.get_dummies(df[['Category','Condition_Factor','Metric_Unit','Source']]).astype(float)
X['Current_Value'] = df['Current_Value'].values
y = df[['Expected_HR_Min','Expected_HR_Max']].values.astype(float)

Xtr, Xte, ytr, yte = train_test_split(X.values, y, test_size=0.2, random_state=42)
sx, sy = StandardScaler().fit(Xtr), StandardScaler().fit(ytr)

dev = "cuda"
T = lambda a: torch.tensor(a, dtype=torch.float32, device=dev)
Xtr_t, Xte_t = T(sx.transform(Xtr)), T(sx.transform(Xte))
ytr_t = T(sy.transform(ytr))

# 3. Model
model = nn.Sequential(
    nn.Linear(Xtr.shape[1], 128), nn.ReLU(),
    nn.Linear(128, 64), nn.ReLU(),
    nn.Linear(64, 2)
).to(dev)
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.MSELoss()

# 4. Train
for epoch in range(300):
    model.train()
    opt.zero_grad()
    loss = loss_fn(model(Xtr_t), ytr_t)
    loss.backward()
    opt.step()
    if epoch % 50 == 0:
        print(f"epoch {epoch}  loss {loss.item():.4f}")

# 5. Evaluate (error in beats per minute)
model.eval()
with torch.no_grad():
    pred = sy.inverse_transform(model(Xte_t).cpu().numpy())
print("Mean error (bpm) for Min/Max:", np.abs(pred - yte).mean(axis=0))

# 6. Save
torch.save(model.state_dict(), '/kaggle/working/hr_model.pt')
print("Saved model")




import glob, os, shutil, psutil, torch
import pandas as pd

def read_any(f):
    for enc in ('utf-8', 'cp1252', 'latin-1'):
        try:
            return pd.read_csv(f, encoding=enc), enc
        except UnicodeDecodeError:
            continue
        except Exception as e:
            return None, f"error: {e}"
    return None, "unreadable"

# 1. Your session's exact limits
ram = psutil.virtual_memory()
disk = shutil.disk_usage('/kaggle/working')
print("=== SESSION LIMITS ===")
print(f"RAM total:     {ram.total/1e9:.1f} GB   (free now: {ram.available/1e9:.1f} GB)")
print(f"Disk (working): {disk.total/1e9:.1f} GB total, {disk.free/1e9:.1f} GB free")
print(f"CPU cores:     {os.cpu_count()}")
if torch.cuda.is_available():
    for i in range(torch.cuda.device_count()):
        p = torch.cuda.get_device_properties(i)
        print(f"GPU {i}: {p.name}, {p.total_memory/1e9:.1f} GB memory")

# 2. Exact size of each environment file
print("\n=== ENVIRONMENT FILES ===")
files = sorted(glob.glob('/kaggle/input/**/environment*/**/*.csv', recursive=True))
for f in files:
    df, enc = read_any(f)
    print("-" * 60)
    print(os.path.basename(f))
    if df is None:
        print("Could not read:", enc)
        continue
    file_mb = os.path.getsize(f) / 1e6
    mem_mb = df.memory_usage(deep=True).sum() / 1e6
    bytes_per_row = df.memory_usage(deep=True).sum() / max(len(df), 1)
    max_rows = int(ram.available * 0.5 / bytes_per_row)
    print(f"Encoding used: {enc}")
    print(f"Rows: {len(df):,}   Columns: {df.shape[1]}")
    print(f"On disk: {file_mb:.2f} MB   In memory: {mem_mb:.2f} MB")
    print(f"Approx. max rows of this kind that fit in RAM: {max_rows:,}")
    print("Columns:", df.columns.tolist())





import glob, joblib, warnings
import numpy as np, pandas as pd
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
warnings.filterwarnings("ignore")

def read_raw(f, **kw):
    for enc in ('utf-8', 'cp1252', 'latin-1'):
        try:
            return pd.read_csv(f, encoding=enc, **kw)
        except UnicodeDecodeError:
            continue
    raise ValueError("cannot read " + f)

mae = lambda a, b: float(np.mean(np.abs(np.asarray(a) - np.asarray(b))))

# ================= 1. NO2 daily (forecast from past days) =================
f = glob.glob('/kaggle/input/**/NO2daily*.csv', recursive=True)[0]
raw = read_raw(f, header=None, engine='python', on_bad_lines='skip')
t = pd.to_datetime(raw.iloc[:, 0], errors='coerce', format='mixed', utc=True).dt.tz_localize(None)
v = pd.to_numeric(raw.iloc[:, 1], errors='coerce')
ok = t.notna() & v.notna()
s = pd.Series(v[ok].values, index=t[ok].values).sort_index()
s = s[~s.index.duplicated()]
s[s <= 0] = np.nan                      # fill values / bad readings
s = s.asfreq('D')
print("NO2: usable days =", int(s.notna().sum()), "| from", s.index.min().date(), "to", s.index.max().date())

d = pd.DataFrame({'y': s})
for k in (1, 2, 3, 7, 14, 30, 365):
    d[f'lag{k}'] = s.shift(k)
d['roll7'] = s.shift(1).rolling(7, min_periods=3).mean()
d['roll30'] = s.shift(1).rolling(30, min_periods=10).mean()
doy = d.index.dayofyear
d['sin'] = np.sin(2 * np.pi * doy / 365.25)
d['cos'] = np.cos(2 * np.pi * doy / 365.25)
d['month'] = d.index.month
d = d[d['y'].notna()]

cut = int(len(d) * 0.8)
tr, te = d.iloc[:cut], d.iloc[cut:]
feats = [c for c in d.columns if c != 'y']

hgb = HistGradientBoostingRegressor(max_iter=400, learning_rate=0.05, random_state=42)
hgb.fit(tr[feats], tr['y'])
med = tr[feats].median()
rf = RandomForestRegressor(n_estimators=300, random_state=42, n_jobs=-1)
rf.fit(tr[feats].fillna(med), tr['y'])

mean_te = te['y'].mean()
res = {
    "Guess train average": mae(te['y'], np.full(len(te), tr['y'].mean())),
    "Yesterday's value":   mae(te['y'], te['lag1'].fillna(tr['y'].mean())),
    "HistGradBoost":       mae(te['y'], hgb.predict(te[feats])),
    "RandomForest":        mae(te['y'], rf.predict(te[feats].fillna(med))),
}
print("\nNO2 test error (lower is better), as % of average NO2:")
for k, e in res.items():
    print(f"  {k:20s} {100 * e / mean_te:6.2f} %")

best = min(("HistGradBoost", "RandomForest"), key=lambda k: res[k])
final = hgb if best == "HistGradBoost" else rf
full = d[feats] if best == "HistGradBoost" else d[feats].fillna(d[feats].median())
final.fit(full, d['y'])
joblib.dump({'model': final, 'features': feats}, '/kaggle/working/model_NO2_daily.pkl')
print("Best:", best, "-> saved model_NO2_daily.pkl")

# ================= 2. Surface pressure file =================
f2 = glob.glob('/kaggle/input/**/surface pressure*.csv', recursive=True)[0]
p = read_raw(f2)
first = p.columns[0]
dates = None
if p[first].dtype == object:
    parsed = pd.to_datetime(p[first], errors='coerce', format='mixed')
    if parsed.notna().mean() > 0.8:
        dates = parsed
order = dates.sort_values().index if dates is not None else p.index
num = p.drop(columns=[first]).apply(pd.to_numeric, errors='coerce')
num = num.loc[:, num.notna().mean() > 0.8].loc[order].reset_index(drop=True)
if dates is not None:
    num['month'] = dates.loc[order].reset_index(drop=True).dt.month

tcol = 'surface' if 'surface' in num.columns else num.columns[0]
y = num[tcol]
X = num.drop(columns=[tcol])
leak = X.corrwith(y).abs()
leak = leak[leak > 0.98].index.tolist()      # near-copies of the target would be cheating
X = X.drop(columns=leak)
keep = y.notna()
X, y = X[keep], y[keep]
print("\nPressure file: target =", tcol, "| rows =", len(X), "| dropped near-copy columns:", leak)

cut = int(len(X) * 0.8)
Xtr, Xte, ytr, yte = X.iloc[:cut], X.iloc[cut:], y.iloc[:cut], y.iloc[cut:]
med2 = Xtr.median()
Xtr, Xte = Xtr.fillna(med2), Xte.fillna(med2)
rf2 = RandomForestRegressor(n_estimators=300, random_state=42, n_jobs=-1).fit(Xtr, ytr)
e_model = mae(yte, rf2.predict(Xte))
e_base = mae(yte, np.full(len(yte), ytr.mean()))
print(f"Model error: {e_model:.4g}   |   Guess-the-average error: {e_base:.4g}")
imp = pd.Series(rf2.feature_importances_, index=X.columns).sort_values(ascending=False)
print("Most useful columns:\n", imp.head(8).round(3))

rf2.fit(pd.concat([Xtr, Xte]), pd.concat([ytr, yte]))
joblib.dump({'model': rf2, 'features': X.columns.tolist(), 'target': tcol}, '/kaggle/working/model_surface_pressure.pkl')
print("Saved model_surface_pressure.pkl")







