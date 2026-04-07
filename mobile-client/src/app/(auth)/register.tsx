import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRegister } from '@/hooks/use-register';
import type { ProblemDetail } from '@/types/auth';
import { isAxiosError } from 'axios';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const BRAND_BLUE = '#1C3F60';
const BRAND_ORANGE = '#FF6B4A';
const DARK_BG = '#0B111A';
const DARK_SURFACE2 = '#2A3A54';
const DARK_BORDER = '#334060';
const DARK_TEXT = '#F0F6FF';
const DARK_TEXT_MUTED = '#8AABB8';
const DARK_CYAN = '#38BDF8';

// ─── Password strength helpers ────────────────────────────────────────────────
function getPasswordStrength(pwd: string): { score: number; label: string } {
  if (pwd.length === 0) return { score: 0, label: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ['', 'Faible', 'Faible', 'Moyenne', 'Fort'];
  return { score, label: labels[score] ?? 'Fort' };
}

function strengthSegmentColor(segmentIndex: number, score: number, isDark: boolean): string {
  if (score === 0) return isDark ? '#2A3A54' : '#E5E7EB';
  if (segmentIndex < score) {
    if (score <= 2) return BRAND_ORANGE;
    if (score === 3) return '#FACC15';
    return '#22C55E';
  }
  return isDark ? '#2A3A54' : '#E5E7EB';
}

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedCgu, setAcceptedCgu] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const { mutate: register, isPending } = useRegister();

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  function handleSubmit() {
    setFieldError(null);

    if (!acceptedCgu) {
      setFieldError("Vous devez accepter les conditions d'utilisation.");
      return;
    }
    if (password !== confirmPassword) {
      setFieldError('Les mots de passe ne correspondent pas.');
      return;
    }

    const displayName = `${firstName.trim()} ${lastName.trim()}`.trim() || email;

    register(
      { email, password, displayName },
      {
        onSuccess: () => router.replace('/(auth)/sport-selection' as any),
        onError: (error) => {
          if (isAxiosError(error) && error.response) {
            const problem = error.response.data as ProblemDetail;
            setFieldError(problem.detail ?? problem.title);
          } else {
            setFieldError('Une erreur inattendue est survenue. Veuillez réessayer.');
          }
        },
      },
    );
  }

  // ─── Derived colours ───────────────────────────────────────────────────────
  const iconColor = isDark ? DARK_TEXT_MUTED : '#9CA3AF';
  const inputBg = isDark ? DARK_SURFACE2 : '#FFFFFF';
  const inputBorder = isDark ? DARK_BORDER : '#E5E7EB';
  const inputText = isDark ? DARK_TEXT : '#111827';
  const inputPlaceholder = isDark ? '#506070' : '#D1D5DB';
  const labelColor = isDark ? DARK_TEXT_MUTED : '#6B7280';
  const pageBg = isDark ? DARK_BG : '#FFFFFF';
  const headerBg = isDark ? DARK_BG : '#FFFFFF';
  const headerBorder = isDark ? DARK_BORDER : '#F3F4F6';
  const headerText = isDark ? DARK_TEXT : '#111827';
  const backBtnBorder = isDark ? DARK_BORDER : '#E5E7EB';
  const backBtnColor = isDark ? DARK_TEXT_MUTED : '#374151';
  const footerTextColor = isDark ? '#506070' : '#6B7280';
  const ctaTextColor = isDark ? DARK_CYAN : '#FFFFFF';
  const ctaStyle = isDark
    ? {
        backgroundColor: '#091828',
        borderWidth: 1,
        borderColor: 'rgba(56,189,248,0.38)',
        shadowColor: DARK_CYAN,
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 0 },
        elevation: 6,
      }
    : {
        backgroundColor: BRAND_BLUE,
        shadowColor: BRAND_BLUE,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      };

  const checkboxBg = acceptedCgu ? BRAND_BLUE : 'transparent';
  const checkboxBorder = acceptedCgu ? BRAND_BLUE : (isDark ? DARK_BORDER : '#D1D5DB');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: pageBg }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <View
        style={{
          paddingTop: 56,
          paddingHorizontal: 24,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: headerBorder,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: headerBg,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: backBtnBorder,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          hitSlop={8}
          accessibilityLabel="Retour"
        >
          <Ionicons name="chevron-back" size={18} color={backBtnColor} />
        </Pressable>
        <Text style={{ fontSize: 16, fontWeight: '600', color: headerText, fontFamily: 'Inter_600SemiBold' }}>
          Créer un compte
        </Text>
      </View>

      {/* ── Form ────────────────────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32, gap: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Prénom + Nom row */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: labelColor, marginBottom: 6, fontFamily: 'Inter_500Medium' }}>
              Prénom
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: inputBorder,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 14,
                backgroundColor: inputBg,
              }}
            >
              <TextInput
                style={{ fontSize: 14, color: inputText, fontFamily: 'Inter_400Regular' }}
                placeholder="Alex"
                placeholderTextColor={inputPlaceholder}
                autoCapitalize="words"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: labelColor, marginBottom: 6, fontFamily: 'Inter_500Medium' }}>
              Nom
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: inputBorder,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 14,
                backgroundColor: inputBg,
              }}
            >
              <TextInput
                style={{ fontSize: 14, color: inputText, fontFamily: 'Inter_400Regular' }}
                placeholder="Tracker"
                placeholderTextColor={inputPlaceholder}
                autoCapitalize="words"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>
        </View>

        {/* Email */}
        <View>
          <Text style={{ fontSize: 12, fontWeight: '500', color: labelColor, marginBottom: 6, fontFamily: 'Inter_500Medium' }}>
            Email
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: inputBorder,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: inputBg,
              gap: 12,
            }}
          >
            <Ionicons name="mail-outline" size={18} color={iconColor} />
            <TextInput
              style={{ flex: 1, fontSize: 14, color: inputText, fontFamily: 'Inter_400Regular' }}
              placeholder="alex@example.com"
              placeholderTextColor={inputPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Mot de passe */}
        <View>
          <Text style={{ fontSize: 12, fontWeight: '500', color: labelColor, marginBottom: 6, fontFamily: 'Inter_500Medium' }}>
            Mot de passe
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: inputBorder,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: inputBg,
              gap: 12,
            }}
          >
            <Ionicons name="lock-closed-outline" size={18} color={iconColor} />
            <TextInput
              style={{ flex: 1, fontSize: 14, color: inputText, fontFamily: 'Inter_400Regular' }}
              placeholder="Minimum 8 caractères"
              placeholderTextColor={inputPlaceholder}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={iconColor} />
            </Pressable>
          </View>
        </View>

        {/* Confirmer le mot de passe */}
        <View>
          <Text style={{ fontSize: 12, fontWeight: '500', color: labelColor, marginBottom: 6, fontFamily: 'Inter_500Medium' }}>
            Confirmer le mot de passe
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: inputBorder,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: inputBg,
              gap: 12,
            }}
          >
            <Ionicons name="lock-open-outline" size={18} color={iconColor} />
            <TextInput
              style={{ flex: 1, fontSize: 14, color: inputText, fontFamily: 'Inter_400Regular' }}
              placeholder="Répéter le mot de passe"
              placeholderTextColor={inputPlaceholder}
              secureTextEntry={!showConfirm}
              autoComplete="new-password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Pressable onPress={() => setShowConfirm((v) => !v)} hitSlop={8}>
              <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color={iconColor} />
            </Pressable>
          </View>
        </View>

        {/* Password strength bar */}
        {password.length > 0 && (
          <View style={{ marginTop: -8 }}>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 4,
                    backgroundColor: strengthSegmentColor(i, strength.score, isDark),
                  }}
                />
              ))}
            </View>
            {strength.label ? (
              <Text style={{ fontSize: 10, color: isDark ? '#506070' : '#9CA3AF', marginTop: 4, fontFamily: 'Inter_400Regular' }}>
                Sécurité : {strength.label}
              </Text>
            ) : null}
          </View>
        )}

        {/* CGU checkbox */}
        <Pressable
          onPress={() => setAcceptedCgu((v) => !v)}
          style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 4 }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptedCgu }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: checkboxBorder,
              backgroundColor: checkboxBg,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 2,
              flexShrink: 0,
            }}
          >
            {acceptedCgu && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
          </View>
          <Text style={{ flex: 1, fontSize: 12, color: isDark ? DARK_TEXT_MUTED : '#6B7280', lineHeight: 18, fontFamily: 'Inter_400Regular' }}>
            J&apos;accepte les{' '}
            <Text style={{ color: BRAND_ORANGE, fontWeight: '500', fontFamily: 'Inter_500Medium' }}>
              Conditions d&apos;utilisation
            </Text>
            {' '}et la{' '}
            <Text style={{ color: BRAND_ORANGE, fontWeight: '500', fontFamily: 'Inter_500Medium' }}>
              Politique de confidentialité
            </Text>
          </Text>
        </Pressable>

        {/* Error */}
        {fieldError && (
          <Text style={{ fontSize: 13, color: '#EF4444', fontFamily: 'Inter_400Regular' }}>
            {fieldError}
          </Text>
        )}

        {/* CTA — min 64px touch target per UX-DR10 */}
        <Pressable
          onPress={handleSubmit}
          disabled={isPending}
          style={[
            {
              minHeight: 64,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              marginTop: 8,
              opacity: isPending ? 0.7 : 1,
            },
            ctaStyle,
          ]}
        >
          {isPending ? (
            <ActivityIndicator color={ctaTextColor} />
          ) : (
            <Text style={{ fontSize: 15, fontWeight: '600', color: ctaTextColor, fontFamily: 'Inter_600SemiBold' }}>
              Créer mon compte
            </Text>
          )}
        </Pressable>

        {/* Navigate to login */}
        <Pressable
          onPress={() => router.replace('/(auth)/login')}
          style={{ alignItems: 'center', minHeight: 48, justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 14, color: footerTextColor, fontFamily: 'Inter_400Regular' }}>
            Déjà un compte ?{' '}
            <Text style={{ fontWeight: '500', color: BRAND_ORANGE, fontFamily: 'Inter_500Medium' }}>
              Se connecter
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
