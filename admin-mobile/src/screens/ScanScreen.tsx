import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { extractTokenFromPayload } from '../utils/token';
import { getScanError, scanToken } from '../api/bookings';
import { colors } from '../theme';

type Banner = { tone: 'ok' | 'warn' | 'bad'; title: string; detail?: string };

export function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [banner, setBanner] = useState<Banner | null>(null);
  const lockRef = useRef(false);

  const onBarcodeScanned = useCallback(
    async (event: { data: string }) => {
      if (lockRef.current) return;
      const raw = event.data;
      const token = extractTokenFromPayload(raw);
      if (!token) {
        setBanner({
          tone: 'bad',
          title: 'Unreadable code',
          detail: 'Expected a 6-character ticket token.',
        });
        return;
      }

      lockRef.current = true;
      try {
        const res = await scanToken(token);
        if (res.duplicate) {
          setBanner({
            tone: 'warn',
            title: 'Already scanned',
            detail: `${res.booking.name} · ${res.booking.token}`,
          });
        } else {
          setBanner({
            tone: 'ok',
            title: 'Entry granted',
            detail: `${res.booking.name} · ${res.booking.token}`,
          });
        }
      } catch (e) {
        const body = getScanError(e);
        const msg = body?.message || 'Scan failed';
        if (body?.code === 'UNPAID') {
          setBanner({
            tone: 'warn',
            title: 'Not paid',
            detail: body.booking
              ? `${body.booking.name} · ${body.booking.token}`
              : undefined,
          });
        } else if (body?.code === 'NOT_FOUND') {
          setBanner({ tone: 'bad', title: 'Invalid token' });
        } else if (body?.code === 'ALREADY_SCANNED' || body?.duplicate) {
          setBanner({
            tone: 'warn',
            title: 'Already scanned',
            detail: body.booking
              ? `${body.booking.name} · ${body.booking.token}`
              : undefined,
          });
        } else {
          setBanner({ tone: 'bad', title: msg });
        }
      } finally {
        setTimeout(() => {
          lockRef.current = false;
        }, 1200);
      }
    },
    []
  );

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Checking camera…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centerBox} edges={['bottom']}>
        <StatusBar style="dark" />
        <Text style={styles.need}>Camera access is required to scan tickets.</Text>
        <Pressable style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.primaryBtnText}>Allow camera</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.flex}>
      <StatusBar style="light" />
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={onBarcodeScanned}
      />
      <SafeAreaView style={styles.overlay} edges={['top']} pointerEvents="box-none">
        <Text style={styles.hint}>Align QR within the frame</Text>
      </SafeAreaView>

      {banner ? (
        <View
          style={[
            styles.banner,
            banner.tone === 'ok' && styles.bannerOk,
            banner.tone === 'warn' && styles.bannerWarn,
            banner.tone === 'bad' && styles.bannerBad,
          ]}
        >
          <Text style={styles.bannerTitle}>{banner.title}</Text>
          {banner.detail ? <Text style={styles.bannerDetail}>{banner.detail}</Text> : null}
          <Pressable onPress={() => setBanner(null)} hitSlop={12}>
            <Text style={styles.dismiss}>Dismiss</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 8,
  },
  hint: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  banner: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  bannerOk: {
    backgroundColor: '#ecfdf3',
    borderColor: '#bbf7d0',
  },
  bannerWarn: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  bannerBad: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  bannerDetail: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textMuted,
  },
  dismiss: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: colors.bg,
  },
  muted: {
    color: colors.textMuted,
  },
  need: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
