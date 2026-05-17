import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Booking, ScanStatusFilter, fetchBookings } from '../api/bookings';
import { colors } from '../theme';

const FILTERS: { key: ScanStatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'scanned', label: 'Entered' },
];

export function UsersScreen() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [status, setStatus] = useState<ScanStatusFilter>('all');
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 320);
    return () => clearTimeout(t);
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setLoading(true);
        try {
          const data = await fetchBookings({ search: debounced, status });
          if (!cancelled) setRows(data);
        } finally {
          if (!cancelled) {
            setLoading(false);
            setRefreshing(false);
          }
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [debounced, status])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings({ search: debounced, status })
      .then(setRows)
      .finally(() => {
        setRefreshing(false);
        setLoading(false);
      });
  };

  const counts = useMemo(() => {
    const entered = rows.filter((b) => b.scannedAt).length;
    const pend = rows.filter((b) => !b.scannedAt).length;
    return { entered, pend };
  }, [rows]);

  function renderItem({ item }: { item: Booking }) {
    const entered = !!item.scannedAt;
    return (
      <View style={styles.row}>
        <View style={styles.rowMain}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {item.token} · {item.number}
          </Text>
          <View style={styles.packageBadge}>
            <Text style={styles.packageText} numberOfLines={1}>
              {item.package}
            </Text>
          </View>
        </View>
        <View style={[styles.pill, entered ? styles.pillOn : styles.pillOff]}>
          <Text style={[styles.pillText, entered ? styles.pillTextOn : styles.pillTextOff]}>
            {entered ? 'Entered' : 'Pending'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.toolbar}>
        <TextInput
          style={styles.search}
          placeholder="Search name, phone, token…"
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <View style={styles.filters}>
          {FILTERS.map((f) => (
            <Pressable
              key={f.key}
              onPress={() => setStatus(f.key)}
              style={[styles.chip, status === f.key && styles.chipActive]}
            >
              <Text style={[styles.chipTxt, status === f.key && styles.chipTxtActive]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.summary}>
          Showing {rows.length} · {counts.pend} pending · {counts.entered} entered
        </Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No bookings match.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.text,
  },
  chipTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTxtActive: {
    color: '#fff',
  },
  summary: {
    fontSize: 12,
    color: colors.textMuted,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 12,
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
  },
  packageBadge: {
    alignSelf: 'flex-start',
    marginTop: 5,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  packageText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillOn: {
    backgroundColor: '#ecfdf3',
  },
  pillOff: {
    backgroundColor: '#f4f4f5',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillTextOn: {
    color: colors.success,
  },
  pillTextOff: {
    color: colors.textMuted,
  },
  empty: {
    textAlign: 'center',
    marginTop: 48,
    color: colors.textMuted,
    fontSize: 15,
  },
});
