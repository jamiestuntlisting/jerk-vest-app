/**
 * /admin — private analytics dashboard.
 *
 * There is intentionally no link to this route anywhere in the UI; it is only
 * reachable by typing the URL. Access is gated by an admin token that is
 * verified server-side by the Supabase edge function (the public anon key can
 * only ever INSERT events, never read them).
 */
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { analyticsConfigured, ANALYTICS_FN_URL } from '@/lib/supabase';
import { fetchAnalytics, type AnalyticsSummary } from '@/lib/analytics';
import { colors, fonts, glow, rgba, space } from '@/lib/theme';

const TOKEN_KEY = 'jv_admin_token';

function getStoredToken() {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') return localStorage.getItem(TOKEN_KEY) ?? '';
  } catch {
    /* ignore */
  }
  return '';
}
function storeToken(t: string) {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    /* ignore */
  }
}

type Status = 'idle' | 'loading' | 'ok' | 'error' | 'unauthorized' | 'unconfigured';

export default function AdminScreen() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  const load = useCallback(async (t: string) => {
    if (!analyticsConfigured || !ANALYTICS_FN_URL) {
      setStatus('unconfigured');
      return;
    }
    setStatus('loading');
    try {
      const summary = await fetchAnalytics(t);
      setData(summary);
      setStatus('ok');
      storeToken(t);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg === 'NOT_CONFIGURED') setStatus('unconfigured');
      else if (msg === 'UNAUTHORIZED') setStatus('unauthorized');
      else setStatus('error');
    }
  }, []);

  useEffect(() => {
    const t = getStoredToken();
    if (t) {
      setToken(t);
      void load(t);
    } else if (!analyticsConfigured) {
      setStatus('unconfigured');
    }
  }, [load]);

  const signOut = () => {
    storeToken('');
    setToken('');
    setData(null);
    setStatus('idle');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>JERK VEST · PRIVATE</Text>
        <Text style={styles.h1}>ANALYTICS</Text>

        {status === 'unconfigured' ? (
          <View style={styles.note}>
            <Text style={styles.noteText}>
              Analytics backend is not configured yet. Set EXPO_PUBLIC_SUPABASE_URL,
              EXPO_PUBLIC_SUPABASE_ANON_KEY and EXPO_PUBLIC_ANALYTICS_FN_URL, then redeploy.
            </Text>
          </View>
        ) : null}

        {status !== 'ok' ? (
          <View style={styles.gate}>
            <Text style={styles.label}>Admin token</Text>
            <TextInput
              value={token}
              onChangeText={setToken}
              placeholder="enter token"
              placeholderTextColor={colors.textFaint}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              onSubmitEditing={() => load(token)}
            />
            <Pressable onPress={() => load(token)} style={({ pressed }) => [styles.loadBtn, pressed && { opacity: 0.8 }]}>
              {status === 'loading' ? <ActivityIndicator color={colors.white} /> : <Text style={styles.loadText}>UNLOCK</Text>}
            </Pressable>
            {status === 'unauthorized' ? <Text style={styles.err}>Invalid token.</Text> : null}
            {status === 'error' ? <Text style={styles.err}>Could not load analytics. Try again.</Text> : null}
          </View>
        ) : null}

        {status === 'ok' && data ? <Dashboard data={data} onRefresh={() => load(token)} onSignOut={signOut} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Dashboard({ data, onRefresh, onSignOut }: { data: AnalyticsSummary; onRefresh: () => void; onSignOut: () => void }) {
  const maxDay = Math.max(1, ...data.daily.map((d) => d.views));
  return (
    <View style={{ width: '100%' }}>
      <View style={styles.toolbar}>
        <Text style={styles.generated}>Updated {new Date(data.generatedAt).toLocaleString()}</Text>
        <View style={styles.toolbarBtns}>
          <Pressable onPress={onRefresh} hitSlop={8}><Text style={styles.toolBtn}>Refresh</Text></Pressable>
          <Pressable onPress={onSignOut} hitSlop={8}><Text style={[styles.toolBtn, { color: colors.textFaint }]}>Sign out</Text></Pressable>
        </View>
      </View>

      <View style={styles.statRow}>
        <Stat label="Page views" value={data.totals.pageViews} />
        <Stat label="Sessions" value={data.totals.sessions} />
      </View>
      <View style={styles.statRow}>
        <Stat label="Outbound" value={data.totals.outboundClicks} />
        <Stat label="Events" value={data.totals.events} />
      </View>

      <Card title="VIEWS — LAST 14 DAYS">
        <View style={styles.bars}>
          {data.daily.slice(-14).map((d) => (
            <View key={d.day} style={styles.barCol}>
              <View style={[styles.bar, { height: Math.max(2, (d.views / maxDay) * 90) }]} />
              <Text style={styles.barLabel}>{d.day.slice(5)}</Text>
            </View>
          ))}
          {data.daily.length === 0 ? <Text style={styles.empty}>No data yet.</Text> : null}
        </View>
      </Card>

      <Card title="TOP PAGES">
        <RankList rows={data.byPath.map((p) => ({ label: p.path || '/', count: p.views }))} />
      </Card>

      <Card title="MENU & OUTBOUND CLICKS">
        <RankList rows={data.topTiles.map((t) => ({ label: t.label, count: t.count }))} />
      </Card>

      <Card title="EVENT TYPES">
        <RankList rows={data.byEvent.map((e) => ({ label: e.event_type, count: e.count }))} />
      </Card>

      <Card title="RECENT">
        {data.recent.length === 0 ? <Text style={styles.empty}>No data yet.</Text> : null}
        {data.recent.map((r, i) => (
          <View key={i} style={styles.recentRow}>
            <Text style={styles.recentType}>{r.event_type}</Text>
            <Text style={styles.recentMeta} numberOfLines={1}>
              {(r.label || r.path || '') as string}
            </Text>
            <Text style={styles.recentTime}>{new Date(r.created_at).toLocaleTimeString()}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value.toLocaleString()}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function RankList({ rows }: { rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  if (rows.length === 0) return <Text style={styles.empty}>No data yet.</Text>;
  return (
    <View>
      {rows.map((r, i) => (
        <View key={`${r.label}-${i}`} style={styles.rankRow}>
          <View style={styles.rankBarTrack}>
            <View style={[styles.rankBarFill, { width: `${(r.count / max) * 100}%` }]} />
          </View>
          <Text style={styles.rankLabel} numberOfLines={1}>{r.label}</Text>
          <Text style={styles.rankCount}>{r.count}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: space.lg, paddingTop: space.xl, alignItems: 'center', maxWidth: 520, width: '100%', alignSelf: 'center' },
  kicker: { fontFamily: fonts.heading, color: colors.purpleGlow, letterSpacing: 4, fontSize: 11 },
  h1: { fontFamily: fonts.display, color: colors.orange, fontSize: 40, letterSpacing: 1, transform: [{ skewX: '-8deg' }], marginBottom: space.lg, ...glow(colors.orangeDeep, 12, 0.5) },
  note: { backgroundColor: rgba(colors.purpleDeep, 0.6), borderColor: colors.tileBorder, borderWidth: 1, borderRadius: 12, padding: space.lg, width: '100%', marginBottom: space.lg },
  noteText: { fontFamily: fonts.body, color: colors.textDim, fontSize: 13, lineHeight: 19 },
  gate: { width: '100%', backgroundColor: colors.tileBg, borderColor: colors.tileBorder, borderWidth: 1, borderRadius: 14, padding: space.lg },
  label: { fontFamily: fonts.heading, color: colors.textDim, letterSpacing: 2, fontSize: 12, marginBottom: 8 },
  input: {
    fontFamily: fonts.body,
    color: colors.white,
    backgroundColor: rgba(colors.black, 0.4),
    borderColor: colors.tileBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  loadBtn: { marginTop: space.md, backgroundColor: colors.orange, borderRadius: 10, paddingVertical: 13, alignItems: 'center', ...glow(colors.orange, 12, 0.5) },
  loadText: { fontFamily: fonts.heading, color: colors.white, letterSpacing: 3, fontSize: 15 },
  err: { fontFamily: fonts.bodyMedium, color: colors.orangeLight, fontSize: 13, marginTop: 10 },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: space.md },
  generated: { fontFamily: fonts.body, color: colors.textFaint, fontSize: 11 },
  toolbarBtns: { flexDirection: 'row', gap: space.lg },
  toolBtn: { fontFamily: fonts.bodySemiBold, color: colors.orangeLight, fontSize: 13 },
  statRow: { flexDirection: 'row', gap: space.md, marginBottom: space.md },
  stat: { flex: 1, backgroundColor: colors.tileBg, borderColor: colors.tileBorder, borderWidth: 1, borderRadius: 14, padding: space.lg },
  statValue: { fontFamily: fonts.display, color: colors.textBright, fontSize: 30 },
  statLabel: { fontFamily: fonts.heading, color: colors.textDim, letterSpacing: 2, fontSize: 11, marginTop: 2 },
  card: { width: '100%', backgroundColor: colors.tileBg, borderColor: colors.tileBorder, borderWidth: 1, borderRadius: 14, padding: space.lg, marginTop: space.md },
  cardTitle: { fontFamily: fonts.heading, color: colors.purpleGlow, letterSpacing: 3, fontSize: 13, marginBottom: space.md },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 4 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '70%', backgroundColor: colors.orange, borderRadius: 3, minHeight: 2 },
  barLabel: { fontFamily: fonts.body, color: colors.textFaint, fontSize: 8, marginTop: 4 },
  empty: { fontFamily: fonts.body, color: colors.textFaint, fontSize: 13 },
  rankRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  rankBarTrack: { width: 70, height: 8, backgroundColor: rgba(colors.purpleLight, 0.15), borderRadius: 4, overflow: 'hidden' },
  rankBarFill: { height: 8, backgroundColor: colors.purpleLight, borderRadius: 4 },
  rankLabel: { flex: 1, fontFamily: fonts.body, color: colors.textBright, fontSize: 13 },
  rankCount: { fontFamily: fonts.bodyBold, color: colors.orangeLight, fontSize: 13 },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.lineFaint },
  recentType: { fontFamily: fonts.bodySemiBold, color: colors.orangeLight, fontSize: 11.5, width: 92 },
  recentMeta: { flex: 1, fontFamily: fonts.body, color: colors.textDim, fontSize: 11.5 },
  recentTime: { fontFamily: fonts.body, color: colors.textFaint, fontSize: 10.5 },
});
