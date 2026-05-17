import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { normalizeTokenInput } from '../utils/token';
import { getScanError, scanToken } from '../api/bookings';
import { colors } from '../theme';

type Tone = 'ok' | 'warn' | 'bad';
type Result = { tone: Tone; title: string; subtitle: string; detail?: string };

const RESULT_CONFIG: Record<Tone, {
  bg: string;
  border: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
}> = {
  ok: {
    bg: '#f0fdf4',
    border: '#22c55e',
    icon: 'checkmark-circle',
    iconColor: '#16a34a',
    label: 'Green',
  },
  warn: {
    bg: '#fff7ed',
    border: '#f97316',
    icon: 'alert-circle',
    iconColor: '#ea580c',
    label: 'Orange',
  },
  bad: {
    bg: '#fef2f2',
    border: '#ef4444',
    icon: 'close-circle',
    iconColor: '#dc2626',
    label: 'Red',
  },
};

export function ManualEntryScreen() {
  const [raw, setRaw] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    const token = normalizeTokenInput(raw);
    setResult(null);
    if (!/^[A-Z0-9]{6}$/.test(token)) {
      setResult({ tone: 'bad', title: 'Invalid token format', subtitle: 'Enter exactly 6 letters or digits' });
      return;
    }

    setBusy(true);
    try {
      const res = await scanToken(token);
      if (res.duplicate) {
        setResult({
          tone: 'warn',
          title: 'Already scanned',
          subtitle: 'Ticket already used — entry denied',
          detail: `${res.booking.name} · ${res.booking.token}`,
        });
      } else {
        setResult({
          tone: 'ok',
          title: 'Entry granted',
          subtitle: 'Valid ticket — welcome!',
          detail: `${res.booking.name} · ${res.booking.token}`,
        });
        setRaw('');
      }
    } catch (e) {
      const body = getScanError(e);
      const msg = body?.message || 'Request failed';
      if (body?.code === 'UNPAID') {
        setResult({
          tone: 'bad',
          title: 'Unpaid ticket',
          subtitle: 'Payment not completed — entry denied',
          detail: body.booking ? `${body.booking.name} · ${body.booking.token}` : undefined,
        });
      } else if (body?.code === 'NOT_FOUND') {
        setResult({ tone: 'bad', title: 'Invalid token', subtitle: 'No booking found for this code' });
      } else if (body?.code === 'ALREADY_SCANNED' || body?.duplicate) {
        setResult({
          tone: 'warn',
          title: 'Already scanned',
          subtitle: 'Ticket already used — entry denied',
          detail: body.booking ? `${body.booking.name} · ${body.booking.token}` : undefined,
        });
      } else {
        setResult({ tone: 'bad', title: 'Error', subtitle: msg });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.box}>
        <Text style={styles.label}>Ticket Token</Text>
        <TextInput
          style={styles.input}
          value={raw}
          onChangeText={(t) => { setRaw(t.toUpperCase()); setResult(null); }}
          placeholder="e.g. A1B2C3"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={6}
          keyboardType="default"
        />
        <Text style={styles.hint}>Same code shown after booking on the website.</Text>

        <Pressable
          style={[styles.button, busy && styles.buttonDisabled]}
          onPress={submit}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify & grant entry</Text>
          )}
        </Pressable>

        {result ? <ResultCard result={result} /> : null}
      </View>
    </SafeAreaView>
  );
}

function ResultCard({ result }: { result: Result }) {
  const cfg = RESULT_CONFIG[result.tone];
  return (
    <View style={[styles.card, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <View style={styles.cardRow}>
        <Ionicons name={cfg.icon} size={48} color={cfg.iconColor} />
        <View style={styles.cardText}>
          <Text style={[styles.cardTitle, { color: cfg.iconColor }]}>{result.title}</Text>
          <Text style={styles.cardSubtitle}>{result.subtitle}</Text>
        </View>
      </View>
      {result.detail ? (
        <Text style={[styles.cardDetail, { borderTopColor: cfg.border }]}>{result.detail}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  box: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 22,
    letterSpacing: 6,
    fontWeight: '600',
    color: colors.text,
    backgroundColor: colors.surface,
  },
  hint: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    marginTop: 28,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  cardDetail: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    borderTopWidth: 1,
  },
});
