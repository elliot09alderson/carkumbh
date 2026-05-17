import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  size?: number;
};

/** Minimal wordmark for splash / login — replace assets/icon.png with a matching mark if desired */
export function ZxLogo({ size = 56 }: Props) {
  const fontSize = size * 0.92;
  return (
    <View style={styles.row}>
      <Text style={[styles.z, { fontSize }]}>Z</Text>
      <Text style={[styles.x, { fontSize }]}>X</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  z: {
    fontWeight: '200',
    color: colors.text,
    letterSpacing: -6,
    marginRight: -4,
  },
  x: {
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -2,
  },
});
